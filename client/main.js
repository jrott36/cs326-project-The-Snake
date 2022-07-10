import { Searcher } from './display.js'

const searchButton = document.getElementById('search');
const searcher = new Searcher();

searchButton.addEventListener("click", () => {
    const searchBar = document.getElementById('search-bar');
    const query = searchBar.value;
    await searcher.search(query);
    searcher.renderSearch();
});