window.onload = function () {
    fetch("./assets/data/articles.json")
        .then((result) => result.json())
        .then((data) =>
            data.forEach((article) => {
                if (article.isPrimaryFeatured) {
                    loadPrimaryFeaturedArticle(article);
                }
                if (article.isSecondaryFeatured) {
                    createSecondaryFeaturedList(article);
                }
                if (article.isNew) {
                    createNewArticles(article);
                }
            })
        );
};

/**
 * Creates the article preview element for the main featured article and append
 * it to the landing page.
 * @param {Object} article  Article object
 */
function loadPrimaryFeaturedArticle(article) {
    const container = document.getElementById("primary-featured-container");

    // Image
    const image = document.createElement("img");
    image.setAttribute("src", article.imgMobile);
    image.setAttribute("alt", article.imgAlt);
    image.setAttribute("loading", "lazy");

    // Link
    const link = document.createElement("a");
    link.setAttribute("href", article.url);
    link.classList.add("button-link");
    const linkText = document.createTextNode("Read more");
    link.appendChild(linkText);

    // Add to container
    container.appendChild(image);
    container.appendChild(
        createArticleHeading(article.title, article.url, false)
    );
    container.appendChild(createPreviewDescription(article.previewDesc));
    container.appendChild(link);
}

/**
 * Create the element of articles and append them to the numbered list on the
 * landing page.
 * @param {Object} article  Article object
 */
function createSecondaryFeaturedList(article) {
    const list = document.getElementById("secondary-featured-list");
    const listItem = document.createElement("li");

    // Image
    const image = document.createElement("img");
    image.setAttribute("src", article.img);
    image.setAttribute("alt", article.imgAlt);
    image.setAttribute("loading", "lazy");

    // Add to list item
    listItem.appendChild(image);
    listItem.appendChild(
        createArticleHeading(article.title, article.url, true)
    );
    listItem.appendChild(createPreviewDescription(article.previewDesc));

    // Add to list
    list.appendChild(listItem);
}

/**
 * Create the element of articles showing in the "New" section and append it to
 * the landing page.
 * @param {Object} article  Article Object
 */
function createNewArticles(article) {
    const container = document.getElementById("new-articles-container");
    const div = document.createElement("div");

    // Add to div
    div.appendChild(createArticleHeading(article.title, article.url, true));
    div.appendChild(createPreviewDescription(article.previewDesc));

    // Add to container
    container.appendChild(div);
}

/**
 * Create a heading element for an article
 * @param {String} title    Heading text
 * @param {String} url      URL of article
 * @param {Boolean} hasLink If this heading should also contain a link to the
 *                          article
 * @returns                 Heading element
 */
function createArticleHeading(title, url, hasLink) {
    const heading = document.createElement("h2");
    const headingText = document.createTextNode(title);

    if (hasLink) {
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.appendChild(headingText);
        heading.appendChild(link);
    } else {
        heading.appendChild(headingText);
    }

    return heading;
}

/**
 * Creates a paragraph element of the article preview text.
 * @param {String} text Description text
 * @returns             Paragraph element with description text
 */
function createPreviewDescription(text) {
    const paragraph = document.createElement("p");
    const paragraphText = document.createTextNode(text);
    paragraph.appendChild(paragraphText);
    return paragraph;
}
