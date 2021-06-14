const game = {
  player: { hand: [], marble: 10 },
  computer: { hand: [], marble: 10 },
  alien: { hand: [], marble: 10 },
  
  dealer: { hand: [], marble: 0 },
  deck: [],

  playerCount: ["player", "computer", "alien"],
  counter: 0,
};

/////////////////////////////////////////////////////////////// game instructions
// some instructions before game starts, hide after game start

/////////////////////////////////////////////////////////////// make deck
// value 1 - 35
const makeDeck = () => {
  for (let c = 0; c < 35; c++) {
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
  game.deck = game.deck.slice(0, 25);
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
  turn = game.playerCount;
  let index = game.counter % turn.length;
  return turn[index];
};

/////////////////////////////////////////////////////////////// sort player hands
const sortHand = (turn) => {
  turn = checkTurn();
  game[turn].hand.sort((a, b) => a - b);
  const $handList = $(`#${turn}-hand ul`);
  $handList.empty();
  for (let c = 0; c < game[turn].hand.length; c++) {
    const $newLi = $("<li>").text(`${game[turn].hand[c]}`);
    $handList.append($newLi);
  }
};

// ??? disable game clickables if not player turn

/////////////////////////////////////////////////////////////// give marble
// check if there's enough marbles
const checkMarble = (turn) => {
  turn = checkTurn();
  if (game[turn].marble === 0) {
    $("#give").attr("disabled", true);
  } else {
    $("#give").attr("disabled", false);
  }
};

// -1 from marble invt and +1 in marble pool
const giveMarble = (turn) => {
  turn = checkTurn();
  game[turn].marble -= 1;
  game.dealer.marble += 1;
  updateMarbCount();
  game.counter += 1;

  render(game);
};

const updateMarbCount = (turn) => {
  turn = checkTurn();
  // $(`#${turn}-marble p`).text(`${game[turn].marble} marbles`);
  if (game[turn].marble === 1) {
    $(`#${turn}-marble p`).text(`${game[turn].marble} marble`);
  } else {
    $(`#${turn}-marble p`).text(`${game[turn].marble} marbles`);
  }
};

/////////////////////////////////////////////////////////////// take card
// dealer.hand => player.hand, deal card
// make li item with number, add into player div
const takeCard = (turn) => {
  turn = checkTurn();
  // checkMarble();
  const currentCard = game.dealer.hand.pop();
  game[turn].hand.push(currentCard);
  game[turn].marble += game.dealer.marble;
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
// find consecutive numbers, group them, return smallest number
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

/////////////////////////////////////////////////////////////// game end
// when deck has 0 cards, stop deal and disable buttons
const gameEnd = () => {
  if (game.dealer.hand.length === 0) {
    $("#take").attr("disabled", true);
    $("#give").attr("disabled", true);
    // render(game);
    const playerScore = sumNoConsec(game.player.hand) - game.player.marble;
    const computerScore =
      sumNoConsec(game.computer.hand) - game.computer.marble;
    const alienScore = sumNoConsec(game.alien.hand) - game.alien.marble;
    if (playerScore < computerScore && playerScore < alienScore) {
      $("#turn h2").text("Congratulations! Player 1 wins!");
    } else if (computerScore < playerScore && computerScore < alienScore) {
      $("#turn h2").text("Hurray! Player 2 wins!");
    } else if (alienScore < playerScore && alienScore < computerScore) {
      $("#turn h2").text("Badaboom! Player 3 wins!");
    } else {
      $("#turn h2").text("Somehow, it's a tie.");
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
  const p1 = game.player;
  const p2 = game.computer;
  const p3 = game.alien;
  $("#player-hand ul").empty();
  $("#computer-hand ul").empty();
  $("#alien-hand ul").empty();
  p1.marble = 10;
  p1.hand = [];
  p2.marble = 10;
  p2.hand = [];
  p3.marble = 10;
  p3.hand = [];

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
  $("#player-marble p").text(`${game.player.marble} marbles`);
  $("#computer-marble p").text(`${game.computer.marble} marbles`);
  $("#alien-marble p").text(`${game.alien.marble} marbles`);

  // $("#player-hand p").text(`player hand ${game.player.hand}`);
  // $("#player-marble p").text(`${game.player.marble} marbles`);
  // $("#computer-hand p").text(`computer hand ${game.computer.hand}`);
  // $("#com-marble p").text(`${game.computer.marble} marbles`);

  ///////////////////////////// game end
  gameEnd();
  $("#restart").on("click", resetData);
};

const main = () => {
  $(".intro").show();
  $(".game-container").hide();
  $("#start").on("click", () => {
    $(".intro").hide();
    $(".game-container").show();
  });

  makeDeck();
  shuffleDeck(game);

  render(game);

  $("#take").on("click", takeCard);
  $("#give").on("click", giveMarble);
};

$(main);
