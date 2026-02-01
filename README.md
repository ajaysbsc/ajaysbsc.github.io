# Ajay Godara — Personal Site

Static GitHub Pages site for Ajay Godara's field research, expeditions, and photography.

## 🚀 Recent Updates

### CSS Architecture Upgrade
The website has been upgraded with a modern CSS architecture:
- **Centralized CSS:** All styles now in `css/main.css` (no more embedded `<style>` blocks)
- **Tailwind CSS 3.x:** Upgraded from 2.2.19
- **Fluid Typography:** Responsive font sizing using `clamp()`
- **Modern CSS Features:** Custom properties, animations, glassmorphism effects

See [CSS_UPGRADE_SUMMARY.md](CSS_UPGRADE_SUMMARY.md) for complete details.

### Enhanced Gallery (Coming Soon)
The gallery will be modernized with professional photography portfolio features:
- **Masonry Layout:** Pinterest-style responsive grid
- **Progressive Loading:** Blur-up effect for perceived performance
- **Zoom on Hover:** Smooth image scaling with rich overlays
- **EXIF Metadata:** Camera, location, and altitude display
- **Load More:** Pagination for better performance

See [GALLERY_ENHANCEMENT_GUIDE.md](GALLERY_ENHANCEMENT_GUIDE.md) for details.

## Project Structure

- `index.html`, `education.html`, `research.html`, `blog.html`, `gallery.html` —
  top-level pages that load shared navigation and pull dynamic data.
- `css/main.css` — centralized CSS architecture with design system and all component styles.
- `js/blog.js` — blog archive rendering; `gallery.js` builds photo grid using manifests.
- `blog-posts/` — individual expedition write-ups. Each file includes a
  `<!-- BLOG_METADATA {...} -->` block consumed by the blog listing.
- `images/gallery/fulls/` — folders of expedition photos that populate the
  gallery grid automatically.
- `data/` — generated JSON manifest files (`blog-posts.json`, `gallery.json`).
- `scripts/` — helper scripts to keep content updates simple and CSS upgrade automation.
- `tailwind.config.js` — Tailwind CSS v3 configuration with custom theme.

## Updating blog posts

1. Drop a hero image into `images/gallery/fulls/<folder>/` (or reuse an
   existing photo).
2. Run the blog scaffold to create a new post stub:

   ```bash
   python scripts/scaffold_blog_post.py "Expedition Title" \
     --category antarctica \
     --excerpt "One-line summary" \
     --hero "images/gallery/fulls/Anatarctica 44th 2024/DSC00355.jpg" \
     --published --tags antarctica ice
   ```

   Update the placeholder sections inside the generated HTML file.
3. (Optional) if you draft in Markdown, drop a `.md` file into `blog-posts/markdown-blog/` and pass it with `--markdown`:

   ```bash
   python scripts/scaffold_blog_post.py "Siachen Glacier Survey 2024" \
     --date 2024-02-28 \
     --category antarctica \
     --hero "images/gallery/fulls/Anatarctica 44th 2024/DSC03792.jpg" \
     --markdown blog-posts/markdown-blog/siachen-2024-survey.md \
     --published --tags antarctica survey uav
   ```

   The script converts the Markdown body into HTML, reusing the expedition layout and deriving an excerpt automatically.
4. Regenerate the JSON manifests so the new entry appears on `blog.html`:

   ```bash
   python scripts/generate_content_manifest.py
   ```

## Updating gallery images

1. Add photos to `images/gallery/fulls/<Expedition Name>/`.
2. Run the manifest generator:

   ```bash
   python scripts/generate_content_manifest.py
   ```

   The gallery page will display the new images automatically.

## Development notes

- All `<img>` elements use native lazy loading (`loading="lazy"`).
- Run tests with `npm test` (requires Node) to validate the blog sorting util.
- Deploy by pushing to `main`; GitHub Pages serves the contents directly.

## 🌐 Local Development

**Important:** The blog and gallery use ES6 JavaScript modules and require a web server to function. Opening HTML files directly (`file://`) won't work.

### Quick Start

```bash
# Start local server (requires Python 3)
./serve.sh

# Or manually:
python3 -m http.server 8000
```

Then open: `http://localhost:8000`

See [VIEWING_INSTRUCTIONS.md](VIEWING_INSTRUCTIONS.md) for more details and alternative server options.
