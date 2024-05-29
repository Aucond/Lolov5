document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    initializeFeeds();
    document.getElementById('add-feed').addEventListener('click', addFeed);
    document.getElementById('category-filter').addEventListener('change', filterArticles);
});

function initializeFeeds() {
    console.log('Initializing feeds');
    const feeds = JSON.parse(localStorage.getItem('feeds')) || [];
    console.log('Stored feeds:', feeds);
    feeds.forEach(feed => fetchFeed(feed));
    updateFeedList(feeds);
}

function addFeed() {
    const feedUrl = document.getElementById('feed-url').value;
    console.log('Adding feed URL:', feedUrl);
    if (!feedUrl) return;
    const feeds = JSON.parse(localStorage.getItem('feeds')) || [];
    if (!feeds.includes(feedUrl)) {
        feeds.push(feedUrl);
        localStorage.setItem('feeds', JSON.stringify(feeds));
        fetchFeed(feedUrl);
        updateFeedList(feeds);
    }
    document.getElementById('feed-url').value = ''; 
}

function fetchFeed(url) {
    console.log(`Fetching feed from URL: ${url}`);
    fetch(`https://api.rss2json.com/v1/api.json?rss_url=${url}`)
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched data:', data);
            if (data.items) {
                displayArticles(data.items, url);
            } else {
                console.error('No items found in the feed');
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}

function updateFeedList(feeds) {
    console.log('Updating feed list');
    const feedList = document.getElementById('feed-list');
    feedList.innerHTML = '';
    feeds.forEach(feed => {
        const li = document.createElement('li');
        li.className = 'feed-item';
        const feedText = document.createElement('span');
        feedText.textContent = feed;
        feedText.className = 'feed-text';
        
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.addEventListener('click', () => editFeed(feed, feedText));

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.className = 'remove-btn';
        removeButton.addEventListener('click', () => removeFeed(feed));

        li.appendChild(feedText);
        li.appendChild(editButton);
        li.appendChild(removeButton);
        feedList.appendChild(li);
    });
}

function editFeed(url, feedText) {
    console.log('Editing feed:', url);
    const input = document.createElement('input');
    input.type = 'text';
    input.value = url;
    input.className = 'edit-input';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'save-btn';
    saveButton.addEventListener('click', () => {
        const newUrl = input.value;
        console.log('Saving new URL:', newUrl);
        let feeds = JSON.parse(localStorage.getItem('feeds')) || [];
        feeds = feeds.filter(feed => feed !== url);
        feeds.push(newUrl);
        localStorage.setItem('feeds', JSON.stringify(feeds));
        fetchFeed(newUrl);
        updateFeedList(feeds);
        clearArticles(url);
        fetchFeed(newUrl); 
        location.reload(); 
    });

    feedText.replaceWith(input);
    input.insertAdjacentElement('afterend', saveButton);
}

function removeFeed(url) {
    console.log('Removing feed:', url);
    let feeds = JSON.parse(localStorage.getItem('feeds')) || [];
    feeds = feeds.filter(feed => feed !== url);
    localStorage.setItem('feeds', JSON.stringify(feeds));
    updateFeedList(feeds);
    document.querySelectorAll(`.article[data-feed="${url}"]`).forEach(article => article.remove());
}

function clearArticles(feedUrl) {
    document.querySelectorAll(`.article[data-feed="${feedUrl}"]`).forEach(article => article.remove());
}

function displayArticles(items, feedUrl) {
    console.log('Displaying articles for feed:', feedUrl);
    const articlesContainer = document.getElementById('articles');
    const allCategories = new Set();
    items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate)); 

    items.forEach(item => {
        const categories = item.categories && item.categories.length > 0 ? item.categories.map(cat => cat.trim()).join(', ') : 'Uncategorized';
        categories.split(', ').forEach(category => allCategories.add(category));
        console.log('Article categories:', categories);  

        const article = document.createElement('div');
        article.className = 'article';
        article.dataset.feed = feedUrl;
        article.dataset.categories = categories;
        article.innerHTML = `
            <img src="${item.enclosure ? item.enclosure.link : ''}" alt="Article Image" class="clickable">
            <h3 class="clickable">${item.title}</h3>
            <p class="clickable">${item.description}</p>
        `;
        articlesContainer.appendChild(article);

        article.querySelectorAll('.clickable').forEach(element => {
            element.addEventListener('click', () => openModal(item.link));
        });
    });
    initializeCategoryFilter(allCategories);
}

function initializeCategoryFilter(categories) {
    const categoryFilter = document.getElementById('category-filter');
    categoryFilter.innerHTML = '';
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All';
    categoryFilter.appendChild(allOption);

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.toLowerCase();
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

function filterArticles() {
    const selectedCategory = document.getElementById('category-filter').value;
    console.log('Selected category:', selectedCategory);  
    const articles = document.querySelectorAll('.article');

    articles.forEach(article => {
        const articleCategories = article.dataset.categories.split(', ').map(cat => cat.trim().toLowerCase());
        console.log('Article categories:', articleCategories);  
        if (selectedCategory === 'all' || articleCategories.includes(selectedCategory)) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
}

const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-body');
const span = document.getElementsByClassName('close')[0];

span.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

function openModal(url) {
    modalContent.innerHTML = `
        <iframe src="${url}" style="width:100%; height:80vh;"></iframe>
    `;
    modal.style.display = 'block';
}
