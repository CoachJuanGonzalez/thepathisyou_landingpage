// Vercel Serverless Function for Airtable Integration
// This function handles form submissions and securely stores data in Airtable

const AIRTABLE_API_URL = 'https://api.airtable.com/v0';

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
                'Email': data.email,
                'First Name': data.firstName,
                'Last Name': data.lastName || '',
                'Source': data.source,
                'Submitted At': data.timestamp,
                'Status': 'New Lead'
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
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

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
        // Retrieve environment variables
        const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
        const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
        const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME || 'Leads';

        // Validate environment variables
        if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
            console.error('Missing required environment variables');
            return res.status(500).json({
                error: 'Server configuration error. Please contact support.'
            });
        }

        // Parse and validate request body
        const { email, firstName, lastName, source, timestamp } = req.body;

        if (!email || !firstName || !source) {
            return res.status(400).json({
                error: 'Missing required fields: email, firstName, and source are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Validate firstName length
        if (firstName.trim().length < 2) {
            return res.status(400).json({
                error: 'First name must be at least 2 characters'
            });
        }

        // Submit to Airtable
        const airtableResponse = await submitToAirtable(
            { email, firstName, lastName, source, timestamp },
            AIRTABLE_API_KEY,
            AIRTABLE_BASE_ID,
            AIRTABLE_TABLE_NAME
        );

        // Success response
        return res.status(200).json({
            success: true,
            message: 'Form submitted successfully',
            recordId: airtableResponse.id
        });

    } catch (error) {
        console.error('Error processing form submission:', error);

        // Handle specific error types
        if (error.message.includes('Airtable API error')) {
            return res.status(502).json({
                error: 'Unable to process your request. Please try again later.'
            });
        }

        return res.status(500).json({
            error: 'An unexpected error occurred. Please try again.'
        });
    }
}
