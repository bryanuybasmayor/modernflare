/* ==========================================================================
   Modern Flare Hair Design — Tailwind theme configuration
   --------------------------------------------------------------------------
   SINGLE SOURCE OF TRUTH for the design tokens, and it is consumed at BUILD
   time rather than in the browser:

       npm run build:css
         tailwindcss -c js/tailwind-config.js -i css/tailwind.src.css
         → css/tailwind.css   (compiled + minified, linked from index.html)

   index.html no longer loads the Tailwind CDN, so this file is not part of the
   page payload. The export at the bottom is dual-mode: Node/Tailwind CLI get
   `module.exports`, and a browser (if you ever go back to the CDN while
   prototyping) gets the same object assigned to `tailwind.config`.

   ART DIRECTION — "print editorial / gallery index"
   The palette is strictly monochrome: ink white on deep noir, with soft ash
   for body copy. There is no warm accent colour at all — depth comes from
   charcoal panels, hairline rules and scale, not from gold or pink.
   ========================================================================== */

const mfConfig = {
  // Scanned to decide which utilities are emitted. Keep these paths in sync
  // with the theme folder once this demo becomes a WordPress theme
  // (e.g. './**/*.php').
  content: ['./index.html', './js/**/*.js'],

  theme: {
    extend: {
      // ---------------------------------------------------------------------
      // Monochrome palette, taken from the Modern Flare logo.
      //
      // Three surfaces, a three-step ink scale and ONE hairline. Every grey in
      // the build resolves to something in this list — there are deliberately
      // no ad-hoc `white/40`-style values anywhere in the markup.
      // ---------------------------------------------------------------------
      colors: {
        // Surfaces, darkest first.
        noir: '#050505', // page ground
        charcoal: '#1A1A1A', // raised panel — the service band strip
        smoke: '#2A2A2A', // lifted panel — team section, index-row hover

        // Ink — one cool-grey family, three steps.
        // (Primary is Tailwind's own `white`, which needs no declaration.)
        // Contrast on noir: 19.0 : 8.0 : 5.7
        ash: '#9CA3AF', // secondary — body copy, labels
        dim: '#7E8899', // tertiary — "Closed", marginalia

        // Rules — the single colour for every border and divider on the page.
        hair: 'rgba(255,255,255,0.12)',
      },

      // ---------------------------------------------------------------------
      // Typography — 'Great Vibes' (script signature) + 'Montserrat' (all UI)
      // Families themselves are imported in css/style.css.
      // ---------------------------------------------------------------------
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        script: ['"Great Vibes"', '"Alex Brush"', 'cursive'],
      },
      fontSize: {
        // Editorial display sizes; fluid so they scale without media queries.
        // Used uppercase for the hero and the footer wordmark.
        display: ['clamp(2.75rem, 8vw, 7rem)', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
        headline: ['clamp(1.75rem, 3.6vw, 2.75rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        // 'MODERN FLARE' measured at ~7.9em wide in Montserrat 300 uppercase,
        // so the fluid size keeps ~12% headroom against the page measure and
        // the final letter is never clipped by the footer's overflow-hidden.
        wordmark: ['clamp(2rem, 10.5vw, 10rem)', { lineHeight: '0.85', letterSpacing: '-0.04em' }],
      },
      letterSpacing: {
        label: '0.32em', // tiny uppercase labels / nav
      },

      // ---------------------------------------------------------------------
      // Motion — slow entrance fades only. Nothing loops, bounces or parallaxes.
      // ---------------------------------------------------------------------
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 1s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fadeIn 1.2s ease-out both',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },

      // Layout rhythm. `max-w-frame` is the editorial page measure.
      spacing: {
        section: '6rem',
        'section-lg': '9rem',
      },
      maxWidth: {
        frame: '1560px',
      },
      backgroundImage: {
        // Soft fade blending edge-to-edge imagery into the noir body.
        'fade-noir': 'linear-gradient(to top, #050505 0%, rgba(5,5,5,0.72) 38%, rgba(5,5,5,0) 100%)',
      },
    },
  },

  plugins: [
    // -----------------------------------------------------------------------
    // Custom utilities. Kept here so the design tokens live in one place for
    // the WordPress port.
    // -----------------------------------------------------------------------
    function ({ addUtilities }) {
      addUtilities({
        // Marginalia label: uppercase, tracked-out white micro type. The 500
        // weight keeps tracked-out micro caps legible on the noir ground.
        '.eyebrow': {
          fontSize: '0.6875rem',
          fontWeight: '500',
          letterSpacing: '0.32em',
          textTransform: 'uppercase',
          color: '#FFFFFF',
        },
      });
    },
  ],
};

/* --------------------------------------------------------------------------
   Export — dual mode
   • Node / Tailwind CLI  →  module.exports
   • Browser              →  tailwind.config (only if the CDN is present)
   -------------------------------------------------------------------------- */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = mfConfig;
} else if (typeof tailwind !== 'undefined') {
  tailwind.config = mfConfig;
}
