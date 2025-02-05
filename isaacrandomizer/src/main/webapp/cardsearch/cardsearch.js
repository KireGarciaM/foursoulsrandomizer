// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// searchtext=&set=&card_type=&franch=
const searchParams = new URLSearchParams({
    searchtext: '',
    set: '',
    card_type: '',
    franch: ''
});

let params = new URL(document.location.toString()).searchParams;

fetch(`/cardsearch/?${params.toString()}`)
    .then(response => response.json())
    .then(cards => {
        const cardsPerPage = 20;
        let currentPage = 1;

        const cardGrid = document.getElementById('cardGrid');
        const pagination = document.getElementById('pagination');
        const cardNumRes = document.getElementById('card_num_res');

        function renderCards(page) {
            cardGrid.innerHTML = '';
            const start = (page - 1) * cardsPerPage;
            const end = start + cardsPerPage;
            const pageCards = cards.slice(start, end);

            pageCards.forEach(card => {
                const div = document.createElement('div');
                const a = document.createElement('a');
                const imgElement = document.createElement('img');
                const specialElement = document.createElement('img');

                //a.innerHTML = card.name;
                a.href = `/card/card.html/?searchtext=${card.file_name}&set=${card.set}&deck_type=${card.deck_type}`;

                let imgUrl = `https://res.cloudinary.com/duc5wlr69/image/upload/c_scale,h_420,w_308/foursouls/${card.deck_type}/${card.set}/${card.file_name}.png`;
                if (card.deck_type === 'eternals') {
                    imgUrl = `https://res.cloudinary.com/duc5wlr69/image/upload/c_scale,h_420,w_308/foursouls/${card.deck_type}/${card.file_name}.png`;
                }

                imgElement.src = `${imgUrl}`;
                imgElement.setAttribute('loading', 'lazy');
                imgElement.classList.add('aligncenter', 'wp-post-image', 'ls-is-cached', 'lazyloaded');

                div.classList.add('cardGridCell');

                if(card.special != 'null'){
                    if(card.special == 'flip')
                        var simgUrl = `/resources/images/ui/FlipCornerNote.png`;
                    else if(card.special == 'states' )
                        var simgUrl = `/resources/images/ui/states.png`;
                    else
                        var simgUrl = `/resources/images/ui/special.png`;

                    specialElement.src = `${simgUrl}?w=300`;
                    specialElement.setAttribute('loading', 'lazy');
                    specialElement.classList.add('search-flipnote', 'ls-is-cached', 'lazyloaded');
                    specialElement.id = 'CardFlip7443Button';
                    div.appendChild(specialElement);
                }
                
                a.appendChild(imgElement);
                div.appendChild(a);
                cardGrid.appendChild(div);
            });

            cardNumRes.textContent = `${cards.length} Cards Have Been Found`;
        }

        function renderPagination() {
            pagination.innerHTML = '';
            const totalPages = Math.ceil(cards.length / cardsPerPage);
            const pagesPerSet = 5; // Number of page numbers to display at a time
            const currentSet = Math.floor((currentPage - 1) / pagesPerSet); // Calculate which set of page numbers to display
            const startPage = currentSet * pagesPerSet + 1; // First page in the current set
            const endPage = Math.min(startPage + pagesPerSet - 1, totalPages); // Last page in the current set

            if (currentSet > 0) {
                const prevButton = document.createElement('button');
                prevButton.textContent = 'Previous';
                prevButton.addEventListener('click', () => {
                    currentPage = startPage - 1;
                    renderCards(currentPage);
                    renderPagination();
                });
                pagination.appendChild(prevButton);
            }
        
            // Page number buttons for the current set
            for (let i = startPage; i <= endPage; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                button.disabled = i === currentPage;
                button.addEventListener('click', () => {
                    currentPage = i;
                    renderCards(currentPage);
                    renderPagination();
                });
                pagination.appendChild(button);
            }
        
            // Next button
            if (endPage < totalPages) {
                const nextButton = document.createElement('button');
                nextButton.textContent = 'Next';
                nextButton.addEventListener('click', () => {
                    currentPage = endPage + 1;
                    renderCards(currentPage);
                    renderPagination();
                });
                pagination.appendChild(nextButton);
            }
        }

        renderCards(currentPage);
        renderPagination();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });