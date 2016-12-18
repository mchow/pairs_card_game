var CardGame = function(targetId) {
  // private variables
  var cards = [];
  var card_value;

  var started = false;
  var matches_found = 0;
  var card1 = false, card2 = false;

  // turn card face down
  var hideCard = function(id) {
    cards[id].innerHTML = '<img src="/assets/back.png">';
    // with(cards[id].style) {
    //   WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.0) rotate(180deg)";
    // }
  };

  // move card to pack
  var moveToPack = function(id) {
    hideCard(id);
    cards[id].matched = true;
    with(cards[id].style) {
      zIndex = "1000";
      top = "100px";
      left = "-140px";
      // WebkitTransform = MozTransform = OTransform = msTransform = "rotate(0deg)";
      zIndex = "0";
    }
  };

  //deal cards
  var moveToPlace = function(id) {
    cards[id].matched = false;
    with(cards[id].style) {
      zIndex = "1000";
      top = cards[id].fromtop + "px";
      left = cards[id].fromleft + "px";
      // WebkitTransform = MozTransform = OTransform = msTransform = "rotate(180deg)";
      zIndex = "0";
    }
  };

  // turn card face up, check for match
  var showCard = function(id) {
    if(id === card1) return;
    if(cards[id].matched) return;

    //click on card and return value
    // cards[id].firstChild.src = "//cdn.the-art-of-web.com/images/cards/" + card_value[id] + ".png";
    cards[id].innerHTML = 
      '<div class="card rank-' + card_value[id] + ' spades"> <span class="rank">' + card_value[id][0] + 
      '</span> <span class="suit">&' + getCardSuit(card_value[id][1]) + ';</span></div>';
// <div class="card rank-7 spades">
//         <span class="rank">7</span>
//         <span class="suit">&spades;</span>
//     </div>
// "<div class="card rank-3Hspades"> <span class="rank">3</span> <span class="suit">&spades;</span></div>"

    // with(cards[id].style) {
    //   WebkitTransform = MozTransform = OTransform = msTransform = "scale(1.2) rotate(185deg)";
    // }

    if(card1 !== false) {
      card2 = id;
      matchCards(card1, card2)
      card1 = card2 = false;
    } else { // first card turned over
      card1 = id;
    }
  };


  /**
    get full name of card suit based on a character

    @example 
    input: "D", output: "diamonds" 
  **/
  function getCardSuit(suitChar) {
    if(suitChar === "D") {
      return "diamonds"
    } else if(suitChar === "C") {
      return "clubs"
    } else if(suitChar === "H") {
      return "hearts"
    } else if(suitChar === "S") {
      return "spades"
    } else {
      return ""
    }
  }

  /**
    check if cards are match 
    if matched 
      fetches return matched data
      remove matched cards from the table
      update match counter in UI
      update match cards
  **/
  function matchCards(card1Index, card2Index) {
    $.post($(location).attr('href') + "/matchcards", {card1: card_value[card1Index], card2: card_value[card2Index]},
      function(data) {
        if(data.matched_cards.length > matches_found) {
          (function(card1Index, card2Index) {
            setTimeout(function() { moveToPack(card1Index); moveToPack(card2Index); }, 500);
          })(card1Index, card2Index);

          ++matches_found;
          document.getElementById("matched_counter").innerText = matches_found;
          document.getElementById("matched_cards").innerText = data.matched_cards;
          if(matches_found == card_value.length / 2) {
            alert("Found all Paris, You Win!!")
            // resetGame();
          }
        } else {
          (function(card1Index, card2Index) {
            setTimeout(function() { hideCard(card1Index); hideCard(card2Index); }, 500);
          })(card1Index, card2Index);
        }
    });
  }

  function resetGame() {
    matches_found = 0;
    started = false;
    //TOOD : option to start a new game
  }

  function passOutCards() {
    for(i=0; i < card_value.length; i++) {
      (function(idx) {
        setTimeout(function() { moveToPlace(idx); }, idx * 100);
      })(i);
    }
    started = true; 
  }

  function setupCardPosition() {
    var currentTable = $('.table_class').data('table');
    var matchedCards = currentTable["matched_cards"];
    var matchesFound = matchedCards.length;
    card_value = currentTable["current_cards"];
    started = currentTable["game_started"];

    setupNewGamePosition(card_value);
    //passout cards without timer
    for(i=0; i < card_value.length; i++) {
      moveToPlace(i);
    }
    //remove matched cards from table
    for (var i=0; i < matchesFound; i++) {
      var index = card_value.indexOf(matchedCards[i]);
      (function(idx) {
        setTimeout(function() { hideCard(index); }, idx * 100);
      })(i);
        
    }
  }

  function setupNewGamePosition(cardDeck) {

    for(var i=0; i < cardDeck.length; i++) {
        // var newCard = card.cloneNode(true);
        var newCard = document.createElement("div");
        newCard.innerHTML = "<img src=\"/assets/back.png\">";

        newCard.fromtop = 15 + 120 * Math.floor(i/4);
        newCard.fromleft = 70 + 100 * (i%4);
        (function(idx) {
          newCard.addEventListener("click", function() { showCard(idx); }, false);
        })(i);

        felt.appendChild(newCard);
        cards.push(newCard);
      } 
  }


  // initialise
  var stage = document.getElementById(targetId);
  var felt = document.createElement("div");
  felt.id = "felt";
  stage.appendChild(felt);
  setupCardPosition();

}