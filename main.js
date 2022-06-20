import { Searcher } from './display.js'

const searchButton = document.getElementById('search');
const searcher = new Searcher();

searchButton.addEventListener("click", () => {
    const searchBar = document.getElementById('search-bar');
    const query = searchBar.value;
    searcher.search = query;
    searcher.renderSearch();
})

// document.getElementById('results').addEventListener("click", (e) => {
//     if (e.target.classList.contains('like-button')){
//     }
// })