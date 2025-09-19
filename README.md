# Ajay Godara — Personal Site

Static GitHub Pages site for Ajay Godara's field research, expeditions, and photography.

## Project Structure

- `index.html`, `education.html`, `research.html`, `blog.html`, `gallery.html` —
  top-level pages that load shared navigation and pull dynamic data.
- `blog-posts/` — individual expedition write-ups. Each file includes a
  `<!-- BLOG_METADATA {...} -->` block consumed by the blog listing.
- `images/gallery/fulls/` — folders of expedition photos that populate the
  gallery grid automatically.
- `data/` — generated JSON manifest files (`blog-posts.json`, `gallery.json`).
- `js/` — front-end behaviour. `blog.js` renders the blog archive; `gallery.js`
  builds the photo grid using the generated manifests.
- `scripts/` — helper scripts to keep content updates simple.

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
3. Regenerate the JSON manifests so the new entry appears on `blog.html`:

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
