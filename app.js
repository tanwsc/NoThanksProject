const game = {
  player: { hand: [], marble: 10 },
  computer: { hand: [], marble: 10 },
  dealer: { hand: [], marble: 0 },
  deck: [],
};

// some instructions before game starts, hide after game start

// call names
const $deck = $("#deck");
const $takeCard = $("#take");
const $giveMarb = $("#give");

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
let counter = 0;
const checkTurn = () => {
  if (counter % 2 === 0) {
    return "player";
  } else {
    return "computer";
  }
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
// -1 from marble invt and +1 in marble pool
const giveMarble = (turn) => {
  turn = checkTurn();
  // check if there's enough marbles
  /*
  $("button#give").attr("disabled", false);
  if (game[turn].marble === 0) {
    $("button#give").attr("disabled", true);
  }
  */
  game[turn].marble -= 1;
  game.dealer.marble += 1;

  counter += 1;
  render(game);
};
// if no marbles, cannot give marble
/*
const checkMarble = (turn) => {
  turn = checkTurn();
  if (game[turn].marble === 0) {
    $("button#give").attr("disabled", "disabled");
    render(game);
  } else if (game[turn].marble > 0) {
    $("button#give").removeAttr("disabled", "disabled");
    render(game);
  }
  render(game);
};
*/

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
  counter += 1;
  // console.log(game[turn].hand);
  if (game.deck.length !== 0) {
    dealCard();
  }
  render(game);
};

/////////////////////////////////////////////////////////////// game end
// when deck has 0 cards, stop deal and disable buttons
const gameEnd = () => {
  const $takeCard = $("#take");
  const $giveMarb = $("#give");
  if (game.dealer.hand.length === 0) {
    $takeCard.attr("disabled", "disabled");
    $giveMarb.attr("disabled", "disabled");
    // render(game);
    const playerScore = sumNoConsec(game.player.hand) - game.player.marble;
    const computerScore =
      sumNoConsec(game.computer.hand) - game.computer.marble;
    if (playerScore < computerScore) {
      $("#turn h2").text("Congratulations! You win!");
      restartGame();
    } else if (computerScore < playerScore) {
      $("#turn h2").text("Player 2 wins!");
      restartGame();
    } else {
      $("#turn h2").text("Somehow, it's a tie.");
      restartGame();
    }
  }

  // render();
};

// make new button or note to restart game
const restartGame = () => {
  const $takeCard = $("#take");
  const $giveMarb = $("#give");
  $takeCard.attr("disabled", true);
  $giveMarb.attr("disabled", true);
  $takeCard.hide();
  $giveMarb.hide();
  const $restartButton = $("<button>").attr("id", "restart").text("New game?");

  $(".options-container").append($restartButton);
};

// reset game data
const resetData = () => {
  // empty player hands, reset marble count
  const p1 = game.player;
  const p2 = game.computer;
  $("#player-hand ul").empty();
  $("#computer-hand ul").empty();
  p1.marble = 10;
  p1.hand = [];
  p2.marble = 10;
  p2.hand = [];

  // new deck reshuffled
  makeDeck();
  shuffleDeck(game);

  // reset buttons
  const $takeCard = $("#take");
  const $giveMarb = $("#give");
  $takeCard.show();
  $giveMarb.show();
  $takeCard.removeAttr("disabled");
  $giveMarb.removeAttr("disabled");
  $("#restart").remove();

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
  const consecSum = consec.reduce(sum);
  const totalSum = arr.reduce(sum);
  return totalSum - consecSum;
};

/////////////////////////////////////////////////////////////// render
const render = (game) => {
  ///////////////////////////// start game
  // dealCard();
  sortHand();

  ///////////////////////////// updating status on site
  if (checkTurn() === "player") {
    $("#turn h2").text(`Player 1's Turn`);
  } else {
    $("#turn h2").text(`Player 2's Turn`);
  }
  // checkMarble();

  $("#deck p").text(`${game.deck.length}`);
  $("#deal-card p").text(`${game.dealer.hand}`);
  $("#marble-pool p").text(`${game.dealer.marble}`);

  if (game.player.marble === 1) {
    $(`#player-marble p`).text(`${game.player.marble} marble`);
  } else {
    $(`#player-marble p`).text(`${game.player.marble} marbles`);
  }

  if (game.computer.marble === 1) {
    $(`#computer-marble p`).text(`${game.computer.marble} marble`);
  } else {
    $(`#computer-marble p`).text(`${game.computer.marble} marbles`);
  }
  // $("#player-hand p").text(`player hand ${game.player.hand}`);
  // $("#player-marble p").text(`${game.player.marble} marbles`);
  // $("#computer-hand p").text(`computer hand ${game.computer.hand}`);
  // $("#com-marble p").text(`${game.computer.marble} marbles`);

  ///////////////////////////// game end
  gameEnd();
  $("#restart").on("click", resetData);
};

const main = () => {
  // console.log(checkTurn());
  makeDeck();
  shuffleDeck(game);
  // dealCard();
  $("#player-marble p").text(`${game.player.marble} marbles`);
  $("#computer-marble p").text(`${game.computer.marble} marbles`);
  render(game);

  $("#take").on("click", takeCard);
  $("#give").on("click", giveMarble);
};

$(main);
