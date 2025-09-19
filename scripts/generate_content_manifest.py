#!/usr/bin/env python3
"""Generate JSON manifests for blog posts and gallery images.

This script parses blog post metadata embedded in HTML comments and scans the
images/gallery directory to produce lightweight JSON data files consumed by the
frontend. It keeps content updates simple: drop a new blog post with a
BLOG_METADATA comment or add photos to a gallery folder, then run the script.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Iterable, List

PROJECT_ROOT = Path(__file__).resolve().parents[1]
BLOG_DIR = PROJECT_ROOT / "blog-posts"
GALLERY_DIR = PROJECT_ROOT / "images" / "gallery" / "fulls"
DATA_DIR = PROJECT_ROOT / "data"

BLOG_METADATA_REGEX = re.compile(r"<!--\s*BLOG_METADATA\s*(\{[\s\S]*?\})\s*-->")
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"}
YEAR_REGEX = re.compile(r"(19|20)\d{2}")


def slugify(value: str) -> str:
    value = re.sub(r"[^a-z0-9]+", "-", value.lower())
    return value.strip("-")


@dataclass
class BlogPost:
    slug: str
    url: str
    title: str
    date: str
    category: str
    excerpt: str
    heroImage: str
    featured: bool
    published: bool
    tags: List[str]


@dataclass
class GalleryImage:
    src: str
    filename: str


@dataclass
class GalleryGroup:
    name: str
    slug: str
    count: int
    coverImage: str | None
    year: int | None
    images: List[GalleryImage]


def read_blog_posts() -> List[BlogPost]:
    posts: List[BlogPost] = []

    for html_file in sorted(BLOG_DIR.glob("*.html")):
        text = html_file.read_text(encoding="utf-8")
        match = BLOG_METADATA_REGEX.search(text)
        if not match:
            continue

        metadata = json.loads(match.group(1))
        posts.append(
            BlogPost(
                slug=html_file.stem,
                url=f"blog-posts/{html_file.name}",
                title=metadata.get("title", ""),
                date=metadata.get("date", ""),
                category=metadata.get("category", ""),
                excerpt=metadata.get("excerpt", ""),
                heroImage=metadata.get("heroImage", ""),
                featured=bool(metadata.get("featured", False)),
                published=bool(metadata.get("published", False)),
                tags=list(metadata.get("tags", [])),
            )
        )

    posts.sort(key=lambda post: post.date, reverse=True)
    return posts


def iter_gallery_directories() -> Iterable[Path]:
    if not GALLERY_DIR.exists():
        return []
    return (path for path in sorted(GALLERY_DIR.iterdir()) if path.is_dir())


def read_gallery_groups() -> List[GalleryGroup]:
    groups: List[GalleryGroup] = []

    for directory in iter_gallery_directories():
        images: List[GalleryImage] = []
        match = YEAR_REGEX.search(directory.name)
        year = int(match.group()) if match else None
        for image_path in sorted(directory.iterdir()):
            if image_path.suffix.lower() not in IMAGE_EXTENSIONS:
                continue
            images.append(
                GalleryImage(
                    src=f"images/gallery/fulls/{directory.name}/{image_path.name}",
                    filename=image_path.name,
                )
            )

        groups.append(
            GalleryGroup(
                name=directory.name,
                slug=slugify(directory.name),
                count=len(images),
                coverImage=images[0].src if images else None,
                year=year,
                images=images,
            )
        )

    groups.sort(key=lambda group: group.name.lower())
    groups.sort(
        key=lambda group: group.year if group.year is not None else -1,
        reverse=True,
    )
    return groups


def write_json(target: Path, payload: dict) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    posts = read_blog_posts()
    galleries = read_gallery_groups()

    write_json(DATA_DIR / "blog-posts.json", {"posts": [asdict(post) for post in posts]})
    write_json(
        DATA_DIR / "gallery.json",
        {
            "galleries": [
                {
                    **asdict(group),
                    "images": [asdict(image) for image in group.images],
                }
                for group in galleries
            ]
        },
    )

    print(f"Generated {len(posts)} blog entries and {len(galleries)} gallery groups.")


if __name__ == "__main__":
    main()
