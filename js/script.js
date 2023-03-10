let deckId;
const state = {
    deck: null,
    dealer: {hand: [], dealerTotal : 0},
    player: {hand: [], yourTotal : 0}
}
const deckUrl = "https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
//visuals
const dealerCards = document.querySelector(".dealer-cards")
const playerCards = document.querySelector(".player-cards")
const hitButton = document.querySelector(".hit-button")
const stayButton = document.querySelector(".stay-button")
const cardsContainer = document.querySelector(".cards")
const main = document.querySelector("main")
const message = document.querySelector(".message")
const tryAgain = document.querySelector(".try-again")
const dealerTotalHTML = document.querySelector("#dealerTotal")
const yourTotalHTML = document.querySelector("#yourTotal")
// visuals ^
//--------------Fetching our initial Deck and storing the Deck Id in state (happens only one time at beginning of game)-----
async function getDeck() {
    const response = await fetch(deckUrl);
    const deckDetails = await response.json();
    console.log(deckDetails)
    state.deck = deckDetails
    console.log(state);
}
function startGame () {
    console.log("game has started")
    //--------------Fetching our initial Deck (happens only one time at beginning of game)-----
    getDeck().then(() => {
        //state.dealer.hand [1],
        //state.player.hand [1]
        console.log(state);
        // --------Fetching the 1st Draw
        draw(state.deck.deck_id, 4).then ((result) => {
            console.log(result)
            const firstDraw = result
            state.dealer.hand.push (firstDraw.cards[0],firstDraw.cards[1])
            state.player.hand.push (firstDraw.cards[2],firstDraw.cards[3])
            state.deck.remaining = result.remaining
            renderHand("dealer");
            renderHand("player");
            addUpHand("dealer");
            addUpHand("player");   
        });
}); // fetching new deck and storing it in state
}
function addUpHand (user) {
   let total = 0; 
    state[user].hand.forEach(card => {
            
        if(card.value === "QUEEN" || card.value === "KING" || card.value === "JACK") {
            total += 10
        }
        else if(card.value === "ACE" && (total + 11) <= 21) {
            total += 11;
        }
        else if (card.value === "ACE") {
            total += 1;
        }
        // find a way to not make value a string.. parseInt
        else {
            total += parseInt (card.value);
        }
        if(total > 21) {
            
            main.style.filter = "blur(4px)";
            message.style.display = "block";
            
        }
        console.log(yourTotal);
        if (user === "dealer") {
            state.dealer.dealerTotal = total
        dealerTotalHTML.innerText = total
        }
        else if (user === "player") {
            state.player.yourTotal = total
        yourTotalHTML.innerText = total
        }
        
        })
}

/*    
stayButton.addEventListener("click", () => {
    yourTotal
    if (yourTotal > 21) {
        message = "You Lose!";
    }
    else if (dealerTotal > 21) {
        message = "You Win!";
    }
    else if (yourTotal = dealerTotal) {
        message = "Tie!";
    }
    else if (yourTotal < dealerTotal) {
        message = "You Lose!"
    }
    document.getElementById("results").innerText = message;
})
}
*/
function renderHand (user){
    if(user === "player") {
        playerCards.innerHTML = ""
    }
    else if (user === "dealer") {
        dealerCards.innerHTML = ""
    }

    state[user].hand.forEach ((card, index) => {
        
        //if dealer && card index is 0 then we add class of "facedown"
        let myCard = document.createElement("div") //creating empty div
         
        myCard.classList.add ("card") //giving div class of card <div class="card"></div>
        
        myCard.style.backgroundImage = `url("${card.image}")` // applying a background image to the current card
        if(user === "player") {
            console.log('player', playerCards)
            playerCards.appendChild (myCard)
        } 
        else if (user === "dealer") {
            console.log('dealer', dealerCards)
            if(index === 0) {
                myCard.classList.toggle("facedown");
            }
            dealerCards.appendChild (myCard)
        }
    }); 
}



hitButton.addEventListener("click", () => {
    draw(state.deck.deck_id, 1).then ((result) => {
        console.log(result)
        const hitMe = result
        
        state.player.hand.push (hitMe.cards[0])
        state.deck.remaining = hitMe.remaining
        
        renderHand("player");
        addUpHand("player");
    });
});

stayButton.addEventListener("click", () => {
    if (state.dealer.dealerTotal < state.player.yourTotal) {
        draw(state.deck.deck_id, 1).then ((result) => {
            console.log(result)
            const dealerDraw = result
            state.dealer.hand.push (dealerDraw.cards[0])
            state.deck.remaining = dealerDraw.remaining
            renderHand("dealer")
            addUpHand("dealer")
        })
        if (state.dealer.dealerTotal > 21) {
            message.display.innerText = "Dealer Bust, You Win!"
        }
        else if (state.dealer.dealerTotal === 21) {
            message.display.innerText = "Dealer: 21, You Lose!"
        }
        document.getElementById("results").innertext = message;
        }
    });

async function draw(deckId, drawAmount = 1) {
    const cardUrl = `https://www.deckofcardsapi.com/api/deck/${deckId}/draw/?count=${drawAmount}`
    const response = await fetch(cardUrl);
    const cards = await response.json();
    console.log(cards)
    return cards;
    }

startGame();

tryAgain.onclick = function (){
    yourTotal = 0;
    cardsContainer.innerHTML = "";  
    main.style.filter = "blur(0px)";
    message.style.display = "none";
    getDeck();
}