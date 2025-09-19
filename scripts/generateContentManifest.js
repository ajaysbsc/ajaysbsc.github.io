import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const BLOG_DIR = path.join(projectRoot, 'blog-posts');
const GALLERY_DIR = path.join(projectRoot, 'images', 'gallery', 'fulls');
const DATA_DIR = path.join(projectRoot, 'data');

const BLOG_METADATA_REGEX = /<!--\s*BLOG_METADATA\s*(\{[\s\S]*?\})\s*-->/;

async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function readBlogMetadata(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const match = content.match(BLOG_METADATA_REGEX);

  if (!match) {
    return null;
  }

  const metadata = JSON.parse(match[1]);
  return metadata;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

async function buildBlogData() {
  const dirEntries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  const blogFiles = dirEntries.filter((entry) => entry.isFile() && entry.name.endsWith('.html'));

  const posts = [];

  for (const file of blogFiles) {
    const filePath = path.join(BLOG_DIR, file.name);
    const metadata = await readBlogMetadata(filePath);

    if (!metadata) {
      continue;
    }

    const slug = file.name.replace(/\.html$/i, '');
    const url = `blog-posts/${file.name}`;

    posts.push({
      slug,
      url,
      ...metadata,
    });
  }

  return sortByDateDesc(posts);
}

async function buildGalleryData() {
  try {
    const dirEntries = await fs.readdir(GALLERY_DIR, { withFileTypes: true });
    const galleries = dirEntries.filter((entry) => entry.isDirectory());

    const records = [];

    for (const gallery of galleries) {
      const dirPath = path.join(GALLERY_DIR, gallery.name);
      const files = await fs.readdir(dirPath);

      const images = files
        .filter((file) => /\.(jpe?g|png|webp|gif)$/i.test(file))
        .map((file) => ({
          src: path.posix.join('images/gallery/fulls', gallery.name, file),
          filename: file,
        }))
        .sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }));

      records.push({
        name: gallery.name,
        slug: slugify(gallery.name),
        count: images.length,
        coverImage: images[0]?.src ?? null,
        images,
      });
    }

    return records.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function writeJson(targetPath, data) {
  await ensureDirectory(path.dirname(targetPath));
  await fs.writeFile(targetPath, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
}

async function main() {
  const [blogPosts, galleries] = await Promise.all([
    buildBlogData(),
    buildGalleryData(),
  ]);

  await writeJson(path.join(DATA_DIR, 'blog-posts.json'), { posts: blogPosts });
  await writeJson(path.join(DATA_DIR, 'gallery.json'), { galleries });

  console.log(`Generated ${blogPosts.length} blog entries and ${galleries.length} gallery groups.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
