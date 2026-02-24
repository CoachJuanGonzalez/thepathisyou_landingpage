# The Path Is You - Landing Page

A stunning, conversion-optimized landing page for **The Path Is You** audiobook by Juan Grey. Built with vanilla HTML, CSS, and JavaScript with Airtable backend integration via Vercel serverless functions.

---

## Features

- **Cinematic Hero Section** with parallax effects and elegant typography
- **Value Proposition Cards** highlighting key benefits
- **Lead Capture Form** with real-time validation
- **Airtable Backend Integration** via secure Vercel serverless functions
- **Social Proof Section** with testimonials
- **Fully Responsive Design** (mobile-first approach)
- **WCAG AA Accessibility Compliant**
- **Performance Optimized** with lazy loading and efficient animations
- **CASL/GDPR Ready** privacy compliance

---

## Tech Stack

- **Frontend**: HTML5, CSS3 (Custom Properties), Vanilla JavaScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Airtable
- **Hosting**: Vercel
- **Fonts**: Google Fonts (Cormorant Garamond, Montserrat)

---

## Project Structure

```
Landing_Page/
├── index.html              # Main landing page
├── styles.css              # All styles (includes responsive design)
├── script.js               # Frontend JavaScript (form handling, animations)
├── api/
│   └── submit-form.js      # Vercel serverless function for Airtable
├── vercel.json             # Vercel configuration
├── package.json            # Project dependencies
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── README.md               # This file
└── WhatsApp Image 2026-02-24 at 3.40.44 PM.jpeg  # Hero background image
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/the-path-is-you-landing-page.git
cd the-path-is-you-landing-page
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Airtable

#### A. Create Airtable Base

1. Go to [Airtable](https://airtable.com) and create a new base
2. Create a table called **"Leads"** with the following fields:

| Field Name    | Field Type        | Description                    |
|---------------|-------------------|--------------------------------|
| Email         | Email             | Lead's email address           |
| First Name    | Single line text  | Lead's first name (required)   |
| Last Name     | Single line text  | Lead's last name (optional)    |
| Source        | Single line text  | Always "thepathisyou_audiobook"|
| Submitted At  | Date & time       | Form submission timestamp      |
| Status        | Single select     | Lead status (New Lead, etc.)   |

3. Copy your **Base ID** from the URL:
   - URL format: `https://airtable.com/appXXXXXXXXXXXXXX/...`
   - Base ID: `appXXXXXXXXXXXXXX`

#### B. Get Airtable API Key

1. Go to [Airtable Account](https://airtable.com/create/tokens)
2. Create a new **Personal Access Token**
3. Give it the following scopes:
   - `data.records:read`
   - `data.records:write`
4. Select your base under "Access"
5. Copy the generated token

### 4. Configure Environment Variables

#### For Local Development:

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Airtable credentials:

```env
AIRTABLE_API_KEY=patXXXXXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
AIRTABLE_TABLE_NAME=Leads
```

#### For Vercel Deployment:

You'll add these as **Environment Variables** in Vercel dashboard (see deployment section).

### 5. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to see your landing page.

---

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit: The Path Is You landing page"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/the-path-is-you-landing-page.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [Vercel](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Click "Import"

3. **Add Environment Variables**:
   - In project settings, go to "Environment Variables"
   - Add the following:
     - `AIRTABLE_API_KEY` = `your_api_key`
     - `AIRTABLE_BASE_ID` = `your_base_id`
     - `AIRTABLE_TABLE_NAME` = `Leads`
   - Make sure to add them for **Production**, **Preview**, and **Development** environments

4. **Deploy**:
   - Click "Deploy"
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# When prompted, add environment variables:
# - AIRTABLE_API_KEY
# - AIRTABLE_BASE_ID
# - AIRTABLE_TABLE_NAME
```

---

## Environment Variables Reference

| Variable              | Description                                      | Required |
|-----------------------|--------------------------------------------------|----------|
| `AIRTABLE_API_KEY`    | Your Airtable Personal Access Token or API Key   | Yes      |
| `AIRTABLE_BASE_ID`    | Your Airtable Base ID (starts with "app...")    | Yes      |
| `AIRTABLE_TABLE_NAME` | Name of your Airtable table (default: "Leads")   | No       |

---

## Form Submission Flow

1. User fills out form (Email, First Name, Last Name [optional])
2. Frontend validates inputs in real-time
3. On submit, JavaScript sends POST request to `/api/submit-form`
4. Vercel serverless function validates data
5. Function securely submits to Airtable using API key from environment variables
6. Success message displayed to user
7. Lead data stored in Airtable with:
   - Email
   - First Name
   - Last Name (if provided)
   - Source: `thepathisyou_audiobook`
   - Submitted At timestamp
   - Status: "New Lead"

---

## Customization Guide

### Change Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --color-gold-primary: #D4AF37;     /* Gold accent color */
    --color-purple-primary: #4A3B6F;   /* CTA button color */
    /* ... other colors ... */
}
```

### Update Copy/Content

Edit text directly in `index.html`:
- Hero section: Lines 27-32
- Benefits: Lines 49-88
- Testimonials: Lines 158-207
- Author bio: Lines 219-226

### Change Form Fields

To modify form fields:
1. Update HTML in `index.html` (lines 102-147)
2. Update validation in `script.js` (lines 30-75)
3. Update Airtable schema in `api/submit-form.js` (lines 12-20)

### Add Analytics

Add Google Analytics 4 or Meta Pixel in `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Performance Optimization

- **Images**: Hero image is optimized (< 300KB recommended)
- **Fonts**: Google Fonts preloaded for performance
- **CSS**: Single stylesheet, no framework bloat
- **JS**: Vanilla JavaScript, no dependencies
- **Lazy Loading**: Intersection Observer for below-fold content
- **Animations**: Respectful of `prefers-reduced-motion`

---

## Accessibility Features (WCAG AA Compliant)

- Semantic HTML5 structure
- ARIA labels on form inputs
- Keyboard navigation support
- Focus indicators for keyboard users
- Color contrast ratio > 4.5:1
- Screen reader friendly error messages
- Alt text for all images

---

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

---

## Security & Privacy

- **Environment Variables**: Sensitive data stored in Vercel, never in code
- **HTTPS**: Automatic SSL via Vercel
- **CORS**: Configured for secure API requests
- **Input Validation**: Both client-side and server-side
- **Privacy Ready**: CASL/GDPR compliant consent flows

---

## Troubleshooting

### Form Not Submitting

1. Check browser console for errors
2. Verify environment variables are set in Vercel
3. Check Airtable API key has correct permissions
4. Verify Base ID and Table Name are correct

### Styling Issues

1. Clear browser cache
2. Check if custom fonts loaded (network tab)
3. Verify hero image path is correct

### Vercel Deployment Fails

1. Check `vercel.json` syntax
2. Ensure all environment variables are set
3. Review build logs in Vercel dashboard

---

## Next Steps / Future Enhancements

- [ ] Add email automation (welcome sequence via ConvertKit/Mailchimp)
- [ ] Integrate with audiobook hosting platform
- [ ] Add exit-intent popup for abandoning visitors
- [ ] A/B test variations (email-only vs email+name)
- [ ] Add countdown timer for urgency
- [ ] Create thank-you page with social sharing
- [ ] Implement Facebook Pixel / Google Ads conversion tracking

---

## License

MIT License - feel free to use this for your own projects.

---

## Support

For questions or issues, please open a GitHub issue or contact Juan Grey.

---

## Credits

**Design & Development**: Built with expertise in UX/UI, conversion psychology, and modern web standards.

**Author**: Juan Grey - [LinkedIn](#) | [Website](#)

---

**The path is you. The journey begins now.**
