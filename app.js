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

/////////////////////////////////////////////////////////////// make new player??
class Player {
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.hand = [];
    this.marble = game.startMarble;
    this.score = 0;
  }

  addPlayer() {
    const $newPlayerContainer = $("<div>").addClass(`player-box`);
    const $newPlayerHand = $("<div>").attr("id", `${this.id}-hand`);
    const $newPlayerTitle = $("<h3>").text(`${this.name}`);
    const $newPlayerMarble = $("<div>")
      .addClass("marble")
      .attr("id", `${this.id}-marble`)
      .append($("<p>"));
    $newPlayerHand.append($newPlayerTitle, $("<ul>"));
    $newPlayerContainer.append($newPlayerHand, $newPlayerMarble);
    $(".game-container").append($newPlayerContainer);
  }
}



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
  let count = game.deck.length;
  while (count) {
    let temp = game.deck.splice(Math.floor(Math.random() * count), 1);
    game.deck.splice(count, 0, temp[0]);
    count -= 1;
  }
  game.deck = game.deck.slice(0, game.startDeck - 10);
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
  game.players[turn].marble -= 1;
  game.dealer.marble += 1;
  updateMarbCount();
  game.counter += 1;

  render(game);
};

const updateMarbCount = (turn) => {
  turn = checkTurn();
  let marbCount = game.players[turn].marble;
  if (marbCount === 1) {
    $(`#${game.players[turn]["id"]}-marble p`).text(`${marbCount} marble`);
  } else {
    $(`#${game.players[turn]["id"]}-marble p`).text(`${marbCount} marbles`);
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
const findLowestScore = () => {
  finalScore();
  const allPlayers = game.players;
  const goodWish = ["Congratulations", "Hurray", "Badaboom"];

  let lowest = allPlayers[0];
  for (let s = 0; s < allPlayers.length; s++) {
    if (allPlayers[s].score < lowest.score) {
      lowest = allPlayers[s];
    }

    if (
      allPlayers[s % allPlayers.length].score ===
      allPlayers[(s + 1) % allPlayers.length].score
    ) {
      $("#turn h2").text("Somehow, there's a tie.");
    } else {
      let randGoodWish = goodWish[Math.floor(Math.random() * goodWish.length)];
      $("#turn h2").text(`${randGoodWish}! ${lowest.name} wins!`);
    }
  }
};

/////////////////////////////////////////////////////////////// game end
// when deck has 0 cards, stop deal and disable buttons
const gameEnd = () => {
  if (game.dealer.hand.length === 0) {
    $("#take").attr("disabled", true);
    $("#give").attr("disabled", true);
    findLowestScore();

    // update player scores
    for (let pl = 0; pl < game.players.length; pl++) {
      $(`#${game.players[pl]["id"]}-hand h3`).text(
        `Player ${pl + 1} scored ${game.players[pl]["score"]}`
      );
    }
    restartGame();
  }
};

// make new button or note to restart game
const restartGame = () => {
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
    $(`#${players[p]["id"]}-hand ul`).empty();
    players[p].marble = game.startMarble;
    players[p].hand = [];
    $(`#${players[p]["id"]}-hand h3`).text(`${players[p]["name"]}`);
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
  sortHand();

  ///////////////////////////// updating status on site
  for (let t = 0; t < game.players.length; t++) {
    if (checkTurn() === t) {
      $("#turn h2").text(`${game.players[t]["name"]}'s Turn`);
    }
  }
  checkMarble();

  $("#deck p").text(`${game.deck.length}`);
  $("#deal-card p").text(`${game.dealer.hand}`);
  $("#marble-pool p").text(`${game.dealer.marble}`);

  for (let m = 0; m < game.players.length; m++) {
    const players = game.players;
    $(`#${players[m]["id"]}-marble p`).text(`${players[m].marble} marbles`);
  }

  ///////////////////////////// game end
  gameEnd();
  $("#restart").on("click", resetData);
};

const main = () => {
  gameTutorial();

  makeDeck();
  shuffleDeck(game);

  // const p4 = new Player("Player 4", "player4");
  // game.players.push(p4);
  // p4.addPlayer();

  render(game);

  $("#take").on("click", takeCard);
  $("#give").on("click", giveMarble);
};

$(main);
