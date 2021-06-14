const game = {
  player: { hand: [], marble: 10 },
  computer: { hand: [], marble: 10 },
  dealer: { hand: [], marble: 0 },
  deck: [],
};

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
const $deck = $("#deck");
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
  game[turn].marble -= 1;
  game.dealer.marble += 1;
  counter += 1;
  render(game);
};

/////////////////////////////////////////////////////////////// take card
// dealer.hand => player.hand, deal card
// make li item with number, add into player div
const takeCard = (turn) => {
  turn = checkTurn();
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
  if (game.dealer.hand.length === 0) {
    // sortHand();
    $("#take").off();
    $("#give").off();
    // render();
    const playerScore = sumNoConsec(game.player.hand) - game.player.marble;
    const computerScore =
      sumNoConsec(game.computer.hand) - game.computer.marble;
    if (playerScore < computerScore) {
      console.log("Player 1 wins!");
    } else if (computerScore < playerScore) {
      console.log("Player 2 wins!");
    } else {
      console.log("it's a tie");
    }
  }
  // render();
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

  $("#deck p").text(`${game.deck.length}`);
  $("#deal-card p").text(`${game.dealer.hand}`);
  $("#marble-pool p").text(`${game.dealer.marble}`);
  $("#player-hand p").text(`player hand ${game.player.hand}`);
  $("#player-marble p").text(`player marble ${game.player.marble}`);
  $("#computer-hand p").text(`computer hand ${game.computer.hand}`);
  $("#com-marble p").text(`computer marble ${game.computer.marble}`);

  ///////////////////////////// game end
  gameEnd();
};

const main = () => {
  // console.log(checkTurn());
  makeDeck();
  shuffleDeck(game);
  // dealCard();
  render(game);

  $("#take").on("click", takeCard);
  $("#give").on("click", giveMarble);
};

$(main);
