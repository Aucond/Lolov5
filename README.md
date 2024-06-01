Description
This project is a web-based RSS feed reader application that allows users to add, edit, and remove RSS feed URLs. It fetches articles from the provided feeds and displays them, allowing users to filter articles by category and view them in a modal window.

Features
Add, edit, and remove RSS feed URLs.
Fetch and display articles from the RSS feeds.
Filter articles by categories.
View articles in a modal window with detailed content.
Installation
To set up this project, follow these steps:

Clone the repository to your local machine.
Open the project directory.
Open index.html in a web browser.
Usage
Adding a Feed:

Enter the RSS feed URL in the input box.
Click the "Add Feed" button.
Editing a Feed:

Click the "Edit" button next to the feed you want to edit.
Modify the URL and click the "Save" button.
Removing a Feed:

Click the "Remove" button next to the feed you want to remove.
Viewing Articles:

Articles from the feeds will be displayed automatically.
Click on any article to view its content in a modal window.
Filtering Articles by Category:

Select a category from the dropdown to filter articles.
Files
index.html
The main HTML file that contains the structure of the web application.

main.js
Contains the core functionality of the RSS feed reader, including:

Initialization of feeds.
Fetching and displaying articles.
Adding, editing, and removing feeds.
Filtering articles by category.
modal.js
Handles the functionality related to the modal window, including:

Opening the modal with the article content.
Closing the modal.
rss.js
Contains the functionality for filtering articles by category.
