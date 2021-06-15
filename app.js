const game = {
  startDeck: 35,
  startMarble: 10,

  counter: 0,

  dealer: { hand: [], marble: 0 },
  deck: [],

  players: [
    { name: "Player 1", id: "player", hand: [], marble: 10, score: 0 },
    { name: "Player 2", id: "computer", hand: [], marble: 10, score: 0 },
    { name: "Player 3", id: "alien", hand: [], marble: 10, score: 0 },
  ],
};

/////////////////////////////////////////////////////////////// game instructions
// tutorial notice, hide after game start
const gameTutorial = () => {
  $(".intro").show();
  $(".game-container").hide();
  $("#start").on("click", () => {
    $(".intro").hide();
    $(".game-container").show();
  });
};

/////////////////////////////////////////////////////////////// make deck
// value 1 - 35, set number 35 to const
const makeDeck = () => {
  for (let c = 0; c < game.startDeck; c++) {
    game.deck.push(c + 1);
  }
};

/////////////////////////////////////////////////////////////// shuffle deck
// -10 cards, push rest of deck into dealer hand
const shuffleDeck = (game) => {
  let playDeck = game.deck;
  let count = playDeck.length;
  while (count) {
    let temp = playDeck.splice(Math.floor(Math.random() * count), 1);
    playDeck.splice(count, 0, temp[0]);
    count -= 1;
  }
  playDeck = playDeck.slice(0, game.startDeck - 10);
  dealCard();
  // console.log(game.deck);
};

/////////////////////////////////////////////////////////////// deal card
const dealCard = () => {
  const card = game.deck.pop();
  game.dealer.hand.push(card);
  render(game);
};

/////////////////////////////////////////////////////////////// count turn
const checkTurn = (turn) => {
  turn = game.players;
  let index = game.counter % turn.length;
  return index; // returns index number
};

/////////////////////////////////////////////////////////////// sort player hands
// make li item with number, add into player div
const sortHand = (turn) => {
  turn = checkTurn();
  let playerHand = game.players[turn];
  playerHand["hand"].sort((a, b) => a - b);
  let $handList = $(`#${playerHand["id"]}-hand ul`);
  $handList.empty();
  for (let c = 0; c < playerHand["hand"].length; c++) {
    const $newLi = $("<li>").text(`${playerHand["hand"][c]}`);
    $handList.append($newLi);
  }
};

/////////////////////////////////////////////////////////////// give marble
// check if there's enough marbles
const checkMarble = (turn) => {
  turn = checkTurn();
  let playerMarb = game.players[turn].marble;
  if (playerMarb === 0) {
    $("#give").attr("disabled", true);
  } else {
    $("#give").attr("disabled", false);
  }
};

// -1 from marble invt and +1 in marble pool
const giveMarble = (turn) => {
  turn = checkTurn();
  let playerMarb = game.players[turn].marble;
  playerMarb -= 1;
  game.dealer.marble += 1;
  updateMarbCount();
  game.counter += 1;

  render(game);
};

const updateMarbCount = (turn) => {
  turn = checkTurn();
  const playerMarb = game.players[turn].marble;
  // $(`#${turn}-marble p`).text(`${game[turn].marble} marbles`);
  if (playerMarb === 1) {
    $(`#${game.players[turn]["id"]}-marble p`).text(`${playerMarb} marble`);
  } else {
    $(`#${game.players[turn]["id"]}-marble p`).text(`${playerMarb} marbles`);
  }
};

/////////////////////////////////////////////////////////////// take card
// dealer.hand => player.hand, deal card
const takeCard = (turn) => {
  turn = checkTurn();
  const player = game.players[turn];
  const currentCard = game.dealer.hand.pop();
  player.hand.push(currentCard);
  player.marble += game.dealer.marble;
  game.dealer.marble = 0;
  sortHand();
  updateMarbCount();
  game.counter += 1;
  // console.log(game[turn].hand);
  if (game.deck.length !== 0) {
    dealCard();
  }
  render(game);
};

/////////////////////////////////////////////////////////////// tabulte points
// find consecutive numbers, group them
const sumNoConsec = (arr) => {
  const consec = [];
  for (let num = 0; num < arr.length - 1; num++) {
    if (arr[num] + 1 === arr[num + 1]) {
      consec.push(arr[num + 1]);
    }
  }

  // exclude all consec numbers and sum numbers
  const sum = (acc, val) => {
    return acc + val;
  };
  const consecSum = consec.reduce(sum, 0);
  const totalSum = arr.reduce(sum);
  return totalSum - consecSum;
};

// subtract marble count
const finalScore = () => {
  let players = game.players;
  for (let t = 0; t < players.length; t++) {
    players[t].score = sumNoConsec(players[t].hand) - players[t].marble;
  }
};

// find lowest score amongst all players
const findLowestScore = (players) => {
  finalScore();
  players = game.players;
  let lowest = players[0];
  for (let s = 0; s < players.length; s++) {
    if (players[s].score < lowest.score) {
      lowest = players[s];
    }
  }
  if (lowest["id"] === 'player') {
    $("#turn h2").text(`Congratulations! Player 1 wins!`);
  } else if (lowest["id"] === "computer") {
    $("#turn h2").text("Hurray! Player 2 wins!");
  } else if (lowest["id"] === "alien") {
    $("#turn h2").text("Badaboom! Player 3 wins!");
  } else {
    $("#turn h2").text("Somehow, it's a tie.");
  }
};

/////////////////////////////////////////////////////////////// game end
// when deck has 0 cards, stop deal and disable buttons
const gameEnd = () => {
  if (game.dealer.hand.length === 0) {
    $("#take").attr("disabled", true);
    $("#give").attr("disabled", true);
    // render(game);

    findLowestScore();

    // update player scores
    for (let pl = 0; pl < game.players.length; pl++) {
      // const playerArr = [p1.score, p2.score, p3.score];
      $(`#${game.players[pl]['id']}-hand h3`).text(
        `Player ${pl + 1} scores ${game.players[pl]['score']}`
      );
    }
    restartGame();
  }
  // render();
};

// make new button or note to restart game
const restartGame = () => {
  // $takeCard.attr("disabled", true);
  // $giveMarb.attr("disabled", true);
  $("#take").hide();
  $("#give").hide();
  const $restartButton = $("<button>").attr("id", "restart").text("New game?");
  $(".options-container").append($restartButton);
};

// reset game data
const resetData = () => {
  // empty player hands, reset marble count
  for (let p = 0; p < game.players.length; p++) {
    const players = game.players;
    $(`#${players[p]['id']}-hand ul`).empty();
    players[p].marble = game.startMarble;
    players[p].hand = [];
    $(`#${players[p]['id']}-hand h3`).text(`${players[p]['name']}`);
  }

  // new deck new counter
  makeDeck();
  shuffleDeck(game);
  game.counter = 0;

  // reset buttons
  const $takeCard = $("#take");
  const $giveMarb = $("#give");
  $takeCard.show().removeAttr("disabled");
  $giveMarb.show().removeAttr("disabled");
  $("#restart").remove();

  render(game);
};

/////////////////////////////////////////////////////////////// render
const render = (game) => {
  ///////////////////////////// start game
  // dealCard();
  sortHand();

  ///////////////////////////// updating status on site
  if (checkTurn() === "player") {
    $("#turn h2").text(`Player 1's Turn`);
  } else if (checkTurn() === "computer") {
    $("#turn h2").text(`Player 2's Turn`);
  } else {
    $("#turn h2").text(`Player 3's Turn`);
  }
  checkMarble();

  $("#deck p").text(`${game.deck.length}`);
  $("#deal-card p").text(`${game.dealer.hand}`);
  $("#marble-pool p").text(`${game.dealer.marble}`);

  for (let m = 0; m < game.players.length; m++) {
    const players = game.players;
    $(`#${players[m]['name']}-marble p`).text(`${players[m].marble} marbles`);
  }
  // $("#player-marble p").text(`${game.players[0].marble} marbles`);
  // $("#computer-marble p").text(`${game.players[1].marble} marbles`);
  // $("#alien-marble p").text(`${game.players[2].marble} marbles`);

  // $("#player-hand p").text(`player hand ${game.player.hand}`);
  // $("#player-marble p").text(`${game.player.marble} marbles`);
  // $("#computer-hand p").text(`computer hand ${game.computer.hand}`);
  // $("#com-marble p").text(`${game.computer.marble} marbles`);

  ///////////////////////////// game end
  gameEnd();
  $("#restart").on("click", resetData);
};

const main = () => {
  gameTutorial();

  makeDeck();
  shuffleDeck(game);

  render(game);

  $("#take").on("click", takeCard);
  $("#give").on("click", giveMarble);
};

$(main);
