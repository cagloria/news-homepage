import {
    createArticleHeading,
    createDescription,
    getErrorElement,
} from "./utility.js";

/**
 * Fetches data from articles.json and loads article data into the home page.
 */
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
            loadNewArticles(newArticles);

            // Ordered articles
            const orderedArticles = data.filter(
                (article) => article.isOrdered === true
            );
            loadOrderedArticles(orderedArticles);
        })
        .catch((errorStatus) => {
            console.error(`${errorStatus}`);
            loadFetchError();
        });
}

/**
 * Creates the article preview element for the main featured article and append
 * it to the home page.
 * @param {Object} article  Article object
 */
function loadMainArticle(article) {
    const container = document.getElementById("main-article");
    const placeholder = document.getElementById("main-placeholder");

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

        // Description
        const desc = createDescription(article.previewDesc);
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

        placeholder.remove();
    } catch (error) {
        const errorElement = getErrorElement(
            "h2",
            "Looks like something went wrong loading the main article",
            "We're sorry, it looks like we can't retrieve today's main " +
                "article.  Try checking again later."
        );

        placeholder.replaceChildren(errorElement);
        container.remove();

        console.error(`Unable to load main article.\n${error}`);
    }
}

/**
 * Create the element of articles showing in the "New" section and append it to
 * the home page.
 * @param {Object} arr  Array of new articles
 */
function loadNewArticles(arr) {
    const container = document.getElementById("new-articles-container");
    const placeholder = document.getElementById("new-placeholder");

    try {
        const fragment = new DocumentFragment();

        arr.forEach((article) => {
            if (article !== undefined) {
                const div = document.createElement("div");
                div.classList.add("new-article");

                const heading = createArticleHeading(
                    article.title,
                    article.url,
                    true,
                    "",
                    "h3"
                );

                const desc = createDescription(article.previewDesc);

                div.append(heading, desc);
                fragment.append(div);
            }
        });

        container.append(fragment);
        placeholder.remove();
    } catch (error) {
        const errorElement = getErrorElement(
            "",
            "",
            "We're sorry, it looks like we can't retrieve our newest " +
                "articles. Try again later."
        );

        placeholder.replaceChildren(errorElement);
        container.remove();

        console.error(`Cannot load new articles.\n${error}`);
    }
}

/**
 * Create the element of articles and append them to the numbered list on the
 * home page.
 * @param {Object} arr  Array of ordered articles
 */
function loadOrderedArticles(arr) {
    const list = document.getElementById("ordered-articles-list");
    const placeholder = document.getElementById("ordered-placeholder");

    try {
        const fragment = new DocumentFragment();

        arr.forEach((article) => {
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
            const desc = createDescription(article.previewDesc);

            // Add to list item
            listItem.append(image, heading, desc);

            // Add to list
            fragment.append(listItem);
        });

        placeholder.remove();
        list.append(fragment);
    } catch (error) {
        const errorElement = getErrorElement(
            "h2",
            "Looks like something went wrong loading our articles",
            "We're sorry, it looks like we can't retrieve our articles. " +
                " Try checking again later."
        );

        list.remove();
        placeholder.replaceChildren(errorElement);

        console.error(`Unable to load ordered articles.\n${error}`);
    }
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

    const errorElement = getErrorElement(
        "h1",
        "Looks like something went wrong",
        "We're sorry. It looks like we can't retrieve our articles. " +
            "Try checking again later."
    );

    mainArticleSection.append(errorElement);

    mainArticle.remove();
    aside.remove();
    orderedArticlesSection.remove();
}
