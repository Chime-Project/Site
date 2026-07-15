/* ==========================================================================
   Chime Health — Tailwind setup (Play CDN, no build step)

   Usage in any HTML page (after styles.css, which defines the CSS variables):

     <link rel="stylesheet" href="styles.css">
     <script src="tailwind.setup.js"></script>

   Then use Tailwind utilities that resolve to Chime tokens:
     bg-bg / bg-bg-secondary / bg-bg-elevated     (semantic surfaces)
     text-fg / text-fg-secondary / text-fg-muted  (semantic text)
     bg-primary hover:bg-primary-hover text-on-primary
     bg-accent-subtle text-accent-onSubtle        (theme-aware; swaps with data-theme)
     bg-blue-500, bg-sand-100, bg-sage-500 …      (primitive scales)
     rounded-2xl  shadow-sm  duration-fast  z-modal  blur-md

   Notes:
   - Spacing is NOT overridden: the Chime 4px scale (--spacing-1 = 4px …)
     matches Tailwind's default spacing scale exactly.
   - Colors are bound to CSS variables so `data-theme` accent switching works.
     Trade-off: opacity modifiers (e.g. bg-blue-500/50) do NOT work on
     var()-based colors — use the --opacity-* tokens or explicit rgba instead.
   ========================================================================== */
(() => {
  const steps11 = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const scale = (name, steps) =>
    Object.fromEntries(steps.map((s) => [s, `var(--color-${name}-${s})`]));

  const config = {
    /* This page is built with inline styles + styles.css, not Tailwind's reset.
       Disable Preflight so loading Tailwind only adds utilities and doesn't
       restyle existing elements (headings, borders, box-sizing, etc.). */
    corePlugins: { preflight: false },
    theme: {
      extend: {
        colors: {
          /* Primitive scales (1:1 with tokens/colors.css) */
          blue:  scale('blue',  steps11),
          sand:  scale('sand',  steps11),
          slate: scale('slate', steps11),
          green: scale('green', steps11),
          amber: scale('amber', steps11),
          red:   scale('red',   steps11),
          sky:   scale('sky',   [50, 100, 500, 600, 700]),
          sage:  scale('sage',  [100, 200, 300, 500, 600, 700, 800]),
          iris:  scale('iris',  [100, 200, 300, 500, 600, 700, 800]),
          peach: scale('peach', [100, 200, 300, 500, 600, 700, 800]),

          /* Semantic — bind components to these, never to primitives */
          bg: {
            DEFAULT: 'var(--bg-default)',
            secondary: 'var(--bg-secondary)',
            tertiary: 'var(--bg-tertiary)',
            elevated: 'var(--bg-elevated)',
          },
          fg: {
            DEFAULT: 'var(--text-default)',
            secondary: 'var(--text-secondary)',
            muted: 'var(--text-muted)',
          },
          'on-primary': 'var(--text-on-primary)',
          border: {
            DEFAULT: 'var(--border-default)',
            strong: 'var(--border-strong)',
          },
          primary: {
            DEFAULT: 'var(--primary-default)',
            hover: 'var(--primary-hover)',
            active: 'var(--primary-active)',
            subtle: 'var(--primary-subtle)',
            onSubtle: 'var(--primary-onSubtle)',
          },
          secondary: {
            DEFAULT: 'var(--secondary-default)',
            hover: 'var(--secondary-hover)',
            subtle: 'var(--secondary-subtle)',
          },
          destructive: {
            DEFAULT: 'var(--destructive-default)',
            hover: 'var(--destructive-hover)',
            subtle: 'var(--destructive-subtle)',
          },
          success: { DEFAULT: 'var(--success-default)', subtle: 'var(--success-subtle)' },
          warning: { DEFAULT: 'var(--warning-default)', subtle: 'var(--warning-subtle)' },
          error:   { DEFAULT: 'var(--error-default)',   subtle: 'var(--error-subtle)' },
          info:    { DEFAULT: 'var(--info-default)',    subtle: 'var(--info-subtle)' },

          /* Theme accent — swaps with data-theme="default|weight-loss|lab|wellness" */
          accent: {
            DEFAULT: 'var(--accent-default)',
            strong: 'var(--accent-strong)',
            hover: 'var(--accent-hover)',
            active: 'var(--accent-active)',
            subtle: 'var(--accent-subtle)',
            subtleHover: 'var(--accent-subtleHover)',
            onSubtle: 'var(--accent-onSubtle)',
            border: 'var(--accent-border)',
          },
          'focus-ring': 'var(--focus-ring)',
        },

        fontFamily: {
          sans: 'var(--font-family-base)',
        },

        /* NOTE: --text-base is 18px (not Tailwind's 16px) */
        fontSize: {
          xs:   ['var(--text-xs)',  { lineHeight: '1.5' }],
          sm:   ['var(--text-sm)',  { lineHeight: '1.5' }],
          base: ['var(--text-base)',{ lineHeight: '1.55' }],
          lg:   ['var(--text-lg)',  { lineHeight: '1.55' }],
          xl:   ['var(--text-xl)',  { lineHeight: '1.45' }],
          '2xl': ['var(--text-2xl)', { lineHeight: '1.35' }],
          '3xl': ['var(--text-3xl)', { lineHeight: '1.25' }],
          '4xl': ['var(--text-4xl)', { lineHeight: '1.15' }],
          '5xl': ['var(--text-5xl)', { lineHeight: '1.1' }],
          '6xl': ['var(--text-6xl)', { lineHeight: '1.05' }],
        },

        borderRadius: {
          xs: 'var(--radius-xs)',
          sm: 'var(--radius-sm)',
          md: 'var(--radius-md)',
          lg: 'var(--radius-lg)',
          xl: 'var(--radius-xl)',
          '2xl': 'var(--radius-2xl)',
          '3xl': 'var(--radius-3xl)',
          full: 'var(--radius-4xl)',
        },

        boxShadow: {
          xs: 'var(--shadow-xs)',
          sm: 'var(--shadow-sm)',
          md: 'var(--shadow-md)',
          lg: 'var(--shadow-lg)',
          xl: 'var(--shadow-xl)',
        },

        transitionDuration: {
          fast: 'var(--transition-fast)',
          base: 'var(--transition-base)',
          slow: 'var(--transition-slow)',
        },
        transitionTimingFunction: {
          'in-out': 'var(--ease-in-out)',
          in: 'var(--ease-in)',
        },

        zIndex: {
          dropdown: 'var(--z-dropdown)',
          sticky: 'var(--z-sticky)',
          overlay: 'var(--z-overlay)',
          modal: 'var(--z-modal)',
          popover: 'var(--z-popover)',
          toast: 'var(--z-toast)',
          tooltip: 'var(--z-tooltip)',
        },

        blur: {
          sm: 'var(--blur-sm)',
          md: 'var(--blur-md)',
          lg: 'var(--blur-lg)',
          xl: 'var(--blur-xl)',
        },

        opacity: {
          disabled: '0.45',
        },

        /* Chime desktop breakpoint as a named token (merged with Tailwind's
           defaults) so utilities never need arbitrary min-[…]/max-[…] values.
           `nav` = the 960/961 desktop threshold used across the site. */
        screens: {
          'nav': '961px',
        },
        /* Named width for the Weight Loss model column. */
        width: {
          'wl-model': '420px',
        },
        maxWidth: {
          'wl-model': '420px',
        },
      },
    },
  };

  const s = document.createElement('script');
  s.src = 'https://cdn.tailwindcss.com';
  s.onload = () => {
    window.tailwind.config = config;
  };
  document.head.appendChild(s);
})();
