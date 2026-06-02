# Savannah Property Guardians

A modern, professional static website for **Savannah Property Guardians** — a trusted provider of handyman, commercial property maintenance, warehouse management, and plumbing services across the Southeast.

**Live Demo:** Deployed via GitHub Pages (see instructions below).

---

## Features

- **Beautiful, modern design** with a cohesive savanna-inspired color palette (deep forest green + rich gold + warm earth tones)
- **Custom SVG logo** featuring a stylized acacia tree inside a protective shield
- **Fully responsive** — optimized for desktop, tablet, and mobile
- **Clean URLs and modern structure** using Eleventy:
  - Home (`/`)
  - Handyman Services (`/handyman`)
  - Warehouse Management (`/warehouse`)
  - Commercial Property Maintenance (`/maintenance`)
  - Commercial Plumbing (`/plumbing`)
  - Custom 404 page
- **Interactive elements** (all in `script.js`):
  - Mobile hamburger navigation
  - Quote request modal with form validation + simulated submission
  - FAQ accordions
  - Animated statistics counters
  - Testimonial slider
  - Smooth scroll anchors
- **Modern build pipeline** using Eleventy + Tailwind CSS (no CDN in production)
- **Accessible** markup and keyboard-friendly interactions

---

## Color Palette

| Role          | Hex       | Usage                             |
| ------------- | --------- | --------------------------------- |
| Primary Green | `#1B4332` | Headers, CTAs, logo shield        |
| Gold          | `#C9A227` | Accents, buttons, highlights      |
| Terra         | `#9C6644` | Secondary accents, emergency CTAs |
| Sand          | `#F8F4E9` | Backgrounds, cards                |
| Dark Green    | `#0F2C23` | Footer, hero gradient             |

---

## Project Structure

```
/savannah-property-guardians/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Action for automatic deployment
├── src/                        # Source files (Eleventy)
│   ├── _data/
│   │   └── site.json
│   ├── _includes/
│   │   ├── layouts/
│   │   │   └── base.njk
│   │   ├── header.njk
│   │   └── footer.njk
│   ├── assets/
│   │   ├── css/
│   │   └── js/
│   ├── images/
│   ├── index.njk
│   ├── handyman.njk
│   ├── warehouse.njk
│   ├── maintenance.njk
│   ├── plumbing.njk
│   ├── 404.njk
│   ├── robots.njk
│   └── sitemap.11ty.js
│
├── docs/                       # Production build output (for GitHub Pages)
├── eleventy.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## Local Development

```bash
npm install
npm start
```

Then visit http://localhost:8080

This uses Eleventy for clean static HTML output with proper header/footer inclusion at build time (much better for SEO than the previous JavaScript injection method).

````

---

## Building for Production / GitHub Pages

**Local build:**
```bash
npm run build:gh-pages
````

This compiles Tailwind and builds the site into the `docs/` folder.

**Automatic Deployment (Recommended)**

Push to `main` — a GitHub Action (`.github/workflows/deploy.yml`) will automatically:

1. Build the site with Eleventy + Tailwind CSS
2. Deploy it to GitHub Pages

Configure GitHub Pages to use **GitHub Actions** as the source in your repository Settings → Pages.

The workflow file is located at `.github/workflows/deploy.yml`.

A `sitemap.xml` and `robots.txt` are automatically generated during the build.

## Deploying to GitHub Pages (Free Hosting)

Push to `main` — the GitHub Action will handle the rest.

In your repository settings:

- Go to **Settings → Pages**
- Set **Source** to **GitHub Actions**

### Local Production Build

If you want to build locally into the `docs/` folder (for manual deployment or testing):

```bash
npm run build:gh-pages
```

- Source: **Deploy from a branch**
- Branch: `main` (or `master`)
- Folder: `/ (root)`

4. Click **Save**. GitHub will publish your site at:

   - `https://yourusername.github.io/repo-name/` (project site)
   - or `https://yourusername.github.io/` (user/org site)

5. Wait 30–60 seconds and refresh.

### Using `/docs` folder for GitHub Pages

For project repositories where you want the site served under a subpath (without re-adding pathPrefix), you can point GitHub Pages to a `/docs` folder. However, since this site builds without a `pathPrefix`, root-relative URLs expect the site content to be at the domain root. For subpath serving without prefix, consider adding a `<base href="/your-repo/">` or reintroducing `pathPrefix` in the Eleventy config.

---

## Notes on Navigation & Paths

This site uses **root-relative paths** (e.g. `/handyman`, `/`) via Eleventy's `url` filter in templates (with permalinks using `.html` extension on disk for clean extensionless/no-trailing-slash URLs). No `pathPrefix` is configured, so the site is built to run at the root of its domain.

- Ideal for custom domains, user/org sites, or hosting at root.
- For standard GitHub project sites (served under `/repo-name/`), either:
  - Re-add `pathPrefix: "/repo-name/"` in `eleventy.config.js`, or
  - Use a custom domain on the Pages site, or
  - Serve via the `/docs` folder with appropriate base configuration.

The navigation logic (in `script.js`) extracts the current page from `window.location.pathname` by taking the last path segment and works independently of any subfolder prefix.

---

## Customization Tips

- **Logo**: The SVG logo appears in `index.html` and all service pages. Edit the `<svg>` elements to change colors or shape.
- **Phone Number**: Search and replace `(555) 123-9876` throughout the files.
- **Contact Form**: The form is front-end only (simulated). To connect to a real backend:
  - Use [Formspree](https://formspree.io), [Netlify Forms](https://www.netlify.com/products/forms/), or
  - Add your own endpoint in `script.js` inside the form submit handler.
- **Colors**: Update CSS variables in `style.css` (under `:root`) and the Tailwind config in `script.js`.
- **Testimonials**: Add or edit slides inside the `#testimonial-slider` element. The JS auto-initializes dots and rotation.

---

## Browser Support

- Chrome, Safari, Firefox, Edge (last 2 major versions)
- Fully functional on iOS Safari and Android Chrome

---

## License

This project was created for Savannah Property Guardians.  
Feel free to use the structure and code as a starting point for your own professional static sites.

---

**Built with care for property owners and facility managers who expect excellence.**

For questions about the site or services, contact the team directly through the quote modal or main phone line.

---

_© Savannah Property Guardians — Protecting what matters most._
