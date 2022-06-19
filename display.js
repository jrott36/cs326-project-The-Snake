// For now, display grid with input text to show modified UI:
class Searcher{
    constructor(){
        this.query = "";
        this.results = [];
    }

    set search(str){
        this.query = str;
        // getResults(str);
    }

    get search(){
        return this.query;
    }

    renderSearch(){
        let querySection = document.getElementById('query');
        querySection.innerText = "Showing results for: \"" + this.query + "\"";

    }

    // getResults(str){
    //     temp = {liked: false, charity: "This is an example charity."};
    //     this.results.push(temp);

    //     // TODO Implement Giving Global API with search
    // }
} 

export {Searcher};