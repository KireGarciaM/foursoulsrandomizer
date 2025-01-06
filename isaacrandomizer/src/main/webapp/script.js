// Copyright 2019 Google LLC
//
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

/**
 * Adds a random greeting to the page.
 */
function randomizeImage() {
  // The images directory contains 13 images, so generate a random index between
  // 1 and 13.
  const imageIndex = Math.floor(Math.random() * 4) + 1;
  
  var set;

  if(imageIndex == 1){
    set = 'halo';
  } else if (imageIndex == 2) {
    set = 'knight';
  } else if (imageIndex == 3) {
    set = 'pkmn';
  } else {
    set = 'tes';
  }

  const imgUrl = '/resources/images/foursoulsets/set_' + set + '.png';

  const imgElement = document.createElement('img');
  //imgElement.classList.add("g2icon lazyloaded");
  imgElement.src = imgUrl;

  const imageContainer = document.getElementById('random-image-container');
  // Remove the previous image.
  imageContainer.innerHTML = '';
  imageContainer.appendChild(imgElement);
}

function getCardStatus() {

  // Fetches json from userapi servlet and uses to set the login
  // and logout links for the front end.
  fetch('/cardapi').then(response => response.json()).then(cards => {
      var card_counter = 0;
      const cardList = document.getElementById('cardGrid');
      console.log('Cards:', cards);
                cards.forEach(card => {
                    var set;
                    card_counter++;
                    const div = document.createElement('div');
                    const a = document.createElement('a');
                    const imgElement = document.createElement('img');
                    //li.textContent = `${card.name} | ${card.franch} | ${card.eternal_name} | ${card.id} `;
                    a.innerHTML = card.rname; //+ ' from ' + card.franch + '. Starting Item = ' + card.eternal_name + '. ID:' + card.id;
                    
                    
                    set = card.set;

                    
                    const imgUrl = 'https://storage.googleapis.com/fs_char/char/' + set +  '/' + card.name +'.png';
                
                    
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
  });
}

async function randcard(){
  var max = 5; 
  var count = 1;

  try {
    const response = await fetch('/cardapi');
    if (!response.ok) throw new Error('Failed to fetch users');
    
    const charCards = await response.json();
    console.log('Cards:', charCards);

    const cardList = document.getElementById('cardGrid');
    cardList.innerHTML = ''; 

    var randChars = [];
    var randVector = [];
    var randKeys= [];
    do{
      
      var rn = Math.floor(Math.random() * charCards.length) + 0;
      if(count == 0){
        randVector.push(rn);
        randKeys.push(charCards.at(rn).id);
        count++;
      } else{
        if(!randVector.includes(rn) && !randKeys.includes(charCards.at(rn).id)){
          randVector.push(rn);
          randKeys.push(charCards.at(rn).id);
          count++;
        }
      }
    } while(count <= max);
  
    randVector.sort((a, b) => a - b);
    console.log('RANDVector:', randVector);
    console.log('RandKeys:', randKeys);
    for(let i = 0; i < randVector.length; i++){
      randChars.push(charCards.at(randVector.at(i)))
    }
    console.log('RANDChars:', randChars);

    max--;

    var eternArray = [];
    for(let i = 0; i < randChars.length; i++){
      eternArray.push(randChars.at(i).eternal_name);
    }

    var eternals = [];

    try{
        et_resp = await fetch('/eternalapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eternArray) // Send names as a JSON array
      });
      console.log('eternArray:', eternArray);
      if (!et_resp.ok) throw new Error('Failed to query users');
      eternals = await et_resp.json();
      console.log('Queried Users:', eternals);

    } catch (error) {
      console.error('Error:', error);
    }

    let i = 0;
    randChars.forEach(randChar => {
      var set;
      //card_counter++;

      const div = document.createElement('div');
      const div_et = document.createElement('div');
      const div_third = document.createElement('div');
      const div_fourth = document.createElement('div');

      const a = document.createElement('a');
      const a_et = document.createElement('a');
      const a_third = document.createElement('a');
      const a_fourth = document.createElement('a');

      const imgElement = document.createElement('img');
      const imgElement_et = document.createElement('img');
      const imgElement_third = document.createElement('img');
      const imgElement_fourth = document.createElement('img');

      

      a.innerHTML = randChar.rname;
      a_et.innerHTML = eternals.at(i).real_name;
      a_third.innerHTML = 'blank';
      a_fourth.innerHTML = 'blank';
      
      set = randChar.set;

      const imgUrl = 'https://storage.googleapis.com/fs_char/char/' + set +  '/' + randChar.name +'.png';
      var imgUrl_et = '';
      var imgUrl_third = '';
      var imgUrl_fourth = '';

      switch(randChar.name) {
        case 'eden':
          imgUrl_et = 'https://storage.googleapis.com/fs_char/cardback/treasure_deck.png';
          imgUrl_third = 'https://storage.googleapis.com/fs_char/cardback/treasure_deck.png';
          imgUrl_fourth = 'https://storage.googleapis.com/fs_char/cardback/treasure_deck.png';
          break;
        case 'eden_2':
          imgUrl_et = 'https://storage.googleapis.com/fs_char/cardback/treasure_deck.png';
          imgUrl_third = 'https://storage.googleapis.com/fs_char/cardback/treasure_deck.png';
          imgUrl_fourth = 'https://storage.googleapis.com/fs_char/cardback/treasure_deck.png';
          break;
        case 'level_one_isaac':
          imgUrl_et = 'https://storage.googleapis.com/fs_char/cardback/loot_deck.png';
          imgUrl_third = 'https://storage.googleapis.com/fs_char/cardback/loot_deck.png';
          imgUrl_fourth = 'https://storage.googleapis.com/fs_char/cardback/blank.png';
          break;
        default:
          imgUrl_et = 'https://storage.googleapis.com/fs_char/eternals/' + randChar.eternal_name +'.png';
          imgUrl_third = 'https://storage.googleapis.com/fs_char/cardback/blank.png';
          imgUrl_fourth = 'https://storage.googleapis.com/fs_char/cardback/blank.png';
      }

      if(eternals.at(i).flip != 'null'){
        imgUrl_third = 'https://storage.googleapis.com/fs_char/eternals/'  + eternals.at(i).flip +'.png';
        const et_name_parts = eternals.at(i).real_name.split('/');
        a_et.innerHTML = et_name_parts[0];
        a_third.innerHTML = et_name_parts[1];
      }

      if(randChar.flip != 'null'){
        imgUrl_third = 'https://storage.googleapis.com/fs_char/char/' + set +  '/'  + randChar.flip +'.png';
        const name_parts = randChar.rname.split('/');
        a_et.innerHTML = name_parts[0];
        a_third.innerHTML = name_parts[1];
      }

      if(eternals.at(i).secondary_item != 'null'){
        imgUrl_third = 'https://storage.googleapis.com/fs_char/eternals/'  + eternals.at(i).secondary_item +'.png';
        const et_name_parts = eternals.at(i).real_name.split('+');
        a_et.innerHTML = et_name_parts[0];
        a_third.innerHTML = et_name_parts[1];
        if(eternals.at(i).secondary_item == "legends_end"){
          imgUrl_fourth = 'https://storage.googleapis.com/fs_char/cardback/noble_deck.png';
          a_fourth.innerHTML = "Noble's Deck";
        }
      }
      
      imgElement.src = imgUrl;
      imgElement.classList.add('aligncenter');
      imgElement.classList.add('wp-post-image');
      imgElement.classList.add('ls-is-cached');
      imgElement.classList.add('lazyloaded');

      imgElement_et.src = imgUrl_et;
      imgElement_et.classList.add('aligncenter');
      imgElement_et.classList.add('wp-post-image');
      imgElement_et.classList.add('ls-is-cached');
      imgElement_et.classList.add('lazyloaded');

      imgElement_third.src = imgUrl_third;
      imgElement_third.classList.add('aligncenter');
      imgElement_third.classList.add('wp-post-image');
      imgElement_third.classList.add('ls-is-cached');
      imgElement_third.classList.add('lazyloaded');

      imgElement_fourth.src = imgUrl_fourth;
      imgElement_fourth.classList.add('aligncenter');
      imgElement_fourth.classList.add('wp-post-image');
      imgElement_fourth.classList.add('ls-is-cached');
      imgElement_fourth.classList.add('lazyloaded');

      div.classList.add('cardGridCell');
      div_et.classList.add('cardGridCell');
      div_third.classList.add('cardGridCell');
      div_fourth.classList.add('cardGridCell');

      a.appendChild(imgElement);
      div.appendChild(a);
      cardList.appendChild(div);

      a_et.appendChild(imgElement_et);
      div_et.appendChild(a_et);
      cardList.appendChild(div_et);

      a_third.appendChild(imgElement_third);
      div_third.appendChild(a_third);
      cardList.appendChild(div_third);

      a_fourth.appendChild(imgElement_fourth);
      div_fourth.appendChild(a_fourth);
      cardList.appendChild(div_fourth);
      i++;
  });

  } catch (error) {
    console.error('Error:', error);
  }
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.body.style.backgroundColor = "white";
}