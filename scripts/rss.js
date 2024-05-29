document.getElementById('category-filter').addEventListener('change', filterArticles);

function filterArticles() {
    const category = document.getElementById('category-filter').value;
    const articles = document.querySelectorAll('.article');
    articles.forEach(article => {
        const articleCategory = article.dataset.category;
        if (category === 'all' || articleCategory === category) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
}
