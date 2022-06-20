// For now, display grid with input text to show modified UI:
class Searcher{
    constructor(){
        this.query = "";
        this.results = [];
    }

    set search(str){
        this.query = str;
        this.results = [];

        // Temporary charity objects for testing
        let temp = {liked: false, charity: "This is an example charity."};
        let temp2 = {liked: true, charity: "This is a second example. It should already be liked"};
        this.results.push(temp);
        this.results.push(temp2);

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
            const line = document.createElement('div');
            line.classList.add('charity-line');
            const likeDiv = document.createElement('div');
            likeDiv.classList.add('like-button');

            // Check if charity already liked
            if (item['liked']) {
                likeDiv.classList.add('liked');
            }
            
            // Add event listener for the like button
            likeDiv.addEventListener("click", () => {
                if (item['liked']){
                    likeDiv.classList.remove('liked');
                    item['liked'] = false;
                }
                else {
                    likeDiv.classList.add('liked');
                    item['liked'] = true;
                }
            });
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