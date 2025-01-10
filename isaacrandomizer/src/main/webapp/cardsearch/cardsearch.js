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
    searchtext: '', // Name or keyword
    set: '',
    card_type: '',
    franch: ''
});
console.log('param:', searchParams.toString());
let params = new URL(document.location.toString()).searchParams;

fetch(`/cardsearch/?${params.toString()}`)
    .then(response => response.json())
    .then(cards => {
        var card_counter = 0;
        const cardList = document.getElementById('cardGrid');
        console.log('Cards:', cards);
                cards.forEach(card => {
                    card_counter++;
                    const div = document.createElement('div');
                    const a = document.createElement('a');
                    const imgElement = document.createElement('img');
                    //li.textContent = `${card.name} | ${card.franch} | ${card.eternal_name} | ${card.id} `;
                    a.innerHTML = card.name; //+ ' from ' + card.franch + '. Starting Item = ' + card.eternal_name + '. ID:' + card.id;
                    
                    const set = card.set;
                    var imgUrl = 'https://storage.googleapis.com/fs_char/' + card.deck_type + '/' + set +  '/' + card.file_name +'.png';

                    if(card.deck_type == 'eternals')
                        imgUrl = 'https://storage.googleapis.com/fs_char/' + card.deck_type +  '/' + card.file_name +'.png';

                
                    
                    imgElement.src = imgUrl;
                    imgElement.classList.add('aligncenter');
                    imgElement.classList.add('wp-post-image');
                    imgElement.classList.add('ls-is-cached');
                    imgElement.classList.add('lazyloaded');

                    div.classList.add('cardGridCell');

                    a.appendChild(imgElement);
                    div.appendChild(a);
                    cardList.appendChild(div);
                });
      const link = document.getElementById("card_num_res");
      const cardMessage = card_counter + " Cards Have Been Found";
      link.innerHTML = cardMessage;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    /*async function search(){

    }*/