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
var max = 5; 
var permCharVector = [];
var checkedValues = [];
var player_count = 1;
var character_array = [];
var player_turn = 0;

async function resetmax(){
  max = 5;
  return false;
}

async function resetcards(){
  permCharVector = [];
  return false;
}
function getCheckedValues() {
  // Get all checkboxes from the form
  const checkboxes = document.querySelectorAll('#myForm input[type="checkbox"]:checked');
  
  // Extract values of checked checkboxes into an array
  checkedValues = Array.from(checkboxes).map(checkbox => parseInt(checkbox.value, 10));
  
  // Log the array to the console (or handle it as needed)
  console.log(checkedValues);
}

function getPlayerCount() {
  // Get all checkboxes from the form
  player_count = document.getElementById("player_count").value
  
  // Log the array to the console (or handle it as needed)
  console.log(player_count);
}

async function getPlayerCharacters(character, eternal) {
  player_turn++;

  //var character_array = [];
  console.log('Charactertest:', character);
  console.log('Eternaltest:', eternal);
  
  const temp_character = 
    { c_name: character.name, 
      c_rname: character.rname, 
      c_flip: character.flip, 
      c_set: character.set,
      e_name: eternal.name, 
      e_rname: eternal.real_name, 
      e_flip: eternal.flip, 
      e_secondary: eternal.secondary_item
    };

  character_array.push(temp_character);
  console.log('Character Array:', character_array);

  if(player_turn < player_count){
    checkedValues.push(character.id);
    resetmax();
    randcard();
  } else{
    const card_num_res = document.getElementById('card_num_res');
    card_num_res.innerText = 'All Players Have Chosen!';
    console.log('Character Array: Final', character_array);
    const cardList = document.getElementById('cardGrid');

    cardList.innerHTML = ''; 

    for(let i = 0; i < character_array.length; i++){
      const set = character_array.at(i).c_set;

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

      //a.innerHTML = character_array.at(i).c_rname;
      //a_et.innerHTML = character_array.at(i).e_rname;
      //a_third.innerHTML = 'blank';
      //a_fourth.innerHTML = 'blank';

      const imgUrl = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/char/' + set +  '/' + character_array.at(i).c_name +'.png';
      var imgUrl_et = '';
      var imgUrl_third = '';
      var imgUrl_fourth = '';

      switch(character_array.at(i).c_name) {
        case 'eden':
          imgUrl_et = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/treasure.png';
          imgUrl_third = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/treasure.png';
          imgUrl_fourth = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/treasure.png';
          break;
        case 'eden_2':
          imgUrl_et = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/treasure.png';
          imgUrl_third = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/treasure.png';
          imgUrl_fourth = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/treasure.png';
          break;
        case 'level_one_isaac':
          imgUrl_et = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/loot.png';
          imgUrl_third = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/loot.png';
          imgUrl_fourth = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/blank.png';
          break;
        default:
          imgUrl_et = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/eternals/' + character_array.at(i).e_name +'.png';
          imgUrl_third = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/blank.png';
          imgUrl_fourth = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/blank.png';
      }

      if(character_array.at(i).e_flip != 'null'){
        imgUrl_third = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/eternals/'  + character_array.at(i).e_flip +'.png';
        const et_name_parts = character_array.at(i).e_rname.split('/');
        //a_et.innerHTML = et_name_parts[0];
        //a_third.innerHTML = et_name_parts[1];
      }

      if(character_array.at(i).c_flip != 'null'){
        imgUrl_third = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/char/' + set +  '/'  + character_array.at(i).c_flip +'.png';
        const name_parts = character_array.at(i).c_rname.split('/');
        //a_et.innerHTML = name_parts[0];
        //a_third.innerHTML = name_parts[1];
      }

      if(character_array.at(i).e_secondary != 'null'){
        imgUrl_third = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/eternals/'  + character_array.at(i).e_secondary +'.png';
        const et_name_parts = character_array.at(i).e_rname.split('+');
        //a_et.innerHTML = et_name_parts[0];
        //a_third.innerHTML = et_name_parts[1];
        if(character_array.at(i).e_secondary == "legends_end"){
          imgUrl_fourth = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/n6_deck.png';
         // a_fourth.innerHTML = "Noble's Deck";
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

    }
  }
}


async function randcard(){
  getPlayerCount();
  const form = document.getElementById('card-searchform');
  
  const checkboxes = form.querySelectorAll('input[type="checkbox"]:checked');
  const selectedValues = Array.from(checkboxes).map(checkbox => checkbox.value);
  console.log('Form Values:', selectedValues);

  const decrease_flag = document.getElementById("decCheckbox");
  const unique_flag = document.getElementById("uniCheckbox");

  if (unique_flag.checked) {
    // Checkbox is checked
    permCharVector = [];
  }

  var count = 1;

  try {
    response = await fetch('/randcardapi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(selectedValues) // Send names as a JSON array
   });

    if (!response.ok) throw new Error('Failed to fetch users');
    
    const charCards = await response.json();
    console.log('Cards:', charCards);

    const cardList = document.getElementById('cardGrid');
    cardList.innerHTML = ''; 

    const card_num_res = document.getElementById('card_num_res');
    card_num_res.innerText = 'Player ' + (player_turn + 1) + ' choose:';

    if(charCards.length < max || charCards.length - (permCharVector.length + checkedValues.length) < max){
      cardList.innerHTML = 'Failed to Get Cards Error 404';
      return false;
    }

    console.log('Filtered Characters:', checkedValues);

    var randChars = [];
    var randVector = [];
    var randKeys= [];
    do{
      
      var rn = Math.floor(Math.random() * charCards.length) + 0;
      if(count == 0 && !permCharVector.includes(charCards.at(rn).id) && !checkedValues.includes(charCards.at(rn).id)){
        randVector.push(rn);
        randKeys.push(charCards.at(rn).id);
        permCharVector.push(charCards.at(rn).id);
        count++;
      } else{
        if(!randVector.includes(rn) && !randKeys.includes(charCards.at(rn).id) 
          && !permCharVector.includes(charCards.at(rn).id) && !checkedValues.includes(charCards.at(rn).id)){
          randVector.push(rn);
          randKeys.push(charCards.at(rn).id);
          permCharVector.push(charCards.at(rn).id);
          count++;
        }
      }
    } while(count <= max);
  
    randVector.sort((a, b) => a - b);
    console.log('RANDnumbers:', randVector);
    console.log('RandIDs:', randKeys);
    for(let i = 0; i < randVector.length; i++){
      randChars.push(charCards.at(randVector.at(i)))
    }
    console.log('RANDChars:', randChars);

    if (decrease_flag.checked) {
      // Checkbox is checked
      if(max != 1)
        max--;
    } else {
       max = 5;
    }
    

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

      
      //console.log('testChar:', randChar );
      //console.log('testEternal:', eternals.at(i) );
      const passingEternal = eternals.at(i);
      //a.innerHTML = randChar.rname;
      a.href = '#';
      a.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior
        getPlayerCharacters(randChar, passingEternal); // Call your function
      });
      //a_et.innerHTML = eternals.at(i).real_name;
      //a_third.innerHTML = 'blank';
      //a_fourth.innerHTML = 'blank';
      
      set = randChar.set;

      const imgUrl = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/char/' + set +  '/' + randChar.name +'.png';
      var imgUrl_et = '';
      var imgUrl_third = '';
      var imgUrl_fourth = '';

      switch(randChar.name) {
        case 'eden':
          imgUrl_et = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/treasure.png';
          imgUrl_third = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/treasure.png';
          imgUrl_fourth = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/treasure.png';
          break;
        case 'eden_2':
          imgUrl_et = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/treasure.png';
          imgUrl_third = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/treasure.png';
          imgUrl_fourth = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/treasure.png';
          break;
        case 'level_one_isaac':
          imgUrl_et = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/loot.png';
          imgUrl_third = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/loot.png';
          imgUrl_fourth = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/blank.png';
          break;
        default:
          imgUrl_et = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/eternals/' + randChar.eternal_name +'.png';
          imgUrl_third = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/blank.png';
          imgUrl_fourth = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/blank.png';
      }

      if(eternals.at(i).flip != 'null'){
        imgUrl_third = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/eternals/'  + eternals.at(i).flip +'.png';
        const et_name_parts = eternals.at(i).real_name.split('/');
        //a_et.innerHTML = et_name_parts[0];
        //a_third.innerHTML = et_name_parts[1];
      }

      if(randChar.flip != 'null'){
        imgUrl_third = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/char/' + set +  '/'  + randChar.flip +'.png';
        const name_parts = randChar.rname.split('/');
        //a_et.innerHTML = name_parts[0];
        //a_third.innerHTML = name_parts[1];
      }

      if(eternals.at(i).secondary_item != 'null'){
        imgUrl_third = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/eternals/'  + eternals.at(i).secondary_item +'.png';
        const et_name_parts = eternals.at(i).real_name.split('+');
        //a_et.innerHTML = et_name_parts[0];
        //a_third.innerHTML = et_name_parts[1];
        if(eternals.at(i).secondary_item == "legends_end"){
          imgUrl_fourth = 'https://res.cloudinary.com/duc5wlr69/image/upload/foursouls/cardback/n6_deck.png';
          //a_fourth.innerHTML = "Noble's Deck";
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