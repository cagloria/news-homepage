export function loadData() {
    fetch("./assets/data/articles.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    `Error in fetching data. Status: ${response.status}`
                );
            }
            return response.json();
        })
        .then((data) => {
            // Main article
            const mainArticle = data.find((article) => article.isMain === true);
            if (mainArticle !== undefined) {
                loadMainArticle(mainArticle);
            } else {
                loadMainArticleError();
                console.error("No main article found in data.");
            }

            // New articles
            const newArticles = data.filter(
                (article) => article.isNew === true
            );
            if (newArticles.length > 0) {
                newArticles.forEach((article) => {
                    loadNewArticles(article);
                });
            } else {
                loadNewArticlesError();
                console.error("No new articles found in data.");
            }

            // Ordered articles
            const orderedArticles = data.filter(
                (article) => article.isOrdered === true
            );
            if (orderedArticles.length > 0) {
                orderedArticles.forEach((article) => {
                    loadOrderedArticle(article);
                });
            } else {
                loadOrderedArticleError();
                console.error("No ordered articles found in data.");
            }
        })
        .catch((errorStatus) => {
            console.error(`${errorStatus}. Cannot load articles.`);
            loadFetchError();
        });
}

/**
 * Creates the article preview element for the main featured article and append
 * it to the landing page.
 * @param {Object} article  Article object
 */
function loadMainArticle(article) {
    const articleContainer = document.getElementById(
        "primary-featured-section"
    );
    const fragment = new DocumentFragment();

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

    picture.append(sourceMobile);
    picture.append(sourceDesktop);
    picture.append(image);

    // Heading
    const heading = createArticleHeading(
        article.title,
        article.url,
        false,
        "main-article__heading",
        "h2"
    );

    // Descripiton
    const desc = createPreviewDescription(article.previewDesc);
    desc.classList.add("main-article__description");

    // Link
    const link = document.createElement("a");
    const linkText = document.createTextNode("Read more");
    link.setAttribute("href", article.url);
    link.classList.add("button-link");
    link.append(linkText);

    // Add to container
    fragment.append(picture, heading, desc, link);
    articleContainer.append(fragment);
}

/**
 * Create the element of articles and append them to the numbered list on the
 * landing page.
 * @param {Object} article  Article object
 */
function loadOrderedArticle(article) {
    const list = document.getElementById("ordered-articles-list");
    const listItem = document.createElement("li");
    listItem.classList.add("secondary-article");

    // Image
    const image = document.createElement("img");
    image.setAttribute("src", article.img);
    image.setAttribute("alt", article.imgAlt);
    image.setAttribute("loading", "lazy");

    // Heading
    const heading = createArticleHeading(
        article.title,
        article.url,
        true,
        "",
        "h3"
    );

    // Description
    const desc = createPreviewDescription(article.previewDesc);

    // Add to list item
    listItem.append(image, heading, desc);

    // Add to list
    list.append(listItem);
}

/**
 * Create the element of articles showing in the "New" section and append it to
 * the landing page.
 * @param {Object} article  Article Object
 */
function loadNewArticles(article) {
    const container = document.getElementById("new-articles-container");
    const div = document.createElement("div");
    div.classList.add("new-article");

    const heading = createArticleHeading(
        article.title,
        article.url,
        true,
        "",
        "h3"
    );
    const desc = createPreviewDescription(article.previewDesc);

    // Add to div
    div.append(heading, desc);

    // Add to container
    container.append(div);
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
        link.append(headingText);
        heading.append(link);
    } else {
        heading.append(headingText);
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
    paragraph.append(paragraphText);
    return paragraph;
}

/**
 * Should the articles.json file not be able to be fetched, remove main content
 * from page and add note.
 */
function loadFetchError() {
    const mainArticle = document.getElementById("primary-featured-section");
    const aside = document.getElementById("new-articles-aside");
    const orderedArticlesSection = document.getElementById(
        "ordered-articles-section"
    );
    const fragment = new DocumentFragment();

    const heading = document.createElement("h1");
    const headingText = document.createTextNode(
        "Looks like something went wrong"
    );
    const paragraph = document.createElement("p");
    const paragraphText = document.createTextNode(
        "We're sorry. It looks like we can't retrieve our articles. Try " +
            "checking again later."
    );

    heading.append(headingText);
    paragraph.append(paragraphText);

    fragment.append(heading, paragraph);
    mainArticle.append(fragment);
    aside.remove();
    orderedArticlesSection.remove();
}

function loadMainArticleError() {
    const mainArticle = document.getElementById("primary-featured-section");
    const fragment = new DocumentFragment();

    const heading = document.createElement("h2");
    const headingText = document.createTextNode(
        "Looks like something went wrong loading the main article"
    );
    heading.append(headingText);

    const paragraph = document.createElement("p");
    const paragraphText = document.createTextNode(
        "We're sorry. It looks like we can't retrieve today's main article. " +
            " Try checking again later."
    );
    paragraph.append(paragraphText);

    fragment.append(heading, paragraph);
    mainArticle.append(fragment);
}

function loadOrderedArticleError() {
    const section = document.getElementById("ordered-articles-section");
    const list = document.getElementById("ordered-articles-list");

    list.remove();
    section.remove();
}

function loadNewArticlesError() {
    const container = document.getElementById("new-articles-container");

    const paragraph = document.createElement("p");
    const paragraphText = document.createTextNode(
        "We're sorry. It looks like we can't retrieve today's new articles. " +
            " Try checking again later."
    );
    paragraph.append(paragraphText);

    container.append(paragraph);
}
