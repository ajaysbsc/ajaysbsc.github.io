import { sortBlogPosts } from '../js/blog.js';

describe('sortBlogPosts', () => {
  const createPost = (id, date) => {
    const element = document.createElement('article');
    element.className = 'blog-post';
    element.setAttribute('data-date', date);
    element.textContent = id;
    return element;
  };

  test('sorts posts with newest first by default', () => {
    const posts = [
      createPost('early', '2023-01-01'),
      createPost('mid', '2023-06-15'),
      createPost('latest', '2024-02-20')
    ];

    const sorted = sortBlogPosts(posts);

    expect(sorted.map(post => post.textContent)).toEqual(['latest', 'mid', 'early']);
  });

  test('sorts posts with oldest first when requested', () => {
    const posts = [
      createPost('recent', '2024-03-01'),
      createPost('oldest', '2022-12-25'),
      createPost('middle', '2023-08-10')
    ];

    const sorted = sortBlogPosts(posts, 'oldest');

    expect(sorted.map(post => post.textContent)).toEqual(['oldest', 'middle', 'recent']);
  });

  test('does not mutate the original posts array', () => {
    const posts = [
      createPost('one', '2023-04-02'),
      createPost('two', '2023-04-03')
    ];

    sortBlogPosts(posts, 'newest');

    expect(posts.map(post => post.textContent)).toEqual(['one', 'two']);
  });
});
