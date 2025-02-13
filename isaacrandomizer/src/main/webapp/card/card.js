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

const searchParams = new URLSearchParams({
    searchtext: '', // Name or keyword
    set: '',
    deck_type:'',
});

let params = new URL(document.location.toString()).searchParams;

function sanitize_string(description_array){
    return description_array.replace(/Â¢/g, '¢');
}

// What's fetched? ID, Name, Set, *Deck_Type, *Special, Special_Name, *File_Name, Franch
fetch(`/cards?${params.toString()}`)
    .then(response => response.json())
    .then(cards => {
        const cardList = document.querySelector('main');
                cards.forEach(card => {

                    var state_flag = 1;
                    var end_flag = 1;
                    
                    var description_array = card.desc;

                    description_array = sanitize_string(description_array);

                    if(card.special == 'bonus' || card.special == 'states' || card.special == 'flip'){
                        var description_states = card.desc.split("%");
                    } 

                do{

                    if(card.special == 'bonus' || card.special == 'states'|| card.special == 'flip'){
                        description_array = description_states[state_flag - 1];
                    } 

                    const div = document.createElement('div');
                    const left = document.createElement('div');
                    const right = document.createElement('div');
                    const a = document.createElement('a');
                    const a2 = document.createElement('a');
                    const a_mid = document.createElement('a');
                    const h = document.createElement('h1');
                    const imgElement = document.createElement('img');
                    const backimgElement = document.createElement('img');
                    var info = identifierFuntion(card.file_name, card.set, card.deck_type, card.special, description_array);
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
                    a_mid.classList.add('swipebox');
                    
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

                    leftappendFunction(left, card.file_name, card.set, card.deck_type, card.special, description_array);
                    rightappendFunction(right, card.file_name, card.set, card.deck_type, card.special, description_array);

                    div.appendChild(left);
                    if(card.special == 'flip'){
                        div.appendChild(info);
                        info = identifierFuntion(card.file_name, card.set, card.deck_type, card.special, description_states[state_flag]);
                        info.setAttribute('id', 'CardInfo');
                        div.appendChild(info);
                    }else{
                        div.appendChild(info);
                    }
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

    function leftappendFunction(left, file_name, set, deck_type, special, desc) {
        if(set == 'pkmn' && (deck_type == 'monster' || deck_type == 'familiar'|| deck_type == 'outside')){
        var text = desc.split('_')[1].split('|'); 
        for(let i = 0; i < text.length; i++){
            const effects = document.createElement('div');
            effects.classList.add('effectOutcome');

                const parts = text[i].split(/(CA|DC)/);

                var lastchecker = 0;
                parts.forEach(part=> {
                    if(part === "CA" || part === "DC") {
                        const imgElementFlip = document.createElement('img');
                        imgElementFlip.src = '/resources/images/ui/'+ part.toLowerCase() +'.png';
                        imgElementFlip.classList.add('lazyloaded');
                        imgElementFlip.classList.add('inlineIcon');

                        imgElementFlip.alt = part;

                        effects.appendChild(imgElementFlip);
                        lastchecker++;
                    } else {
                        lastchecker++;
                        if (lastchecker == parts.length - 1 && part.includes(" '")){
                            const p = document.createElement('p');
                            p.classList.add('quoteText');
                            p.innerText = part;
                        }
                        else {var textNode = document.createTextNode(part);
                        effects.appendChild(textNode);}
                    }
                })
            left.appendChild(effects);
        }
        }
        //return div;
    }

    function rightappendFunction(right, file_name, set, deck_type, special, desc) {
        if(set == 'pkmn' && special == 'flip' && (deck_type == 'monster' || deck_type == 'familiar' || deck_type == 'outside')){
        var text = desc.split('_')[1].split('|'); 
        for(let i = 0; i < text.length; i++){
            const effects = document.createElement('div');
            effects.classList.add('effectOutcome');

                const parts = text[i].split(/(CA|DC)/);

                var lastchecker = 0;
                parts.forEach(part=> {
                    if(part === "CA" || part === "DC") {
                        const imgElementFlip = document.createElement('img');
                        imgElementFlip.src = '/resources/images/ui/'+ part.toLowerCase() +'.png';
                        imgElementFlip.classList.add('lazyloaded');
                        imgElementFlip.classList.add('inlineIcon');

                        imgElementFlip.alt = part;

                        effects.appendChild(imgElementFlip);
                        lastchecker++;
                    } else {
                        lastchecker++;
                        if (lastchecker == parts.length - 1 && part.includes(" '")){
                            const p = document.createElement('p');
                            p.classList.add('quoteText');
                            p.innerText = part;
                        }
                        else {var textNode = document.createTextNode(part);
                        effects.appendChild(textNode);}
                    }
                })
            right.appendChild(effects);
        }
        }
        //return div;
    }

    function identifierFuntion(file_name, set, deck_type, special, desc) {
        
        
        var description_array;
        var pk_traits = '';

        var div = document.createElement('div');
        const a = document.createElement('a');

        if(set == 'pkmn' && (deck_type == 'monster' || deck_type == 'familiar' || deck_type == 'outside') ){
            pk_traits = desc.split('_')[1];
            desc = desc.split('_')[0];
            pk_traits = pk_traits.split('|');
        }


        if(deck_type == 'char'){
            description_array = desc.split("+");
        } else {
            description_array = desc.split("|");
        }

        if(description_array.length == 1){
            a.innerHTML = 'SLICER';
            div = SLICERBuilder(file_name, set, deck_type, special, description_array);
        } else {
            if(description_array[0].includes('HP:') && description_array[1].includes('AT:')){
                // 'Character';
                div = characterBuilder(file_name, set, deck_type, special, description_array);
            } else if (description_array[0].includes('HP:') && !description_array[1].includes('DC: X') && description_array[1].includes('DC: ')){
                // 'Monster';
                div = monsterBuilder(file_name, set, deck_type, special, description_array, pk_traits);
            } else if (description_array[0].includes('HP:') && description_array[1].includes('DC: X')){
                // 'Familiar';
                div = familiarBuilder(file_name, set, deck_type, special, description_array, pk_traits);
            } else {
                // 'SLICER';
                div = SLICERBuilder(file_name, set, deck_type, special, description_array);
            }
        }

        const searchParams = new URLSearchParams({
            file_name: file_name, // Name or keyword
            set: set,
            deck_type: deck_type
        });
        //search for footer element
        fetch(`/footersearch/?${searchParams.toString()}`)
            .then(response => response.json())
            .then(footers => {
                footers.forEach(footer => {
                    var footer_div = document.createElement('div');
                    footer_div.classList.add(footer.name + 'Footnote');
                    footer_div.classList.add('footnote');

                    const imgElementFlip = document.createElement('img');
                    imgElementFlip.src = '/resources/images/ui/'+ footer.name.toLowerCase() +'.png';
                    imgElementFlip.classList.add('footnoteIcon');
                    imgElementFlip.classList.add('lazyloaded');

                    imgElementFlip.alt = footer.name;

                    footer_div.appendChild(imgElementFlip);

                    const p1 = document.createElement('p');
                    p1.classList.add('footnoteTitle');
                    p1.innerText = footer.name;

                    footer_div.appendChild(p1);

                    const p2 = document.createElement('p');
                    p2.innerText = footer.desc;

                    footer_div.appendChild(p2);

                    div.appendChild(footer_div);
                });
            })
        
        return div;
    }

    function characterBuilder(file_name, set, deck_type, special, desc) {
        const card_info = document.createElement('div');

        const div_orgset = document.createElement('div');
        div_orgset.setAttribute('id', 'OriginSet');
        div_orgset.classList.add(set);

        const p_set = document.createElement('p');
        p_set.innerText = set;

        const div_orgind = document.createElement('div');
        div_orgind.classList.add('originIndicator');
        div_orgind.title = 'This card is part of the ' + set + ' set.';

        const p_type = document.createElement('p');
        p_type.innerText = deck_type;

        div_orgset.appendChild(p_set);
        div_orgset.appendChild(div_orgind);
        div_orgset.appendChild(p_type);        

        const table = document.createElement('table');
        table.classList.add('StatTable');

        const tbody = document.createElement('tbody');

        const tr_health = document.createElement('tr');
        const tr_attack = document.createElement('tr');

        // tr_health
        const td_health = document.createElement('td');
        const td_hv = document.createElement('td');

        td_hv.innerText = desc[0].split('P')[1];

        td_health.classList.add('statIconContainer');
        td_hv.classList.add('value');

        const imgElementHt = document.createElement('img');
        imgElementHt.src = '/resources/images/ui/hp.png';
        imgElementHt.classList.add('lazyloaded');
        imgElementHt.classList.add('statIcon');

        // tr_attack
        const td_attack = document.createElement('td');
        const td_av = document.createElement('td');

        td_attack.classList.add('statIconContainer');
        td_av.classList.add('value');

        td_av.innerText = desc[1].split('T')[1];

        const imgElementAt = document.createElement('img');
        imgElementAt.src = '/resources/images/ui/at.png';
        imgElementAt.classList.add('lazyloaded');
        imgElementAt.classList.add('statIcon');

        // appending
        td_health.appendChild(imgElementHt);
        td_attack.appendChild(imgElementAt);

        tr_health.appendChild(td_health);
        tr_health.appendChild(td_hv);

        tr_attack.appendChild(td_attack);
        tr_attack.appendChild(td_av);

        tbody.appendChild(tr_health);
        tbody.appendChild(tr_attack);

        table.appendChild(tbody);

        card_info.appendChild(div_orgset);
        card_info.appendChild(table);

        for(let i = 2; i < desc.length; i++){
            const effects = document.createElement('div');
            effects.classList.add('effectOutcome');

            if(desc[i].includes('â†·: ')){
                const imgElementFlip = document.createElement('img');
                imgElementFlip.src = '/resources/images/ui/TapIcon.png';
                imgElementFlip.classList.add('lazyloaded');
                imgElementFlip.classList.add('effectIcon');

                effects.appendChild(imgElementFlip);

                const text = document.createTextNode(desc[i].split('â†·: ')[1]);
                effects.appendChild(text);
            }
            else if(desc[i].includes('$: ')){
                const imgElementFlip = document.createElement('img');
                imgElementFlip.src = '/resources/images/ui/PaidIcon.png';
                imgElementFlip.classList.add('lazyloaded');
                imgElementFlip.classList.add('effectIcon');

                effects.appendChild(imgElementFlip);

                effects.innerText = desc[i].split('$: ')[1];
            }
            else{
                effects.innerText = desc[i];
            }
            card_info.appendChild(effects);
        }

        return card_info;
    }

    function familiarBuilder(file_name, set, deck_type, special, desc, pk_traits) {
        const card_info = document.createElement('div');

        const div_orgset = document.createElement('div');
        div_orgset.setAttribute('id', 'OriginSet');
        div_orgset.classList.add(set);

        const p_set = document.createElement('p');
        p_set.innerText = set;

        const div_orgind = document.createElement('div');
        div_orgind.classList.add('originIndicator');
        div_orgind.title = 'This card is part of the ' + set + ' set.';

        const p_type = document.createElement('p');
        p_type.innerText = deck_type;

        div_orgset.appendChild(p_set);
        div_orgset.appendChild(div_orgind);
        div_orgset.appendChild(p_type);        

        const table = document.createElement('table');
        table.classList.add('StatTable');

        const tbody = document.createElement('tbody');

        const tr_health = document.createElement('tr');
        const tr_dice = document.createElement('tr');
        const tr_attack = document.createElement('tr');

        // tr_health
        const td_health = document.createElement('td');
        const td_hv = document.createElement('td');

        td_hv.innerText = desc[0].split('P')[1];

        td_health.classList.add('statIconContainer');
        td_hv.classList.add('value');

        const imgElementHt = document.createElement('img');
        imgElementHt.src = '/resources/images/ui/hp.png';
        imgElementHt.classList.add('lazyloaded');
        imgElementHt.classList.add('statIcon');

        // tr_dice
        const td_dice = document.createElement('td');
        const td_dc = document.createElement('td');

        td_dice.classList.add('statIconContainer');
        td_dc.classList.add('value');

        td_dc.innerText = desc[1].split('C')[1];

        const imgElementDc = document.createElement('img');
        imgElementDc.src = '/resources/images/ui/dc.png';
        imgElementDc.classList.add('lazyloaded');
        imgElementDc.classList.add('statIcon');

        // tr_attack
        const td_attack = document.createElement('td');
        const td_av = document.createElement('td');

        td_attack.classList.add('statIconContainer');
        td_av.classList.add('value');

        td_av.innerText = desc[2].split('T')[1];

        const imgElementAt = document.createElement('img');
        imgElementAt.src = '/resources/images/ui/at.png';
        imgElementAt.classList.add('lazyloaded');
        imgElementAt.classList.add('statIcon');

        // appending
        td_health.appendChild(imgElementHt);
        td_dice.appendChild(imgElementDc);
        td_attack.appendChild(imgElementAt);

        tr_health.appendChild(td_health);
        tr_health.appendChild(td_hv);

        tr_dice.appendChild(td_dice);
        tr_dice.appendChild(td_dc);

        tr_attack.appendChild(td_attack);
        tr_attack.appendChild(td_av);

        tbody.appendChild(tr_health);
        tbody.appendChild(tr_dice);
        tbody.appendChild(tr_attack);

        table.appendChild(tbody);

        card_info.appendChild(div_orgset);
        card_info.appendChild(table);

        for(let i = 3; i < desc.length; i++){
            const effects = document.createElement('div');
            effects.classList.add('effectOutcome');

            if(desc[i].includes('â†·: ')){
                const imgElementFlip = document.createElement('img');
                imgElementFlip.src = '/resources/images/ui/TapIcon.png';
                imgElementFlip.classList.add('lazyloaded');
                imgElementFlip.classList.add('effectIcon');

                effects.appendChild(imgElementFlip);

                const text = desc[i].split('â†·: ')[1];

                const parts = text.split(/(HP|AT|DC)/);

                parts.forEach(part=> {
                    if(part === "HP" || part === "AT"|| part === "DC") {
                        const imgElementFlip = document.createElement('img');
                        imgElementFlip.src = '/resources/images/ui/'+ part.toLowerCase() +'.png';
                        imgElementFlip.classList.add('lazyloaded');
                        imgElementFlip.classList.add('inlineIcon');

                        imgElementFlip.alt = part;

                        effects.appendChild(imgElementFlip);
                    } else {
                        const textNode = document.createTextNode(part);
                        effects.appendChild(textNode);
                    }
                })
            }
            else if(desc[i].includes('$: ')){
                const imgElementFlip = document.createElement('img');
                imgElementFlip.src = '/resources/images/ui/PaidIcon.png';
                imgElementFlip.classList.add('lazyloaded');
                imgElementFlip.classList.add('effectIcon');

                effects.appendChild(imgElementFlip);

                const text = desc[i].split('$: ')[1];

                const parts = text.split(/(HP|AT|DC)/);

                parts.forEach(part=> {
                    if(part === "HP" || part === "AT"|| part === "DC") {
                        const imgElementFlip = document.createElement('img');
                        imgElementFlip.src = '/resources/images/ui/'+ part.toLowerCase() +'.png';
                        imgElementFlip.classList.add('lazyloaded');
                        imgElementFlip.classList.add('inlineIcon');

                        imgElementFlip.alt = part;

                        effects.appendChild(imgElementFlip);
                    } else {
                        const textNode = document.createTextNode(part);
                        effects.appendChild(textNode);
                    }
                })
            }
            else{
                const text = desc[i];

                if(i == desc.length - 1){
                    const p = document.createElement('p');
                    p.classList.add('quoteText');
                    p.innerText = desc[i];
                    effects.appendChild(p);
                } else{
                    const parts = text.split(/(HP|AT|DC)/);

                    parts.forEach(part=> {
                        if(part === "HP" || part === "AT"|| part === "DC") {
                            const imgElementFlip = document.createElement('img');
                            imgElementFlip.src = '/resources/images/ui/'+ part.toLowerCase() +'.png';
                            imgElementFlip.classList.add('lazyloaded');
                            imgElementFlip.classList.add('inlineIcon');

                            imgElementFlip.alt = part;

                            effects.appendChild(imgElementFlip);
                        } else {
                            const textNode = document.createTextNode(part);
                            effects.appendChild(textNode);
                        }
                    
                    })
                }
            }
            card_info.appendChild(effects);
        }

        return card_info;
    }

    function monsterBuilder(file_name, set, deck_type, special, desc, pk_traits) {
        
        const card_info = document.createElement('div');

        const div_orgset = document.createElement('div');
        div_orgset.setAttribute('id', 'OriginSet');
        div_orgset.classList.add(set);

        const p_set = document.createElement('p');
        p_set.innerText = set;

        const div_orgind = document.createElement('div');
        div_orgind.classList.add('originIndicator');
        div_orgind.title = 'This card is part of the ' + set + ' set.';

        const p_type = document.createElement('p');
        p_type.innerText = deck_type;

        div_orgset.appendChild(p_set);
        div_orgset.appendChild(div_orgind);
        div_orgset.appendChild(p_type);        

        const table = document.createElement('table');
        table.classList.add('StatTable');

        const tbody = document.createElement('tbody');

        const tr_health = document.createElement('tr');
        const tr_dice = document.createElement('tr');
        const tr_attack = document.createElement('tr');

        // tr_health
        const td_health = document.createElement('td');
        const td_hv = document.createElement('td');

        td_hv.innerText = desc[0].split('P')[1];

        td_health.classList.add('statIconContainer');
        td_hv.classList.add('value');

        const imgElementHt = document.createElement('img');
        imgElementHt.src = '/resources/images/ui/hp.png';
        imgElementHt.classList.add('lazyloaded');
        imgElementHt.classList.add('statIcon');

        // tr_dice
        const td_dice = document.createElement('td');
        const td_dc = document.createElement('td');

        td_dice.classList.add('statIconContainer');
        td_dc.classList.add('value');

        td_dc.innerText = desc[1].split('C')[1];

        const imgElementDc = document.createElement('img');
        imgElementDc.src = '/resources/images/ui/dc.png';
        imgElementDc.classList.add('lazyloaded');
        imgElementDc.classList.add('statIcon');

        // tr_attack
        const td_attack = document.createElement('td');
        const td_av = document.createElement('td');

        td_attack.classList.add('statIconContainer');
        td_av.classList.add('value');

        td_av.innerText = desc[2].substring(3, 7);

        const imgElementAt = document.createElement('img');
        imgElementAt.src = '/resources/images/ui/at.png';
        imgElementAt.classList.add('lazyloaded');
        imgElementAt.classList.add('statIcon');

        // appending
        td_health.appendChild(imgElementHt);
        td_dice.appendChild(imgElementDc);
        td_attack.appendChild(imgElementAt);

        tr_health.appendChild(td_health);
        tr_health.appendChild(td_hv);

        tr_dice.appendChild(td_dice);
        tr_dice.appendChild(td_dc);

        tr_attack.appendChild(td_attack);
        tr_attack.appendChild(td_av);

        tbody.appendChild(tr_health);
        tbody.appendChild(tr_dice);
        tbody.appendChild(tr_attack);

        table.appendChild(tbody);

        card_info.appendChild(div_orgset);
        card_info.appendChild(table);

        for(let i = 2; i < desc.length; i++){
            const effects = document.createElement('div');
            effects.classList.add('effectOutcome');

            if(desc[i].includes('â†·: ')){
                const imgElementFlip = document.createElement('img');
                imgElementFlip.src = '/resources/images/ui/TapIcon.png';
                imgElementFlip.classList.add('lazyloaded');
                imgElementFlip.classList.add('effectIcon');

                effects.appendChild(imgElementFlip);
                
                const text = desc[i].split('â†·: ')[1];

                const parts = text.split(/(HP|AT|DC)/);

                parts.forEach(part=> {
                    if(part === "HP" || part === "AT"|| part === "DC") {
                        const imgElementFlip = document.createElement('img');
                        imgElementFlip.src = '/resources/images/ui/'+ part.toLowerCase() +'.png';
                        imgElementFlip.classList.add('lazyloaded');
                        imgElementFlip.classList.add('inlineIcon');

                        imgElementFlip.alt = part;

                        effects.appendChild(imgElementFlip);
                    } else {
                        const textNode = document.createTextNode(part);
                        effects.appendChild(textNode);
                    }
                })
            }
            else if(desc[i].includes('$: ')){
                const imgElementFlip = document.createElement('img');
                imgElementFlip.src = '/resources/images/ui/PaidIcon.png';
                imgElementFlip.classList.add('lazyloaded');
                imgElementFlip.classList.add('effectIcon');

                effects.appendChild(imgElementFlip);

                const text = desc[i].split('$: ')[1];

                const parts = text.split(/(HP|AT|DC)/);

                parts.forEach(part=> {
                    if(part === "HP" || part === "AT"|| part === "DC") {
                        const imgElementFlip = document.createElement('img');
                        imgElementFlip.src = '/resources/images/ui/'+ part.toLowerCase() +'.png';
                        imgElementFlip.classList.add('lazyloaded');
                        imgElementFlip.classList.add('inlineIcon');

                        imgElementFlip.alt = part;

                        effects.appendChild(imgElementFlip);
                    } else {
                        const textNode = document.createTextNode(part);
                        effects.appendChild(textNode);
                    }
                })
            }
            else{
                var text = desc[i];
                if(i == 2)
                    text = desc[i].substring(7);
                else if(set == 'pkmn')
                    text = desc[i]
                

                    if(i == desc.length - 2 && desc[i].includes(" '")){
                        const p = document.createElement('p');
                        p.classList.add('quoteText');
                        p.innerText = text;
                        effects.appendChild(p);
                    } else if(i == desc.length - 1 && desc[i].includes("Rewards:")){
                        const p = document.createElement('p');
                        p.classList.add('quoteText');
                        var rewards_full = text.split('Rewards: ')[1];
                        var rewards = rewards_full.split('(+')[0];
                        p.innerText = rewards;
                        effects.appendChild(p);
                        if(rewards_full.split('(+')[1] != null){
                            const p2 = document.createElement('p');
                            p2.classList.add('quoteText');
                            p2.innerText = rewards_full.split('(+')[1].split(')')[0];
                            effects.appendChild(p2);
                        }
                    }else {
                        const parts = text.split(/(HP|AT|DC)/);

                        parts.forEach(part=> {
                            if(part === "HP" || part === "AT"|| part === "DC") {
                                const imgElementFlip = document.createElement('img');
                                imgElementFlip.src = '/resources/images/ui/'+ part.toLowerCase() +'.png';
                                imgElementFlip.classList.add('lazyloaded');
                                imgElementFlip.classList.add('inlineIcon');

                                imgElementFlip.alt = part;

                                effects.appendChild(imgElementFlip);
                            } else {
                                const textNode = document.createTextNode(part);
                                effects.appendChild(textNode);
                            }
                        })
                    }
                }
            card_info.appendChild(effects);
        }

        return card_info;
    }

    function SLICERBuilder(file_name, set, deck_type, special, desc) {
        const card_info = document.createElement('div');

        const div_orgset = document.createElement('div');
        div_orgset.setAttribute('id', 'OriginSet');
        div_orgset.classList.add(set);

        const p_set = document.createElement('p');
        p_set.innerText = set;

        const div_orgind = document.createElement('div');
        div_orgind.classList.add('originIndicator');
        div_orgind.title = 'This card is part of the ' + set + ' set.';

        const p_type = document.createElement('p');
        p_type.innerText = deck_type;

        div_orgset.appendChild(p_set);
        div_orgset.appendChild(div_orgind);
        div_orgset.appendChild(p_type);        

        card_info.appendChild(div_orgset);

        for(let i = 0; i < desc.length; i++){
            const effects = document.createElement('div');
            effects.classList.add('effectOutcome');

            if(desc[i].includes('â†·: ')){
                const imgElementFlip = document.createElement('img');
                imgElementFlip.src = '/resources/images/ui/TapIcon.png';
                imgElementFlip.classList.add('lazyloaded');
                imgElementFlip.classList.add('effectIcon');

                effects.appendChild(imgElementFlip);
                
                const text = desc[i].split('â†·: ')[1]
                
                    const parts = text.split(/(HP|AT|DC)/);

                    parts.forEach(part=> {
                        if(part === "HP" || part === "AT"|| part === "DC") {
                            const imgElementFlip = document.createElement('img');
                            imgElementFlip.src = '/resources/images/ui/'+ part.toLowerCase() +'.png';
                            imgElementFlip.classList.add('lazyloaded');
                            imgElementFlip.classList.add('inlineIcon');

                            imgElementFlip.alt = part;

                            effects.appendChild(imgElementFlip);
                        } else {
                            const textNode = document.createTextNode(part);
                            effects.appendChild(textNode);
                        }
                    })
               
                
            }
            else if(desc[i].includes('$: ')){
                const imgElementFlip = document.createElement('img');
                imgElementFlip.src = '/resources/images/ui/PaidIcon.png';
                imgElementFlip.classList.add('lazyloaded');
                imgElementFlip.classList.add('effectIcon');

                effects.appendChild(imgElementFlip);

                const text = desc[i].split('$: ')[1];

                const parts = text.split(/(HP|AT|DC)/);

                parts.forEach(part=> {
                    if(part === "HP" || part === "AT"|| part === "DC") {
                        const imgElementFlip = document.createElement('img');
                        imgElementFlip.src = '/resources/images/ui/'+ part.toLowerCase() +'.png';
                        imgElementFlip.classList.add('lazyloaded');
                        imgElementFlip.classList.add('inlineIcon');

                        imgElementFlip.alt = part;

                        effects.appendChild(imgElementFlip);
                    } else {
                        const textNode = document.createTextNode(part);
                        effects.appendChild(textNode);
                    }
                })
            }
            else{
                const text = desc[i];
                
                if(i == desc.length - 1 && desc[i].includes(" '")){
                    const p = document.createElement('p');
                    p.classList.add('quoteText');
                    p.innerText = desc[i].split('(+')[0];
                    effects.appendChild(p);
                    if (i == desc.length - 1 && desc[i].includes("soul" && "+")){
                        const p = document.createElement('p');
                        p.classList.add('quoteText');
                        p.innerText = desc[i].split('(+')[1].split(')')[0];
                        effects.appendChild(p);
                    }
                } else{
                const parts = text.split(/(HP|AT|DC)/);

                var lastchecker = 0;
                parts.forEach(part=> {
                    if(part === "HP" || part === "AT"|| part === "DC") {
                        const imgElementFlip = document.createElement('img');
                        imgElementFlip.src = '/resources/images/ui/'+ part.toLowerCase() +'.png';
                        imgElementFlip.classList.add('lazyloaded');
                        imgElementFlip.classList.add('inlineIcon');

                        imgElementFlip.alt = part;

                        effects.appendChild(imgElementFlip);
                        lastchecker++;
                    } else {
                        lastchecker++;
                        if (lastchecker == parts.length - 1 && part.includes(" '")){
                            const p = document.createElement('p');
                            p.classList.add('quoteText');
                            p.innerText = part;     
                        }
                        else {
                            var textNode = document.createTextNode(part.split('(+')[0]);
                            effects.appendChild(textNode);
                            if (part.includes("soul" && "(+")){
                                const p = document.createElement('p');
                                p.classList.add('quoteText');
                                p.innerText = part.split('(+')[1].split(')')[0];
                                effects.appendChild(p);
                            }
                        }
                    }
                })
                }
               
            }
            card_info.appendChild(effects);
        }

        return card_info;
    }

    /* 
    Gets traits from name & set.

    SELECT t.name 
    FROM cards c 
    JOIN card_types ct ON ct.card_id = c.id 
    JOIN types t ON t.id = ct.type_id 
    WHERE c.name = 'Serperior' AND c.c_set = 'pkmn';
    */

    /*
SELECT f.name 
FROM cards c 
JOIN card_footers cf ON cf.card_id = c.id 
JOIN footers f ON f.id = cf.footer_id 
WHERE c.name = 'Rebirth' AND c.c_set = 'halo';
*/