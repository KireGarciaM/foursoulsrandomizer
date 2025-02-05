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
    deck_type:'',
});
console.log('param:', searchParams.toString());
let params = new URL(document.location.toString()).searchParams;

// What's fetched? ID, Name, Set, *Deck_Type, *Special, Special_Name, *File_Name, Franch
fetch(`/cards?${params.toString()}`)
    .then(response => response.json())
    .then(cards => {
        const cardList = document.querySelector('main');
        console.log('Cards:', cards);
                cards.forEach(card => {

                    var state_flag = 1;
                    var end_flag = 1;

                do{
                    const div = document.createElement('div');
                    const left = document.createElement('div');
                    const info = document.createElement('div');
                    const right = document.createElement('div');
                    const a = document.createElement('a');
                    const a2 = document.createElement('a');
                    const h = document.createElement('h1');
                    const imgElement = document.createElement('img');
                    const backimgElement = document.createElement('img');
                    h.innerHTML = card.name;

                    if(card.special == 'states'){
                        end_flag = parseInt(card.special_name);
                        const names = card.name.split("+");
                        h.innerHTML = names[state_flag - 1];
                    }

                    if(card.special == 'bonus'){
                        end_flag = 2;
                        const names = card.name.split("+");
                        h.innerHTML = names[state_flag - 1];
                    }
                    
                    const set = card.set;
                    var imgUrl = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/' + card.deck_type + '/' + set +  '/' + card.file_name +'.png';

                    backimgUrl = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/' + card.deck_type + '.png';

                    if(card.special == 'states' && state_flag > 1){
                        var imgUrl = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/' + card.deck_type + '/' + set +  '/' + card.file_name + state_flag +'.png';
                    }

                    if(card.special == 'flip')
                        backimgUrl = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/' + card.deck_type + '/' + set +  '/' + card.special_name +'.png';

                    if(card.deck_type == 'eternals'){
                        imgUrl = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/' + card.deck_type +  '/' + card.file_name +'.png';
                        if(card.special == 'flip')
                            backimgUrl = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/' + card.deck_type +  '/' +  card.special_name +'.png';
                    }

                    if(card.special == 'bonus' && state_flag > 1){
                        var imgUrl = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/' + card.deck_type +  '/' + card.special_name +'.png';
                    }

                    a.classList.add('swipebox');
                    a2.classList.add('swipebox');
                    
                    imgElement.src = imgUrl;
                    imgElement.classList.add('aligncenter');
                    imgElement.classList.add('wp-post-image');
                    imgElement.classList.add('ls-is-cached');
                    imgElement.classList.add('lazyloaded');
                    imgElement.classList.add('cardFront');

                    backimgElement.src = backimgUrl;
                    backimgElement.classList.add('aligncenter');
                    backimgElement.classList.add('wp-post-image');
                    backimgElement.classList.add('ls-is-cached');
                    backimgElement.classList.add('lazyloaded');
                    backimgElement.classList.add('cardBack');

                    div.setAttribute('id', 'CardDisplay');
                    left.setAttribute('id', 'CardLeft');
                    info.setAttribute('id', 'CardInfo');
                    right.setAttribute('id', 'CardRight');
                    

                    a.appendChild(imgElement);
                    a2.appendChild(backimgElement);
                    left.appendChild(a);
                    right.appendChild(a2);
                    div.appendChild(left);
                    div.appendChild(info);
                    div.appendChild(right);
                    cardList.appendChild(h);
                    cardList.appendChild(div);

                    state_flag++;
                } while(state_flag <= end_flag);
                });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

    /* 
    Gets traits from name & set.

    SELECT t.name 
    FROM cards c 
    JOIN card_types ct ON ct.card_id = c.id 
    JOIN types t ON t.id = ct.type_id 
    WHERE c.name = 'Serperior' AND c.c_set = 'pkmn';
    */