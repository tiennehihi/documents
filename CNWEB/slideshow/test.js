// const modalBody = document.getElementById("modal-body")

// const html = `
// <div class="modal-body__article">
//     <header class="modal-body__header">
//         <h2 class="modal-body__header-title">Showing popular results</h2>
//         <ul class="modal-body__header-list">
//             <li class="modal-body__header-item">Relevance</li>
//             <li class="modal-body__header-item">Newest</li>
//             <li class="modal-body__header-item">Oldest</li>
//         </ul>
//     </header>
//     <div class="modal-body__content">
//         <div class="modal-body__content-item">
//             <span class="modal-body__content-item-title">Loading Web Fonts with the Web Font Loader</span>
//             <br>
//             <span class="modal-body__content-item-desc">loading-web-fonts-with-the-web-font-loader</span>
//         </div>
//     </div>
// </div>
// <div class="modal-body__article-filter">
//     <h2 class="modal-body__article-filter-title">Filter Options</h2>
//     <div class="modal-body__article-filter-1-postTypes">
//         <h3 class="modal-body__article-filter-sub-heading">Post Types</h3>
//         <div class="modal-body__article-filter-content">
//             <div>
//                 <input type="checkbox">
//                 <label for="">Post (6319)</label>
//             </div>
//         </div>
//     </div>
// </div>
// `

const html1 = `
<div class="modal-body__article">
    <header class="modal-body__header">
        <h2 class="modal-body__header-title">Showing popular results</h2>
        <ul class="modal-body__header-list">
            <li class="modal-body__header-item">Relevance</li>
            <li class="modal-body__header-item">Newest</li>
            <li class="modal-body__header-item">Oldest</li>
        </ul>
    </header>
    <div class="modal-body__content">
        <div class="modal-body__content-item">
            <span class="modal-body__content-item-title">Loading Web Fonts with the Web Font Loader</span>
            <br>
            <span class="modal-body__content-item-desc">loading-web-fonts-with-the-web-font-loader</span>
        </div>
    </div>
</div>
`;

const modalBody = document.getElementById("modal-body");

const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");

const article = doc.querySelector(".modal-body__article");

modalBody.appendChild(article);