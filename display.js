// For now, display grid with input text to show modified UI:
class Searcher{
    constructor(){
        this.query = "";
        this.results = [];
    }

    set search(str){
        this.query = str;
        this.results = [];
        let temp = {liked: false, charity: "This is an example charity."};
        this.results.push(temp);
        // TODO Implement Giving Global API with search
    }

    get search(){
        return this.query;
    }

    renderQuery(){
        let querySection = document.getElementById('query');
        querySection.innerText = "Showing results for: \"" + this.query + "\"";
    }

    renderSearch(){
        this.renderQuery();
        let resultSection = document.getElementById('results');
        resultSection.innerHTML = '';
        for (let item of this.results){
            console.log(item);
            const line = document.createElement('div');
            line.classList.add('charity-line');
            const likeDiv = document.createElement('div');
            likeDiv.classList.add('like-button');
            // Allow 
            likeDiv.addEventListener("click", () => {
                if (item['liked']){
                    likeDiv.classList.remove('liked');
                    item['liked'] = false;
                }
                else {
                    likeDiv.classList.add('liked');
                    item['liked'] = true;
                }
            })
            line.appendChild(likeDiv);
            const charityDiv = document.createElement('div');
            charityDiv.classList.add('charity');
            charityDiv.innerText = item['charity'];
            line.appendChild(charityDiv);
            resultSection.appendChild(line);
        }
    }
} 

export {Searcher};