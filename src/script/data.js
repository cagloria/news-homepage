export function loadData() {
    fetch("./assets/data/articles.json")
        .then((result) => result.json())
        .then((data) => {
            data.forEach((article) => {
                if (article.isPrimaryFeatured) {
                    loadMainArticle(article);
                }
                if (article.isSecondaryFeatured) {
                    createSecondaryFeaturedList(article);
                }
                if (article.isNew) {
                    createNewArticles(article);
                }
            });
        });
}

/**
 * Creates the article preview element for the main featured article and append
 * it to the landing page.
 * @param {Object} article  Article object
 */
function loadMainArticle(article) {
    const container = document.getElementById("primary-featured-container");

    // Image
    const picture = document.createElement("picture");
    picture.classList.add("main-article__image");

    const sourceMobile = document.createElement("source");
    sourceMobile.setAttribute("media", "(max-width: 686px)");
    sourceMobile.setAttribute("srcset", article.imgMobile);

    const sourceDesktop = document.createElement("source");
    sourceDesktop.setAttribute("media", "(min-width: 687px)");
    sourceDesktop.setAttribute("srcset", article.imgDesktop);

    const image = document.createElement("img");
    image.setAttribute("src", article.imgMobile);
    image.setAttribute("alt", article.imgAlt);
    image.setAttribute("loading", "lazy");

    picture.appendChild(sourceMobile);
    picture.appendChild(sourceDesktop);
    picture.appendChild(image);

    // Link
    const link = document.createElement("a");
    link.setAttribute("href", article.url);
    link.classList.add("button-link");
    const linkText = document.createTextNode("Read more");
    link.appendChild(linkText);

    // Add to container
    container.appendChild(picture);
    container.appendChild(
        createArticleHeading(
            article.title,
            article.url,
            false,
            "main-article__heading"
        )
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
    listItem.classList.add("secondary-article");

    // Image
    const image = document.createElement("img");
    image.setAttribute("src", article.img);
    image.setAttribute("alt", article.imgAlt);
    image.setAttribute("loading", "lazy");

    // Add to list item
    listItem.appendChild(image);
    listItem.appendChild(
        createArticleHeading(article.title, article.url, true, "", "h3")
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
    div.classList.add("new-article");

    // Add to div
    div.appendChild(
        createArticleHeading(article.title, article.url, true, "", "h3")
    );
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
 * @param {String} hLevel   The heading level, default to H2
 * @returns                 Heading element
 */
function createArticleHeading(title, url, hasLink, className, hLevel = "h2") {
    const heading = document.createElement(hLevel);
    const headingText = document.createTextNode(title);

    if (className.length > 0) {
        heading.classList.add(className);
    }

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
