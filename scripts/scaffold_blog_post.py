#!/usr/bin/env python3
"""Create a new blog post HTML file with the required metadata block.

Usage:
    python scripts/scaffold_blog_post.py "Antarctica Expedition" \
        --date 2025-03-10 --category antarctica --excerpt "Short summary" \
        --hero images/gallery/fulls/Anatarctica\ 45th\ 2025/hero.jpg --published

The script generates blog-posts/<slug>.html using the existing layout structure
so that the page is immediately viewable. Update the placeholder sections with
real content after the file is created.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = PROJECT_ROOT / "blog-posts"

BLOG_TEMPLATE = """<!DOCTYPE html>
<!-- BLOG_METADATA {metadata} -->
<html lang=\"en\">
<head>
    <meta charset=\"UTF-8\">
    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
    <title>{title} - Ajay Godara</title>
    <link href=\"https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css\" rel=\"stylesheet\">
    <link rel=\"stylesheet\" href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css\">
    <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">
    <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>
    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Text:wght@400;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap\" rel=\"stylesheet\">
</head>
<body class=\"bg-gray-50 text-slate-900 font-inter overflow-x-hidden\">
    <!-- Navigation -->
    <nav class=\"fixed w-full bg-white/95 backdrop-blur-lg shadow-lg z-50 border-b border-blue-100\">
        <div class=\"container mx-auto px-6\">
            <div class=\"flex justify-between items-center h-20\">
                <a href=\"../index.html\" class=\"text-2xl font-bold text-primary-custom font-heading\">Ajay Godara</a>
                <div class=\"hidden md:flex space-x-10\">
                    <a href=\"../index.html\" class=\"text-primary-custom hover:text-sky-600 text-lg font-medium tracking-wide\">Home</a>
                    <a href=\"../index.html#about\" class=\"text-primary-custom hover:text-sky-600 text-lg font-medium tracking-wide\">About Me</a>
                    <a href=\"../education.html\" class=\"text-primary-custom hover:text-sky-600 text-lg font-medium tracking-wide\">Education</a>
                    <a href=\"../research.html\" class=\"text-primary-custom hover:text-sky-600 text-lg font-medium tracking-wide\">Research</a>
                    <a href=\"../blog.html\" class=\"text-primary-custom hover:text-sky-600 text-lg font-medium tracking-wide\">Blog</a>
                    <a href=\"../gallery.html\" class=\"text-primary-custom hover:text-sky-600 text-lg font-medium tracking-wide\">Gallery</a>
                </div>
                <button class=\"md:hidden text-primary-custom text-2xl\" id=\"mobile-menu-button\">
                    <i class=\"fas fa-bars\"></i>
                </button>
            </div>
            <!-- Mobile Menu -->
            <div class=\"md:hidden hidden\" id=\"mobile-menu\">
                <div class=\"py-4 space-y-4 border-t border-blue-100\">
                    <a href=\"../index.html\" class=\"block text-primary-custom hover:text-sky-600 text-lg font-medium\">Home</a>
                    <a href=\"../index.html#about\" class=\"block text-primary-custom hover:text-sky-600 text-lg font-medium\">About Me</a>
                    <a href=\"../education.html\" class=\"block text-primary-custom hover:text-sky-600 text-lg font-medium\">Education</a>
                    <a href=\"../research.html\" class=\"block text-primary-custom hover:text-sky-600 text-lg font-medium\">Research</a>
                    <a href=\"../blog.html\" class=\"block text-primary-custom hover:text-sky-600 text-lg font-medium\">Blog</a>
                    <a href=\"../gallery.html\" class=\"block text-primary-custom hover:text-sky-600 text-lg font-medium\">Gallery</a>
                </div>
            </div>
        </div>
    </nav>

    <main class=\"pt-32 pb-20\">
        <article class=\"container mx-auto px-4 max-w-4xl bg-white rounded-2xl shadow-xl border border-blue-100\">
            <header class=\"pt-10 pb-6 text-center\">
                <p class=\"text-sm uppercase tracking-widest text-blue-500 font-semibold mb-2\">{category}</p>
                <h1 class=\"text-4xl font-bold text-gray-900 font-crimson mb-4\">{title}</h1>
                <p class=\"text-sm text-gray-500\">{date}</p>
            </header>
            <figure class=\"px-6 pb-6\">
                <img loading=\"lazy\" src=\"{hero_image}\" alt=\"{title}\" class=\"w-full h-auto rounded-xl shadow-lg\">
                <figcaption class=\"mt-3 text-sm text-gray-500 text-center\">Describe the hero image here.</figcaption>
            </figure>
            <section class=\"prose prose-lg max-w-none px-6 pb-10 leading-relaxed text-gray-700\">
                <p><strong>Summary:</strong> {excerpt}</p>

                <h2>Background</h2>
                <p>Replace this section with the expedition background, objectives, and preparation details.</p>

                <h2>Field Highlights</h2>
                <p>Share the most important findings, interesting stories, or technical insights.</p>

                <h2>Next Steps</h2>
                <p>Document follow-up work, data-processing plans, or how this expedition fits into the larger research agenda.</p>
            </section>
        </article>
    </main>

    <footer class=\"gradient-primary text-white py-10 mt-12\">
        <div class=\"container mx-auto px-4 text-center\">
            <p class=\"font-medium\">&copy; {year} Ajay Godara. All rights reserved.</p>
        </div>
    </footer>

    <script>
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenuButton && mobileMenu) {{
            mobileMenuButton.addEventListener('click', () => {{
                mobileMenu.classList.toggle('hidden');
            }});
        }}
    </script>
</body>
</html>
"""


def build_metadata(args: argparse.Namespace) -> str:
    payload = {
        "title": args.title,
        "date": args.date,
        "category": args.category,
        "excerpt": args.excerpt,
        "heroImage": args.hero,
        "featured": args.featured,
        "published": args.published,
        "tags": args.tags,
    }
    return json.dumps(payload, ensure_ascii=False)


def create_post(args: argparse.Namespace) -> Path:
    slug = args.slug or args.title.lower().strip().replace(" ", "-")
    slug = "".join(ch for ch in slug if ch.isalnum() or ch == "-")
    output_path = BLOG_DIR / f"{slug}.html"
    if output_path.exists() and not args.force:
        raise SystemExit(f"Error: {output_path} already exists. Use --force to overwrite.")

    metadata = build_metadata(args)
    html = BLOG_TEMPLATE.format(
        metadata=metadata,
        title=args.title,
        category=args.category.title(),
        date=args.date,
        excerpt=args.excerpt,
        hero_image=args.hero,
        year=dt.date.today().year,
    )
    output_path.write_text(html, encoding="utf-8")
    return output_path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Scaffold a new blog post HTML file.")
    parser.add_argument("title", help="Post title, used to derive the slug by default.")
    parser.add_argument("--slug", help="Optional custom slug for the filename.")
    parser.add_argument("--date", default=dt.date.today().isoformat(), help="Publication date (YYYY-MM-DD).")
    parser.add_argument("--category", default="antarctica", help="Post category keyword (antarctica, himalayas, nepal, ...).")
    parser.add_argument("--excerpt", default="", help="Short summary for cards and SEO.")
    parser.add_argument("--hero", default="images/gallery/fulls/placeholder.jpg", help="Path to the hero image.")
    parser.add_argument("--featured", action="store_true", help="Mark the post as featured in the listing.")
    parser.add_argument("--published", action="store_true", help="Expose the post on the public listing.")
    parser.add_argument("--tags", nargs="*", default=[], help="Optional tag keywords.")
    parser.add_argument("--force", action="store_true", help="Overwrite an existing file with the same slug.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    output_path = create_post(args)
    print(f"Created {output_path.relative_to(PROJECT_ROOT)}")


if __name__ == "__main__":
    main()
