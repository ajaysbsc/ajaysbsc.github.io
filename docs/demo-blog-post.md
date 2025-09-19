# Adding a New Expedition Post (Example)

This Markdown file demonstrates the quick workflow for publishing a new blog post using photos that already exist in `images/gallery/fulls/`.

## Example: Panchinala Glacier 2023 Retrospective

- **Hero image:** `images/gallery/fulls/Panchinala 2023/20230709130240__MG_7085~2.JPG`
- **Generated page:** `blog-posts/panchinala-glacier-2023-retrospective.html`
- **Summary:** "Field team revisit Panchinala Glacier to extend our debris-covered glacier monitoring series and refine UAV survey workflows."

### Steps

1. Run the scaffold script:

   ```bash
   python scripts/scaffold_blog_post.py "Panchinala Glacier 2023 Retrospective" \
     --category himalayas \
     --excerpt "Field notes from the 2023 Panchinala Glacier monitoring campaign." \
     --hero "images/gallery/fulls/Panchinala 2023/20230709130240__MG_7085~2.JPG" \
     --published --tags himalayas glacier monitoring
   ```

2. Replace the placeholder sections (Highlights, Imaging Workflow, Next Steps) with real expedition content and add any additional photos.
3. Regenerate the data manifest so the new post appears on `blog.html`:

   ```bash
   python scripts/generate_content_manifest.py
   ```

This same pattern works for any gallery folder—just change the hero image path and text content.
