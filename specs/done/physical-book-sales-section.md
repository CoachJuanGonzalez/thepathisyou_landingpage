# Physical Book Sales Section

## Problem Statement

Add a premium, cinematic sales section for the physical edition of *The Path Is You* between the Author section and the Footer. The section must match the existing landing page's dark, gold-accented, cinematic aesthetic and drive conversions to a Stripe checkout link (to be provided later).

## Objectives

- Create a visually stunning "Physical Edition" sales section that feels native to the existing page
- Display book image (to be provided by user)
- Use the exact copy provided by the user
- Include a gold CTA button linking to Stripe checkout (placeholder URL until provided)
- Two pricing tiers: $29 Standard / $49 Signed Founder Edition
- Fully responsive across all breakpoints (matching existing responsive strategy)
- WCAG AA accessible
- Conversion-optimized with urgency and emotional resonance

## Technical Approach

### Design Language (Derived from Existing Site)

- **Background**: Dark gradient using `--color-black-primary` / `--color-black-secondary` (same as About section)
- **Accent**: Gold (`--color-gold-primary: #D4AF37`, `--color-gold-secondary: #C5A572`)
- **Typography**: `Cinzel` for headings, `Cormorant Garamond` for body
- **Cards**: Semi-transparent dark backgrounds with gold border accents (`rgba(212, 175, 55, 0.2)`)
- **CTA Button**: Same gold gradient button as existing (`linear-gradient(135deg, #C9A961, #D4AF37)`)
- **Dividers**: Gold gradient lines (`linear-gradient(90deg, transparent, var(--color-gold-primary), transparent)`)
- **Glow effects**: Radial gold gradients for cinematic presence

### Section Structure

```
.physical-book-section
  .container
    .physical-book-content
      .physical-book-header
        .section-divider (reuse existing class)
        h2.section-title "READY TO WALK THE PATH?"
        .section-divider
      .physical-book-body
        .physical-book-intro (subtext paragraph)
        .physical-book-layout (2-column on desktop: image left, details right)
          .physical-book-image-wrapper
            img.physical-book-cover
            .book-glow (reuse existing glow effect)
          .physical-book-details
            ul.physical-book-features (3 checkmark bullet points)
            a.cta-button-physical "GET THE PHYSICAL BOOK" -> Stripe link
            .physical-book-pricing
              .price-standard "$29 Standard"
              .price-founder "$49 Signed Founder Edition"
```

## Step-by-Step Implementation

### Phase 1: HTML Structure (index.html)

Insert new section between the closing `</section>` of `.author-section` (line 265) and the opening `<footer>` (line 268).

```html
<!-- Physical Book Section -->
<section class="physical-book-section" id="physical-book">
    <div class="container">
        <div class="physical-book-content">
            <div class="physical-book-header">
                <div class="section-divider"></div>
                <h2 class="section-title">Ready to Walk the Path?</h2>
                <div class="section-divider"></div>
            </div>

            <div class="physical-book-intro">
                <p>If this message resonates with you, the physical edition of <strong>The Path Is You</strong> is designed to stay with you.</p>
                <p>More than a book, it includes the Walking Year practice — a 13-month reflection system meant to be revisited as your life evolves.</p>
                <p class="physical-book-mirror">This is not a journal.<br>It's a companion for people who choose to live their path consciously.</p>
            </div>

            <div class="physical-book-layout">
                <div class="physical-book-image-wrapper">
                    <img src="BOOK_IMAGE_PLACEHOLDER.jpg" alt="The Path Is You - Physical Edition by Juan Grey" class="physical-book-cover">
                    <div class="book-glow"></div>
                </div>

                <div class="physical-book-details">
                    <ul class="physical-book-features">
                        <li>The complete physical edition of The Path Is You</li>
                        <li>The 13-month Walking Year reflection practice</li>
                        <li>A book designed to be revisited as your path unfolds</li>
                    </ul>

                    <a href="#STRIPE_LINK_PLACEHOLDER" target="_blank" rel="noopener noreferrer" class="cta-button-physical" aria-label="Get the physical book">
                        GET THE PHYSICAL BOOK
                    </a>

                    <div class="physical-book-pricing">
                        <span class="price-standard">$29 Standard</span>
                        <span class="price-divider">|</span>
                        <span class="price-founder">$49 Signed Founder Edition</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

### Phase 2: CSS Styling (styles.css)

Add new styles before the Footer section comment (around line 1065). Key design decisions:

```css
/* ========================================
   PHYSICAL BOOK SECTION
   ======================================== */

.physical-book-section {
    padding: calc(var(--spacing-xxl) * 2) 0;
    background: linear-gradient(180deg, var(--color-black-primary) 0%, var(--color-black-secondary) 50%, var(--color-black-primary) 100%);
    position: relative;
    overflow: hidden;
}

/* Subtle ambient glow behind the whole section */
.physical-book-section::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
    pointer-events: none;
}

.physical-book-content {
    max-width: 1000px;
    margin: 0 auto;
}

.physical-book-header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
}

.physical-book-intro {
    text-align: center;
    max-width: 700px;
    margin: 0 auto var(--spacing-xxl);
}

.physical-book-intro p {
    font-family: var(--font-serif);
    font-size: clamp(1.125rem, 2.5vw, 1.25rem);
    line-height: 1.8;
    color: rgba(245, 245, 245, 0.9);
    margin-bottom: var(--spacing-md);
}

.physical-book-intro strong {
    color: var(--color-gold-primary);
    font-weight: 600;
}

.physical-book-mirror {
    font-style: italic;
    color: var(--color-gold-secondary) !important;
    margin-top: var(--spacing-lg) !important;
    padding: var(--spacing-md);
    background: rgba(212, 175, 55, 0.05);
    border-radius: 6px;
}

/* Two-column layout: image + details */
.physical-book-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xxl);
    align-items: center;
}

.physical-book-image-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.physical-book-cover {
    width: 100%;
    max-width: 400px;
    height: auto;
    border-radius: 8px;
    box-shadow:
        0 20px 60px rgba(0, 0, 0, 0.6),
        0 0 80px rgba(212, 175, 55, 0.2);
    position: relative;
    z-index: 2;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.physical-book-cover:hover {
    transform: scale(1.03);
}

/* Features list with gold checkmarks */
.physical-book-features {
    list-style: none;
    padding: 0;
    margin-bottom: var(--spacing-xl);
}

.physical-book-features li {
    font-family: var(--font-serif);
    font-size: clamp(1.125rem, 2.5vw, 1.25rem);
    line-height: 1.8;
    color: rgba(245, 245, 245, 0.9);
    padding-left: var(--spacing-lg);
    position: relative;
    margin-bottom: var(--spacing-md);
}

.physical-book-features li::before {
    content: '\2713'; /* checkmark */
    position: absolute;
    left: 0;
    color: var(--color-gold-primary);
    font-size: 1.25rem;
    font-weight: 700;
}

/* CTA Button - matches existing gold button style */
.cta-button-physical {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 1.25rem 2.5rem;
    font-family: var(--font-display);
    font-size: 1.0625rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: #000000;
    background: linear-gradient(135deg, #C9A961 0%, #D4AF37 100%);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    transition: var(--transition-smooth);
    box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.cta-button-physical:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(212, 175, 55, 0.5);
}

/* Pricing display */
.physical-book-pricing {
    text-align: center;
    margin-top: var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
}

.price-standard {
    font-family: var(--font-serif);
    font-size: 1.125rem;
    color: var(--color-white-soft);
    font-weight: 600;
}

.price-divider {
    color: rgba(212, 175, 55, 0.4);
    font-size: 1.25rem;
}

.price-founder {
    font-family: var(--font-serif);
    font-size: 1.125rem;
    color: var(--color-gold-primary);
    font-weight: 600;
}
```

### Phase 3: Responsive Adjustments

Add to each existing media query breakpoint:

```css
/* Tablets (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
    .physical-book-layout {
        gap: var(--spacing-xl);
    }
    .physical-book-cover {
        max-width: 320px;
    }
}

/* Mobile (max-width: 767px) */
@media (max-width: 767px) {
    .physical-book-layout {
        grid-template-columns: 1fr;
        gap: var(--spacing-xl);
        text-align: center;
    }
    .physical-book-features li {
        text-align: left;
    }
    .physical-book-section {
        padding: var(--spacing-xxl) 0;
    }
}

/* Small mobile (max-width: 480px) */
@media (max-width: 480px) {
    .physical-book-cover {
        max-width: 280px;
    }
    .physical-book-pricing {
        flex-direction: column;
        gap: var(--spacing-xs);
    }
    .price-divider {
        display: none;
    }
    .cta-button-physical {
        padding: 1rem 1.5rem;
        font-size: 0.9rem;
    }
}
```

### Phase 4: Intersection Observer Animation (script.js)

The existing `script.js` likely has Intersection Observer for fade-in animations. We should add the `.physical-book-section` elements to that observer so they animate on scroll. Add `fade-in` class to key elements if needed, or hook into the existing observer.

## Placeholders to Replace Later

| Placeholder | What's needed |
|---|---|
| `BOOK_IMAGE_PLACEHOLDER.jpg` | User will provide physical book image |
| `#STRIPE_LINK_PLACEHOLDER` | User will provide Stripe checkout URL |

## Testing Strategy

1. **Visual QA**: Verify section looks cinematic and matches existing page aesthetic at all breakpoints
2. **Responsive**: Test at 320px, 375px, 480px, 768px, 1024px, 1440px, 1920px
3. **CTA button**: Verify hover states, click behavior, opens Stripe in new tab
4. **Accessibility**: Tab navigation, ARIA labels, color contrast (gold on dark), screen reader
5. **Performance**: Image optimized (<300KB), no layout shifts
6. **Scroll animation**: Elements fade in smoothly on scroll
7. **Cross-browser**: Chrome, Firefox, Safari, Edge, mobile browsers

## Success Criteria

- Section is visually indistinguishable in quality from the rest of the page
- CTA button is prominently visible and clickable
- Two pricing tiers are clearly displayed
- Fully responsive without layout breaks
- Page load performance unaffected
- User can drop in their book image and Stripe link to go live
