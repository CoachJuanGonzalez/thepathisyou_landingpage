# Security & Privacy Documentation

## Security Measures Implemented

This landing page implements enterprise-grade security measures to protect against hacking, spam, and data breaches.

---

## 🛡️ **1. Rate Limiting**

**Protection Against:** Spam, brute force attacks, DDoS

**Implementation:**
- **3 submissions per IP address per minute**
- In-memory rate limiting using IP-based tracking
- Automatic cleanup of expired rate limit entries
- Returns 429 (Too Many Requests) when limit exceeded

**Location:** `api/submit-form.js` (lines 46-63)

---

## 🤖 **2. Honeypot Bot Detection**

**Protection Against:** Automated bot submissions, spam

**Implementation:**
- Hidden "website" field in form (invisible to humans)
- CSS positioned off-screen with zero opacity
- Bots auto-fill all fields and trigger detection
- Fake success response to fool bots (data not saved)

**Location:**
- HTML: `index.html` (honeypot field)
- CSS: `styles.css` (.honeypot class)
- API: `api/submit-form.js` (lines 167-175)

---

## 🧹 **3. Input Sanitization**

**Protection Against:** XSS attacks, SQL injection, script injection

**Implementation:**
- Strips all HTML tags and scripts
- Removes dangerous characters (`<`, `>`, `"`, `'`)
- Limits input length to 255 characters
- Converts email to lowercase
- Applied to ALL user inputs before processing

**Location:** `api/submit-form.js` (lines 14-25)

---

## ✅ **4. Input Validation**

**Protection Against:** Invalid data, malicious payloads

**Implementation:**

### Email Validation:
- Strict RFC-compliant email regex
- Blocks disposable/temporary email domains:
  - tempmail.com, throwaway.email, 10minutemail.com
  - guerrillamail.com, mailinator.com, maildrop.cc
  - temp-mail.org, getnada.com
- Case-insensitive validation

### Name Validation:
- First name: 2-50 characters, letters only (a-z, A-Z, spaces, hyphens, apostrophes)
- Last name: Same rules (optional)
- Blocks numbers and special characters

### Source Validation:
- Must exactly match: `thepathisyou_audiobook`
- Prevents form injection attacks

**Location:** `api/submit-form.js` (lines 27-44, 184-216)

---

## 🔒 **5. CSRF Protection**

**Protection Against:** Cross-Site Request Forgery

**Implementation:**
- Timestamp validation (5-minute window)
- Rejects submissions with timestamps:
  - More than 5 minutes old
  - In the future
- Prevents replay attacks

**Location:** `api/submit-form.js` (lines 225-235)

---

## 🌐 **6. CORS Security**

**Protection Against:** Unauthorized cross-origin requests

**Implementation:**
- Whitelist of allowed origins:
  - `https://thepathisyou-landingpage.vercel.app`
  - `http://localhost:3000` (development only)
  - `https://thepathisyou.com` (custom domain)
- Rejects requests from unauthorized domains
- Credentials allowed only from whitelisted origins

**Location:** `api/submit-form.js` (lines 112-127)

---

## 🛡️ **7. Security Headers**

**Protection Against:** XSS, clickjacking, MIME sniffing, data leaks

**Headers Implemented:**

| Header | Value | Purpose |
|--------|-------|---------|
| `X-Content-Type-Options` | nosniff | Prevents MIME sniffing |
| `X-Frame-Options` | DENY | Prevents clickjacking |
| `X-XSS-Protection` | 1; mode=block | Enables XSS filter |
| `Referrer-Policy` | strict-origin-when-cross-origin | Limits referrer info |
| `Permissions-Policy` | geolocation=(), microphone=(), camera=() | Disables unnecessary APIs |
| `Strict-Transport-Security` | max-age=31536000 | Forces HTTPS for 1 year |
| `Content-Security-Policy` | (see below) | Prevents XSS and injection attacks |

**CSP Policy:**
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: https:;
connect-src 'self' https://api.airtable.com;
```

**Location:**
- API: `api/submit-form.js` (lines 105-110)
- Vercel: `vercel.json` (global headers)

---

## 🔐 **8. Environment Variable Security**

**Protection Against:** API key exposure, credential theft

**Implementation:**
- API keys stored in Vercel environment variables (encrypted at rest)
- NEVER committed to Git (`.gitignore` protection)
- Accessed only server-side via `process.env`
- Not exposed to client-side JavaScript
- Separate variables for development/preview/production

**Environment Variables:**
- `AIRTABLE_API_KEY` - Airtable Personal Access Token
- `AIRTABLE_BASE_ID` - Airtable Base identifier
- `AIRTABLE_TABLE_NAME` - Target table name

**Location:** `.env.example` (template only, no real values)

---

## 📊 **9. IP Address Logging**

**Protection Against:** Abuse tracking, forensics

**Implementation:**
- Client IP address captured and logged
- Stored in Airtable with each submission
- Useful for:
  - Identifying spam sources
  - Blocking malicious IPs
  - Compliance audits
  - Investigating security incidents

**Location:** `api/submit-form.js` (lines 65-71, 245)

---

## 🚫 **10. Error Handling Security**

**Protection Against:** Information disclosure

**Implementation:**
- Generic error messages to users
- Detailed errors logged server-side only
- Never expose:
  - Internal error details
  - Stack traces
  - Database structure
  - API keys
  - Environment configuration

**Location:** `api/submit-form.js` (lines 258-265)

---

## 📋 **11. CASL/PIPEDA/GDPR Compliance**

**Privacy Compliance Features:**

### Data Collection Transparency:
- Clear form labels indicate what data is collected
- Email, First Name, Last Name, IP Address, Source
- Timestamp of submission

### Minimal Data Collection:
- Only essential fields required (email, first name)
- Last name is optional
- No unnecessary tracking

### User Consent:
- Form submission implies consent
- Can add explicit checkbox if needed

### Data Security:
- Encrypted transmission (HTTPS)
- Secure storage in Airtable
- Access controls on Airtable base

### User Rights Support:
- Data deletion requests (manual via Airtable)
- Data access requests (export from Airtable)
- Data portability (CSV export available)

---

## 🔒 **12. HTTPS Enforcement**

**Protection Against:** Man-in-the-middle attacks, eavesdropping

**Implementation:**
- Automatic HTTPS via Vercel
- HSTS header forces HTTPS for 1 year
- No mixed content (all resources served via HTTPS)

**Location:** Vercel automatic + `vercel.json` HSTS header

---

## 🧪 **Security Testing Checklist**

- [x] SQL Injection prevention (N/A - no SQL database)
- [x] XSS prevention (input sanitization + CSP)
- [x] CSRF protection (timestamp validation)
- [x] Rate limiting (3 req/min per IP)
- [x] Bot detection (honeypot field)
- [x] Input validation (all fields)
- [x] HTTPS enforcement (Vercel + HSTS)
- [x] Security headers (7 headers implemented)
- [x] CORS restrictions (whitelist only)
- [x] Error handling (no info disclosure)
- [x] Environment variable security (Vercel secrets)
- [x] Disposable email blocking (8 domains)

---

## 🚨 **Incident Response**

If you suspect a security breach:

1. **Check Vercel logs** for suspicious activity:
   ```
   vercel logs <deployment-url>
   ```

2. **Review Airtable data** for anomalies:
   - Multiple submissions from same IP
   - Suspicious email patterns
   - Honeypot triggers

3. **Block malicious IPs** (if needed):
   - Add to rate limit blacklist
   - Use Vercel firewall rules

4. **Rotate credentials** (if compromised):
   - Generate new Airtable API token
   - Update Vercel environment variables

---

## 📝 **Privacy Policy Requirements**

**Required Privacy Policy Sections:**

1. **What data we collect:**
   - Email address
   - First name
   - Last name (optional)
   - IP address
   - Submission timestamp

2. **How we use it:**
   - Send free audiobook
   - Email communications (with consent)
   - Analytics and improvement

3. **How we protect it:**
   - Encrypted transmission (HTTPS)
   - Secure storage (Airtable)
   - Access controls
   - Regular security audits

4. **User rights:**
   - Access your data
   - Delete your data
   - Opt-out of emails
   - Data portability

5. **Contact information:**
   - Privacy officer email
   - Data deletion request process

---

## 🔄 **Regular Security Maintenance**

**Monthly:**
- Review Vercel logs for suspicious activity
- Check Airtable for spam submissions
- Update disposable email domain list

**Quarterly:**
- Review and update dependencies
- Security audit of code
- Penetration testing (optional)

**Annually:**
- Review privacy policy compliance
- Update security documentation
- Renew SSL certificates (automatic via Vercel)

---

## 🛠️ **Security Configuration Summary**

| Feature | Status | Effectiveness |
|---------|--------|---------------|
| Rate Limiting | ✅ Enabled | High |
| Honeypot | ✅ Enabled | High |
| Input Sanitization | ✅ Enabled | Critical |
| Input Validation | ✅ Enabled | Critical |
| CSRF Protection | ✅ Enabled | Medium |
| CORS Restrictions | ✅ Enabled | High |
| Security Headers | ✅ Enabled | High |
| HTTPS | ✅ Enabled | Critical |
| Environment Security | ✅ Enabled | Critical |
| Error Handling | ✅ Enabled | Medium |
| IP Logging | ✅ Enabled | Medium |
| Disposable Email Block | ✅ Enabled | Medium |

---

## 📞 **Security Contact**

For security concerns or to report vulnerabilities, contact:
- **Email:** security@juangrey.com (update with actual email)
- **Response Time:** 24-48 hours

---

**Last Updated:** 2026-02-24
**Security Level:** Enterprise-Grade
**Compliance:** CASL, PIPEDA, GDPR Ready
