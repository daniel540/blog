const postsContainer = document.getElementById('blog-posts');

function createPostPreview(postData) {
    const article = document.createElement('article');
    article.className = 'blog-post';

    const date = document.createElement('p');
    date.className = 'date';
    date.textContent = postData.date;

    const title = document.createElement('h2');
    const titleLink = document.createElement('a');
    titleLink.href = `public/${postData.file}`; // This now uses the filename without the date
    titleLink.textContent = postData.title;
    titleLink.className = 'post-title-link';
    title.appendChild(titleLink);

    const preview = document.createElement('div');
    // Remove the title from the preview content
    let previewContent = postData.preview;
    const titleRegex = new RegExp(`<h1.*?>${postData.title}</h1>`);
    previewContent = previewContent.replace(titleRegex, '');
    preview.innerHTML = previewContent;

    const readMore = document.createElement('a');
    readMore.href = `public/${postData.file}`; // This now uses the filename without the date
    readMore.className = 'read-more';
    readMore.textContent = 'Read More';

    article.appendChild(date);
    article.appendChild(title);
    article.appendChild(preview);
    article.appendChild(readMore);

    return article;
}

function loadPosts() {
    if (typeof postsData !== 'undefined' && Array.isArray(postsData)) {
        postsData.forEach(post => {
            const postPreview = createPostPreview(post);
            postsContainer.appendChild(postPreview);
        });
    } else {
        console.error('postsData is not defined or is not an array');
    }
}

document.addEventListener('DOMContentLoaded', loadPosts);

// For debugging
console.log('blog.js loaded');
if (typeof postsData !== 'undefined') {
    console.log('postsData:', postsData);
} else {
    console.log('postsData is not defined');
}