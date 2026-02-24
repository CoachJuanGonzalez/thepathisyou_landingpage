# Airtable Setup Instructions

## 🔧 **IMPORTANT: Update Your Airtable Fields**

The security-enhanced API now sends **two additional fields** to Airtable. You must add these to your CONTACTS table.

---

## ✅ **Required Airtable Fields**

Your **CONTACTS** table must have these fields:

| Field Name | Field Type | Required | Notes |
|------------|------------|----------|-------|
| `email` | Email | Yes | Lead's email address |
| `first_name` | Single line text | Yes | Lead's first name |
| `last_name` | Single line text | No | Lead's last name (optional) |
| `source` | Single line text | Yes | Always "thepathisyou_audiobook" |
| **`ip_address`** | **Single line text** | **NEW** | **IP address for security tracking** |
| **`submitted_at`** | **Date & time** | **NEW** | **Submission timestamp (ISO 8601)** |

---

## 📋 **Step-by-Step Setup**

### 1. Open Your Airtable Base

Go to: https://airtable.com/

Open your **ASCENSION COACHING** base → **CONTACTS** table

### 2. Add New Fields

Click the **+** button to add new fields:

#### Field 1: IP Address
- **Name:** `ip_address`
- **Type:** Single line text
- **Description:** Tracks IP address for security and spam prevention

#### Field 2: Submitted At
- **Name:** `submitted_at`
- **Type:** Date & time
- **Description:** Exact timestamp of form submission (ISO 8601 format)
- **Formatting:** Include time
- **Time format:** 24-hour
- **Timezone:** Use GMT or your local timezone

### 3. Verify Existing Fields

Make sure these fields exist and match exactly (case-sensitive):

- ✅ `email` (Email type)
- ✅ `first_name` (Single line text)
- ✅ `last_name` (Single line text)
- ✅ `source` (Single line text)

---

## 🚀 **After Adding Fields**

1. **No need to redeploy** - Vercel will use the updated code automatically
2. **Test the form** to ensure data saves correctly
3. **Monitor IP addresses** for spam/abuse patterns

---

## 📊 **What Each Field Does**

### `ip_address`
- **Security:** Identify spam sources and malicious actors
- **Compliance:** Required for some jurisdictions
- **Analytics:** Geographic insights (optional)
- **Abuse Prevention:** Block repeat offenders

### `submitted_at`
- **Accuracy:** Server-side timestamp (more reliable than client)
- **Compliance:** Audit trail for CASL/GDPR
- **Analytics:** Conversion tracking
- **Debugging:** Troubleshoot submission issues

---

## 🔍 **Example Data**

After a successful submission, you'll see:

| email | first_name | last_name | source | ip_address | submitted_at |
|-------|------------|-----------|--------|------------|--------------|
| juan@pvrpose.ai | Juan | Gonzalez | thepathisyou_audiobook | 192.168.1.1 | 2026-02-24T17:30:00.000Z |

---

## ⚠️ **Important Notes**

1. **Field names are case-sensitive** - must be exactly:
   - `ip_address` (not `IP_Address` or `ipAddress`)
   - `submitted_at` (not `Submitted At` or `submittedAt`)

2. **Field types matter** - must be exactly as specified

3. **Backward compatibility** - Old submissions without these fields will still work

---

## 🧪 **Testing**

After adding the fields:

1. Go to: https://thepathisyou-landingpage.vercel.app
2. Fill out the form
3. Submit
4. Check Airtable - you should see:
   - Your IP address in `ip_address` field
   - Current timestamp in `submitted_at` field

---

## 🔒 **Privacy Considerations**

**IP Address Storage:**
- Required for security and abuse prevention
- Can be used for geographic analytics
- Must be disclosed in privacy policy
- Can be anonymized after 30-90 days (optional)

**Timestamp Storage:**
- Standard practice for all form submissions
- Required for compliance audits
- Helps with analytics and debugging

---

## 📞 **Need Help?**

If you encounter issues:
1. Verify field names match exactly (case-sensitive)
2. Check field types are correct
3. Review Vercel deployment logs
4. Test form submission again

---

**Last Updated:** 2026-02-24
