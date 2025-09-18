/**
 * Returns a new array of blog post elements sorted by their data-date attribute.
 * @param {HTMLElement[]} posts
 * @param {('newest'|'oldest')} [order='newest']
 * @returns {HTMLElement[]} Sorted copy of the provided posts
 */
export function sortBlogPosts(posts, order = 'newest') {
    if (!Array.isArray(posts)) {
        throw new TypeError('Expected posts to be an array');
    }

    const direction = order === 'oldest' ? 1 : -1;

    return [...posts].sort((a, b) => {
        const dateA = new Date(a?.getAttribute?.('data-date'));
        const dateB = new Date(b?.getAttribute?.('data-date'));

        if (Number.isNaN(dateA) || Number.isNaN(dateB)) {
            return 0;
        }

        return direction * (dateA - dateB);
    });
}
