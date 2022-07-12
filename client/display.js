// For now, display grid with input text to show modified UI:

class Searcher{
    constructor(){
        if (window.localStorage.getItem('query') !== null &&
            window.localStorage.getItem('results') !== null
        ){
            this.query = window.localStorage.getItem('query');
            document.getElementById('query').value = this.query;
            this.results = JSON.parse(window.localStorage.getItem('results'));
            this.renderSearch();
        } else {
            this.query = "";
            this.results = [];
        }
    }

    async search(str){
        this.query = str;
        this._saveQuery();
        this.results = [];

        // Temporary charity objects for testing

        let temp = {liked: false, charity: "This is an example charity."};
        let temp2 = {liked: true, charity: "This is a second example. It should already be liked"};
        let temp3 = {liked: false, charity: "This one is just to make the comment that the charity search API is still a TODO on implementing."};
        this.results.push(temp);
        this.results.push(temp2);
        this.results.push(temp3);

        this._saveResults();

        // TODO Implement Giving Global API with search
        const response = await fetch(`/user/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({search: str}),
        });
        console.log(response);
    }

    _saveQuery(){
        window.localStorage.setItem('query', this.query);
    }

    _saveResults(){
        window.localStorage.setItem('results', JSON.stringify(this.results));
    }

    _renderQuery(){
        let querySection = document.getElementById('query');
        querySection.innerText = "Showing results for: \"" + this.query + "\"";
    }

    renderSearch(){
        this._renderQuery();
        let resultSection = document.getElementById('results');
        resultSection.innerHTML = '';
        let frag = new DocumentFragment();
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
                this._saveResults();
            });
            line.appendChild(likeDiv);
            const charityDiv = document.createElement('div');
            charityDiv.classList.add('charity');
            charityDiv.innerText = item['charity'];
            line.appendChild(charityDiv);
            frag.appendChild(line);
        }
        resultSection.appendChild(frag);
    }
} 

export {Searcher};