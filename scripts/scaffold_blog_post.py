#!/usr/bin/env python3
"""Create a new blog post HTML file with the required metadata block.

Usage:
    python scripts/scaffold_blog_post.py "Antarctica Expedition" \
        --date 2025-03-10 --category antarctica --excerpt "Short summary" \
        --hero "images/gallery/fulls/Anatarctica 45th 2025/hero.jpg" --published

The script generates blog-posts/<slug>.html using the existing layout structure
so that the page is immediately viewable. Update the placeholder sections with
real content after the file is created.
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import textwrap
import html
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
    <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Space+Grotesk:wght@300;400;500;600;700&display=swap\" rel=\"stylesheet\">

    <style>
        :root {{
            --ice-blue: #E6F3FF;
            --glacier-blue: #B3D9FF;
            --arctic-blue: #4A90E2;
            --deep-blue: #2C5282;
            --navy-blue: #1A365D;
            --sea-blue: #006994;
            --sky-blue: #87CEEB;
            --ocean-blue: #0077BE;
            --iceberg-blue: #A0D8EF;
            --teal-blue: #008B8B;
        }}

        .font-heading {{ font-family: 'Space Grotesk', sans-serif; }}
        .font-serif {{ font-family: 'Crimson Text', serif; }}
        .font-body {{ font-family: 'Inter', sans-serif; }}

        .gradient-primary {{
            background: linear-gradient(135deg, var(--sea-blue) 0%, var(--sky-blue) 100%);
        }}

        .text-primary-custom {{ color: var(--sea-blue); }}

        .blog-content img {{
            max-width: 100%;
            height: auto;
            border-radius: 12px;
            margin: 2rem 0;
            box-shadow: 0 8px 25px rgba(0, 105, 148, 0.15);
            transition: transform 0.3s ease;
        }}

        .blog-content img:hover {{
            transform: scale(1.02);
        }}

        .blog-content h2 {{
            font-size: 1.8rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-weight: 600;
            color: var(--deep-blue);
            font-family: 'Space Grotesk', sans-serif;
        }}

        .blog-content h3 {{
            font-size: 1.5rem;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-weight: 600;
            color: var(--deep-blue);
            font-family: 'Space Grotesk', sans-serif;
        }}

        .blog-content p {{
            margin-bottom: 1.5rem;
            line-height: 1.8;
            color: #4A5568;
            font-family: 'Inter', sans-serif;
        }}

        .blog-content ul,
        .blog-content ol {{
            margin-bottom: 1.5rem;
            padding-left: 2rem;
        }}

        .blog-content blockquote {{
            border-left: 4px solid var(--arctic-blue);
            padding-left: 1rem;
            font-style: italic;
            margin: 1.5rem 0;
            color: var(--deep-blue);
            background: var(--ice-blue);
            border-radius: 8px;
        }}
    </style>
</head>
<body class=\"bg-gray-50 text-slate-900 font-body overflow-x-hidden\">
    <!-- Navigation -->
    <nav class=\"fixed w-full bg-white/95 backdrop-blur-lg shadow-lg z-50 border-b border-blue-100\">
        <div class=\"container mx-auto px-6\">
            <div class=\"flex justify-between items-center h-20\">
                <a href=\"../index.html\" class=\"text-2xl font-bold text-primary-custom font-heading\">Ajay Godara</a>
                <div class=\"hidden md:flex items-center space-x-10\">
                    <a href=\"../index.html\" class=\"text-primary-custom hover:text-sky-600 text-lg font-medium tracking-wide\">Home</a>
                    <a href=\"../index.html#about\" class=\"text-primary-custom hover:text-sky-600 text-lg font-medium tracking-wide\">About Me</a>
                    <a href=\"../education.html\" class=\"text-primary-custom hover:text-sky-600 text-lg font-medium tracking-wide\">Education</a>
                    <div class=\"relative group\">
                        <a href=\"../research-focus.html\" class=\"text-primary-custom hover:text-sky-600 text-lg font-medium tracking-wide inline-flex items-center gap-2\">
                            Research
                            <i class=\"fas fa-chevron-down text-sm\"></i>
                        </a>
                        <div class=\"absolute left-0 top-full z-50 w-64 bg-white border border-blue-100 rounded-xl shadow-xl py-3 hidden group-hover:block group-focus-within:block\">
                            <a href=\"../research-focus.html\" class=\"block px-5 py-2 text-sm text-gray-700 hover:bg-blue-50\">Research Focus</a>
                            <a href=\"../publications.html\" class=\"block px-5 py-2 text-sm text-gray-700 hover:bg-blue-50\">Publications &amp; Conferences</a>
                            <a href=\"../projects.html\" class=\"block px-5 py-2 text-sm text-gray-700 hover:bg-blue-50\">Projects</a>
                            <a href=\"../field-survey.html\" class=\"block px-5 py-2 text-sm text-gray-700 hover:bg-blue-50\">Field Survey</a>
                        </div>
                    </div>
                    <a href=\"../blog.html\" class=\"text-primary-custom hover:text-sky-600 text-lg font-medium tracking-wide\">Blog</a>
                    <a href=\"../gallery.html\" class=\"text-primary-custom hover:text-sky-600 text-lg font-medium tracking-wide\">Gallery</a>
                </div>
                <button class=\"md:hidden text-primary-custom text-2xl\" id=\"mobile-menu-button\">
                    <i class=\"fas fa-bars\"></i>
                </button>
            </div>
            <div class=\"md:hidden hidden\" id=\"mobile-menu\">
                <div class=\"py-4 space-y-4 border-t border-blue-100\">
                    <a href=\"../index.html\" class=\"block text-primary-custom hover:text-sky-600 text-lg font-medium\">Home</a>
                    <a href=\"../index.html#about\" class=\"block text-primary-custom hover:text-sky-600 text-lg font-medium\">About Me</a>
                    <a href=\"../education.html\" class=\"block text-primary-custom hover:text-sky-600 text-lg font-medium\">Education</a>
                    <div>
                        <span class=\"block text-primary-custom text-lg font-medium\">Research</span>
                        <div class=\"mt-2 ml-4 space-y-2\">\n                            <a href=\"../research.html\" class=\"block text-primary-custom hover:text-sky-600 text-base font-medium\">Research Hub</a>
                            <a href=\"../research-focus.html\" class=\"block text-primary-custom hover:text-sky-600 text-base font-medium\">Research Focus</a>
                            <a href=\"../publications.html\" class=\"block text-primary-custom hover:text-sky-600 text-base font-medium\">Publications &amp; Conferences</a>
                            <a href=\"../projects.html\" class=\"block text-primary-custom hover:text-sky-600 text-base font-medium\">Projects</a>
                            <a href=\"../field-survey.html\" class=\"block text-primary-custom hover:text-sky-600 text-base font-medium\">Field Survey</a>
                        </div>
                    </div>
                    <a href=\"../blog.html\" class=\"block text-primary-custom hover:text-sky-600 text-lg font-medium\">Blog</a>
                    <a href=\"../gallery.html\" class=\"block text-primary-custom hover:text-sky-600 text-lg font-medium\">Gallery</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Blog Post Content -->
    <main class=\"pt-28 pb-12\">
        <div class=\"container mx-auto px-4\">
            <article class=\"max-w-4xl mx-auto\">
                <header class=\"mb-10\">
                    <p class=\"text-sm uppercase tracking-widest text-blue-500 font-semibold mb-2\">{category_label}</p>
                    <h1 class=\"text-4xl font-bold mb-4\">{title}</h1>
                    <div class=\"flex items-center text-gray-600 mb-6\">
                        <span class=\"mr-4\"><i class=\"far fa-calendar-alt mr-2\"></i>{display_date}</span>
                        <span><i class=\"fas fa-tag mr-2\"></i>{category_label}</span>
                    </div>
                    <img loading=\"lazy\" src=\"{hero_article_src}\" alt=\"{title}\" class=\"w-full h-auto object-cover rounded-lg shadow-lg\">
                </header>

                <div class=\"blog-content prose lg:prose-xl max-w-none\">
{body_html}
                </div>

                <div class=\"mt-12 border-t border-gray-200 pt-8\">
                    <div class=\"flex items-center\">
                        <img loading=\"lazy\" src=\"../images/spotlight01.jpg\" alt=\"Ajay Godara\" class=\"w-16 h-16 rounded-full mr-4\">
                        <div>
                            <h3 class=\"font-bold text-lg\">Ajay Godara</h3>
                            <p class=\"text-gray-600\">Glaciologist & Field Researcher</p>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    </main>

    <footer class=\"gradient-primary text-white py-16 relative overflow-hidden\">
        <div class=\"absolute inset-0 bg-gradient-to-t from-blue-950/50 to-transparent\"></div>
        <div class=\"absolute top-0 left-0 w-full h-full opacity-15\">
            <div class=\"absolute top-5 left-5 w-20 h-20 bg-white rounded-full opacity-20 animate-pulse\"></div>
            <div class=\"absolute bottom-10 right-10 w-16 h-16 bg-teal-300 rounded-full opacity-25 animate-pulse delay-1000\"></div>
        </div>
        <div class=\"container mx-auto px-6 text-center relative z-10\">
            <div class=\"flex flex-col items-center\">
                <h3 class=\"text-2xl font-bold mb-6 font-heading text-white\">Ajay Godara</h3>
                <div class=\"flex space-x-6 mb-8\">
                    <a href=\"https://x.com/AjayGodara_IITB\" target=\"_blank\" class=\"text-teal-100 hover:text-white transition-all duration-300 text-xl transform hover:scale-125\"><i class=\"fab fa-twitter\"></i></a>
                    <a href=\"https://www.linkedin.com/in/ajay-godara-a76ab4aa/\" target=\"_blank\" class=\"text-teal-100 hover:text-white transition-all duration-300 text-xl transform hover:scale-125\"><i class=\"fab fa-linkedin\"></i></a>
                    <a href=\"https://github.com/ajaysbsc\" target=\"_blank\" class=\"text-teal-100 hover:text-white transition-all duration-300 text-xl transform hover:scale-125\"><i class=\"fab fa-github\"></i></a>
                    <a href=\"#\" class=\"text-teal-100 hover:text-white transition-all duration-300 text-xl transform hover:scale-125\"><i class=\"fas fa-envelope\"></i></a>
                </div>
                <div class=\"w-16 h-px bg-gradient-to-r from-transparent via-teal-200 to-transparent mb-4\"></div>
                <p class=\"text-teal-100 font-medium\">&copy; {year} Ajay Godara. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', function() {{
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');

            if (mobileMenuButton && mobileMenu) {{
                mobileMenuButton.addEventListener('click', () => {{
                    mobileMenu.classList.toggle('hidden');
                }});
            }}

            const initResearchDropdown = () => {{
                const navs = document.querySelectorAll('.nav-research');

                navs.forEach(nav => {{
                    const trigger = nav.querySelector('.nav-research-trigger');
                    const menu = nav.querySelector('.nav-research-menu');

                    if (!trigger || !menu) {{
                        return;
                    }}

                    let openByClick = false;

                    const openMenu = () => {{
                        menu.classList.remove('hidden');
                        nav.classList.add('nav-open-click');
                        openByClick = true;
                    }};

                    const closeMenu = () => {{
                        menu.classList.add('hidden');
                        nav.classList.remove('nav-open-click');
                        openByClick = false;
                    }};

                    trigger.addEventListener('click', (event) => {{
                        const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
                        const isSmallScreen = window.innerWidth < 1024;

                        if (isCoarsePointer || isSmallScreen) {{
                            if (!openByClick) {{
                                event.preventDefault();
                                openMenu();
                            }} else {{
                                closeMenu();
                            }}
                        }}
                    }});

                    document.addEventListener('click', (event) => {{
                        if (!openByClick) {{
                            return;
                        }}

                        if (!nav.contains(event.target)) {{
                            closeMenu();
                        }}
                    }});

                    window.addEventListener('resize', () => {{
                        if (openByClick && window.innerWidth >= 1024 && !window.matchMedia('(pointer: coarse)').matches) {{
                            closeMenu();
                        }}
                    }});
                }});
            }};

            initResearchDropdown();
        }});
    </script>
</body>
</html>
"""


def render_blog_html(
    *,
    metadata: str,
    title: str,
    category_label: str,
    display_date: str,
    hero_article_src: str,
    body_html: str,
    year: int,
) -> str:
    body_html = body_html.strip()
    if not body_html:
        body_html = "<p>Add your expedition story here.</p>"

    body_html_formatted = textwrap.indent(body_html, " " * 20)

    return BLOG_TEMPLATE.format(
        metadata=metadata,
        title=html.escape(title),
        category_label=html.escape(category_label),
        display_date=html.escape(display_date),
        hero_article_src=html.escape(hero_article_src, quote=True),
        body_html=body_html_formatted,
        year=year,
    )


def build_default_body_html(excerpt: str, hero_article_src: str) -> str:
    safe_excerpt = html.escape(excerpt) if excerpt else "Add a short summary of the expedition."
    safe_image = html.escape(hero_article_src, quote=True)

    return textwrap.dedent(
        f"""
        <p><strong>Summary:</strong> {safe_excerpt}</p>

        <h2>Highlights</h2>
        <p>Capture headline findings or stories from the expedition. Mention weather windows, scientific wins, or logistical lessons.</p>

        <h2>Field Workflow</h2>
        <p>Detail the instruments, survey plans, or data collection approaches you used. Note anything that deviated from past seasons.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <img loading="lazy" src="{safe_image}" alt="Expedition highlight image" class="rounded-lg shadow-md">
            <img loading="lazy" src="{safe_image}" alt="Additional expedition image" class="rounded-lg shadow-md">
        </div>

        <h2>Next Steps</h2>
        <p>Explain follow-up analysis, upcoming field visits, or how collaborators can access the datasets from this expedition.</p>

        <blockquote>
            <p>Replace this quote with a field note, a collaborator comment, or a reflection that adds personality to the write-up.</p>
        </blockquote>
        """
    ).strip()


def extract_excerpt_from_markdown(markdown_text: str) -> str | None:
    heading_candidate: str | None = None
    for line in markdown_text.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        is_heading = False
        if stripped.startswith('#'):
            stripped = stripped.lstrip('#').strip()
            if not stripped:
                continue
            is_heading = True
        if stripped.startswith('>'):
            stripped = stripped.lstrip('>').strip()
        if stripped.startswith('- ') or stripped.startswith('* '):
            stripped = stripped[2:].strip()
        if stripped:
            if is_heading and heading_candidate is None:
                heading_candidate = stripped[:280]
                continue
            return stripped[:280]
    return heading_candidate


def simple_markdown_to_html(markdown_text: str) -> str:
    lines = markdown_text.splitlines()
    html_lines: list[str] = []
    in_list = False
    in_ordered_list = False
    in_blockquote = False

    def close_list():
        nonlocal in_list
        if in_list:
            html_lines.append('</ul>')
            in_list = False

    def close_ordered_list():
        nonlocal in_ordered_list
        if in_ordered_list:
            html_lines.append('</ol>')
            in_ordered_list = False

    def close_blockquote():
        nonlocal in_blockquote
        if in_blockquote:
            html_lines.append('</blockquote>')
            in_blockquote = False

    for raw_line in lines:
        line = raw_line.rstrip()
        stripped = line.strip()

        if not stripped:
            close_list()
            close_ordered_list()
            close_blockquote()
            continue

        if stripped.startswith('#'):
            close_list()
            close_ordered_list()
            close_blockquote()
            level = len(stripped) - len(stripped.lstrip('#'))
            level = max(1, min(level, 6))
            content = stripped[level:].strip()
            html_lines.append(f'<h{level}>{html.escape(content)}</h{level}>')
            continue

        if stripped.startswith('- ') or stripped.startswith('* '):
            if not in_list:
                html_lines.append('<ul>')
                in_list = True
            close_ordered_list()
            content = stripped[2:].strip()
            html_lines.append(f'  <li>{html.escape(content)}</li>')
            continue

        if stripped and stripped[0].isdigit():
            parts = stripped.split('. ', 1)
            if len(parts) != 2 or not parts[0].isdigit():
                parts = stripped.split('.', 1)
            if len(parts) == 2 and parts[0].isdigit():
                if not in_ordered_list:
                    html_lines.append('<ol>')
                    in_ordered_list = True
                close_list()
                number_content = parts[1].strip()
                html_lines.append(f'  <li>{html.escape(number_content)}</li>')
                continue

        if stripped.startswith('>'):
            close_list()
            close_ordered_list()
            if not in_blockquote:
                html_lines.append('<blockquote>')
                in_blockquote = True
            content = stripped.lstrip('> ').strip()
            html_lines.append(f'  <p>{html.escape(content)}</p>')
            continue

        close_list()
        close_ordered_list()
        close_blockquote()
        html_lines.append(f'<p>{html.escape(stripped)}</p>')

    close_list()
    close_ordered_list()
    close_blockquote()
    return '\n'.join(html_lines)


def convert_markdown_to_html(markdown_text: str) -> str:
    try:
        import markdown  # type: ignore
    except ImportError:
        return simple_markdown_to_html(markdown_text)
    return markdown.markdown(
        markdown_text,
        extensions=["extra", "sane_lists", "smarty"],
        output_format="html5",
    )


def load_markdown_body(markdown_path: Path) -> tuple[str, str | None]:
    if not markdown_path.exists():
        raise SystemExit(f"Markdown file not found: {markdown_path}")

    markdown_text = markdown_path.read_text(encoding="utf-8")
    body_html = convert_markdown_to_html(markdown_text)
    excerpt = extract_excerpt_from_markdown(markdown_text)
    return body_html, excerpt


def build_metadata(args: argparse.Namespace, *, excerpt: str | None = None) -> str:
    payload = {
        "title": args.title,
        "date": args.date,
        "category": args.category,
        "excerpt": excerpt if excerpt is not None else args.excerpt,
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

    category_label = args.category.replace("-", " ").title()
    try:
        parsed_date = dt.date.fromisoformat(args.date)
        display_date = parsed_date.strftime("%B %d, %Y").replace(" 0", " ")
    except ValueError:
        display_date = args.date

    hero_src = args.hero
    if not hero_src.startswith(("http://", "https://", "../")):
        hero_article_src = f"../{hero_src}"
    else:
        hero_article_src = hero_src

    excerpt_value = (args.excerpt or "").strip()
    body_html = ""

    if args.markdown:
        markdown_path = Path(args.markdown).expanduser()
        if not markdown_path.is_absolute():
            markdown_path = (PROJECT_ROOT / markdown_path).resolve()
        body_html, md_excerpt = load_markdown_body(markdown_path)
        if not excerpt_value and md_excerpt:
            excerpt_value = md_excerpt
    metadata_excerpt = excerpt_value if excerpt_value else args.excerpt

    if not args.markdown:
        body_html = build_default_body_html(metadata_excerpt or "", hero_article_src)

    metadata = build_metadata(args, excerpt=metadata_excerpt)
    html_content = render_blog_html(
        metadata=metadata,
        title=args.title,
        category_label=category_label,
        display_date=display_date,
        hero_article_src=hero_article_src,
        body_html=body_html,
        year=dt.date.today().year,
    )

    output_path.write_text(html_content, encoding="utf-8")
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
    parser.add_argument("--markdown", help="Path to a Markdown file that contains the blog body content.")
    parser.add_argument("--force", action="store_true", help="Overwrite an existing file with the same slug.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    BLOG_DIR.mkdir(parents=True, exist_ok=True)
    output_path = create_post(args)
    print(f"Created {output_path.relative_to(PROJECT_ROOT)}")


if __name__ == "__main__":
    main()
