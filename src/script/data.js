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
            loadMainArticle(data.find((article) => article.isMain === true));

            // New articles
            const newArticles = data.filter(
                (article) => article.isNew === true
            );
            newArticles.forEach((article) => {
                loadNewArticles(article);
            });

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
            console.error(`${errorStatus}`);
            loadFetchError();
        });
}

/**
 * Creates the article preview element for the main featured article and append
 * it to the landing page.
 * @param {Object} article  Article object
 */
function loadMainArticle(article) {
    const container = document.getElementById("main-article");

    try {
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
        container.append(fragment);
    } catch {
        const mainSection = document.getElementById("main-article-section");

        const errorElement = getErrorElement(
            "h2",
            "Looks like something went wrong loading the main article",
            "We're sorry. It looks like we can't retrieve today's main " +
                "article.  Try checking again later."
        );

        mainSection.append(errorElement);

        container.remove();

        console.error("Unable to load main article.");
    }
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
 * Create the element of articles and append them to the numbered list on the
 * landing page.
 * @param {Object} article  Article object
 */
function loadOrderedArticle(article) {
    const list = document.getElementById("ordered-articles-list");

    try {
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
    } catch (error) {
        const section = document.getElementById("ordered-articles-section");

        list.remove();
        section.remove();

        console.error("Unable to load new articles.");
    }
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
    const mainArticleSection = document.getElementById("main-article-section");
    const mainArticle = document.getElementById("main-article");
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
        "We're sorry. It looks like we can't retrieve our articles. " +
            "Try checking again later."
    );

    heading.append(headingText);
    paragraph.append(paragraphText);

    fragment.append(heading, paragraph);
    mainArticleSection.append(fragment);

    mainArticle.remove();
    aside.remove();
    orderedArticlesSection.remove();
}

function loadOrderedArticleError() {
    const section = document.getElementById("ordered-articles-section");
    const list = document.getElementById("ordered-articles-list");

    list.remove();
    section.remove();
}

function getErrorElement(headingLevel = "h2", headingText, paragraphText) {
    const container = document.createElement("div");
    container.classList.add("error-element");

    const heading = document.createElement(headingLevel);
    const headingTextNode = document.createTextNode(headingText);
    heading.append(headingTextNode);
    heading.classList.add("error-element__heading");

    const paragraph = document.createElement("p");
    const paragraphTextNode = document.createTextNode(paragraphText);
    paragraph.append(paragraphTextNode);
    paragraph.classList.add("error-element__paragraph");

    container.append(heading, paragraph);

    return container;
}
