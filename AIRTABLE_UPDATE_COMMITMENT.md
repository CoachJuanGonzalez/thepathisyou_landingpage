# Airtable Update - New Commitment Field

## ⚠️ **IMPORTANT: Add New Field to Airtable**

You must add a new field to your Airtable CONTACTS table for the commitment checkbox.

---

## ✅ **New Field Required**

### **Field: Commitment**

| Field Name | Field Type | Options |
|------------|------------|---------|
| `commitment` | Single select | "Yes", "No" |

**Alternative:** You can use "Checkbox" type instead of Single select if you prefer.

---

## 📋 **Step-by-Step Instructions**

### **Option 1: Single Select (Recommended)**

1. Open your **CONTACTS** table in Airtable
2. Click the **+** button to add a new field
3. **Name:** `commitment`
4. **Type:** Single select
5. **Add options:**
   - `Yes` (in green or gold)
   - `No` (in gray or red)
6. Click **Create field**

### **Option 2: Checkbox**

1. Open your **CONTACTS** table in Airtable
2. Click the **+** button to add a new field
3. **Name:** `commitment`
4. **Type:** Checkbox
5. Click **Create field**

**Note:** If using Checkbox type, you'll need to update the API to send `true`/`false` instead of `"Yes"`/`"No"`.

---

## 📊 **Updated Airtable Schema**

Your CONTACTS table should now have these fields:

| Field Name | Field Type | Required | Example Value |
|------------|------------|----------|---------------|
| `email` | Email | Yes | juan@pvrpose.ai |
| `first_name` | Single line text | Yes | Juan |
| `last_name` | Single line text | No | Gonzalez |
| **`commitment`** | **Single select** | **Yes** | **"Yes"** |
| `source` | Single line text | Yes | thepathisyou_audiobook |
| `ip_address` | Single line text | Yes | 192.168.1.1 |
| `submitted_at` | Date & time | Yes | 2026-02-24T18:30:00.000Z |

---

## 🎯 **What This Field Captures**

The commitment field captures whether the user agreed to:

> "I'm receiving this early and free, and I'm open to sharing a genuine reflection on how it lands for me."

**Values:**
- **"Yes"** - User checked the box (mandatory to submit)
- **"No"** - Only if form is submitted via API without checkbox (shouldn't happen with current validation)

---

## 🔒 **Validation**

- **Client-side:** Form button disabled until checkbox is checked
- **Server-side:** API validates `commitment === true` before accepting submission
- **Result:** Only users who agree to share feedback can submit the form

---

## 🧪 **Testing**

After adding the field:

1. Go to your landing page
2. Fill out email and first name
3. Notice the "SEND ME THE AUDIOBOOK" button is **grayed out/disabled**
4. Check the commitment checkbox
5. Button becomes **active** (purple gradient)
6. Submit the form
7. Check Airtable - you should see **"Yes"** in the commitment field

---

## 📝 **Why This Field Matters**

This commitment serves as:
1. **Consent** - User agrees to provide feedback
2. **Quality Filter** - Only engaged users submit
3. **Legal Protection** - Documented agreement to share reflections
4. **Follow-up** - You can identify who committed to feedback
5. **Analytics** - Track feedback completion rates

---

## 💡 **Pro Tips**

### **Use Airtable Views:**

Create a view called **"Committed to Feedback"** with:
- Filter: `commitment = "Yes"`
- Sort: `submitted_at` (newest first)

This helps you identify who to follow up with for testimonials!

### **Automation Ideas:**

Set up an Airtable automation:
- **Trigger:** New record where `commitment = "Yes"`
- **Action:** Send follow-up email after 7 days requesting feedback
- **Tool:** Use Airtable's built-in automations or Zapier

---

## ⚙️ **If Using Checkbox Type Instead**

If you prefer Checkbox type over Single select, update the API:

**File:** `api/submit-form.js`

**Change line 85 from:**
```javascript
'commitment': data.commitment ? 'Yes' : 'No',
```

**To:**
```javascript
'commitment': data.commitment,
```

Then the field will store `true`/`false` instead of `"Yes"`/`"No"`.

---

**Last Updated:** 2026-02-24
**Status:** Required for form submissions
