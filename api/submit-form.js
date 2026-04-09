// Vercel Serverless Function for Airtable Integration
// Security-hardened with rate limiting, input sanitization, and spam protection

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

// In-memory rate limiting (per IP address)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3; // Max 3 submissions per minute per IP

// Honeypot field for bot detection
const HONEYPOT_FIELD = 'website'; // Bots will fill this, humans won't see it

// Input sanitization function
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';

    // Remove any HTML tags, scripts, and dangerous characters
    return input
        .trim()
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .replace(/[<>\"']/g, '')
        .substring(0, 255); // Limit length
}

// Email validation with stricter rules
function validateEmail(email) {
    // Stricter email regex to prevent injection
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!emailRegex.test(email)) return false;

    // Block disposable/temporary email domains
    const disposableDomains = [
        'tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com',
        'mailinator.com', 'maildrop.cc', 'temp-mail.org', 'getnada.com'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) return false;

    return true;
}

// Rate limiting check
function checkRateLimit(ip) {
    const now = Date.now();
    const userRequests = rateLimitMap.get(ip) || [];

    // Remove requests outside the time window
    const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
        return false; // Rate limit exceeded
    }

    // Add current request
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);

    return true;
}

// Get client IP address
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
           req.headers['x-real-ip'] ||
           req.connection?.remoteAddress ||
           'unknown';
}

// Helper function to make Airtable API request
async function submitToAirtable(data, apiKey, baseId, tableName) {
    const url = `${AIRTABLE_API_URL}/${baseId}/${tableName}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fields: {
                'email': data.email,
                'first_name': data.firstName,
                'last_name': data.lastName || '',
                'source': data.source,
                'ip_address': data.ipAddress,
                'submitted_at': data.timestamp
            }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Airtable API error: ${response.status}`);
    }

    return await response.json();
}

// Main serverless function handler
export default async function handler(req, res) {
    // Security Headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Strict CORS - only allow your domain
    const allowedOrigins = [
        'https://thepathisyou-landingpage.vercel.app',
        'http://localhost:3000', // For local development
        'https://thepathisyou.com' // Add your custom domain if you have one
    ];

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get client IP for rate limiting
        const clientIP = getClientIP(req);

        // Check rate limiting
        if (!checkRateLimit(clientIP)) {
            return res.status(429).json({
                error: 'Too many requests. Please try again in a few minutes.'
            });
        }

        // Retrieve environment variables
        const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
        const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
        const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'CONTACTS';

        // Validate environment variables
        if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
            console.error('Missing required environment variables');
            return res.status(500).json({
                error: 'Server configuration error. Please contact support.'
            });
        }

        // Parse and validate request body
        const { email, firstName, lastName, source, timestamp, website } = req.body;

        // Honeypot check - if 'website' field is filled, it's likely a bot
        if (website && website.trim().length > 0) {
            console.warn(`Honeypot triggered for IP: ${clientIP}`);
            // Return success to fool the bot, but don't save data
            return res.status(200).json({
                success: true,
                message: 'Form submitted successfully'
            });
        }

        // Validate required fields
        if (!email || !firstName || !source) {
            return res.status(400).json({
                error: 'Missing required fields'
            });
        }

        // Sanitize all inputs
        const sanitizedEmail = sanitizeInput(email).toLowerCase();
        const sanitizedFirstName = sanitizeInput(firstName);
        const sanitizedLastName = sanitizeInput(lastName || '');
        const sanitizedSource = sanitizeInput(source);

        // Validate email format and block disposable emails
        if (!validateEmail(sanitizedEmail)) {
            return res.status(400).json({
                error: 'Invalid email address. Please use a valid email.'
            });
        }

        // Validate first name
        if (sanitizedFirstName.length < 2 || sanitizedFirstName.length > 50) {
            return res.status(400).json({
                error: 'First name must be between 2 and 50 characters'
            });
        }

        // Validate first name doesn't contain numbers or special chars (basic name validation)
        if (!/^[a-zA-Z\s\-']+$/.test(sanitizedFirstName)) {
            return res.status(400).json({
                error: 'First name contains invalid characters'
            });
        }

        // Validate last name if provided
        if (sanitizedLastName && !/^[a-zA-Z\s\-']*$/.test(sanitizedLastName)) {
            return res.status(400).json({
                error: 'Last name contains invalid characters'
            });
        }

        // Verify source matches expected value
        const validSources = ['thepathisyou_audiobook', 'thepathisyou_next_edition'];
        if (!validSources.includes(sanitizedSource)) {
            return res.status(400).json({
                error: 'Invalid form source'
            });
        }

        // Submit to Airtable
        const airtableResponse = await submitToAirtable(
            {
                email: sanitizedEmail,
                firstName: sanitizedFirstName,
                lastName: sanitizedLastName,
                source: sanitizedSource,
                timestamp: new Date().toISOString(),
                ipAddress: clientIP
            },
            AIRTABLE_API_KEY,
            AIRTABLE_BASE_ID,
            AIRTABLE_TABLE_NAME
        );

        // Success response - don't expose internal details
        return res.status(200).json({
            success: true,
            message: 'Form submitted successfully'
        });

    } catch (error) {
        console.error('Error processing form submission:', error);

        // Don't expose internal error details to client
        return res.status(500).json({
            error: 'An error occurred. Please try again later.'
        });
    }
}
