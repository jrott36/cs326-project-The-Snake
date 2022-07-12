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

        const response = await fetch(`/user/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({search: str}),
        });
        this.results = await response.json();
        this._saveResults();
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

            // Insert number of likes into likeDiv
            likeDiv.innerText = item['num_likes'];
            
            // Add event listener for the like button
            likeDiv.addEventListener("click", async () => {
                if (item['liked']){
                    likeDiv.classList.remove('liked');
                    item['liked'] = false;
                    item['num_likes']--;
                    likeDiv.innerText = item['num_likes'];
                    await fetch(`/user/removeLike`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({OID: item['oid'], num: item['num_likes']}),
                    });
                }
                else {
                    likeDiv.classList.add('liked');
                    item['liked'] = true;
                    item['num_likes']++;
                    likeDiv.innerText = item['num_likes'];
                    await fetch(`/user/like`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({OID: item['oid'], num: item['num_likes']}),
                    });
                }
                this._saveResults();
            });
            line.appendChild(likeDiv);

            const charityDiv = document.createElement('div');
            charityDiv.classList.add('charity');
            
            // Create <a> element with name and clickable hyperlink into new tab (using noopener to avoid tabnapping which I found recommended online).
            let aTag = document.createElement('a');
            aTag.setAttribute('href', item['url']);
            aTag.setAttribute('target', '_blank');
            aTag.setAttribute('rel', 'noopener noreferrer');
            aTag.innerText = item['name'];

            charityDiv.appendChild(aTag);
            line.appendChild(charityDiv);
            frag.appendChild(line);
        }
        resultSection.appendChild(frag);
    }
} 

export {Searcher};