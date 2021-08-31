const mainDot = document.querySelector("#mainDot");
const scorePanel = document.querySelector("#scorePanel h2");
const newGameBtn = document.querySelector("#newGame");

const randomColor = function () {
  return Math.floor(Math.random() * 16777215).toString(16);
};

const randomYpos = function () {
  return Math.floor(Math.random() * 590 + 1);
};

const randomXpos = function () {
  return Math.floor(Math.random() * 1200 + 1);
};

function getElementPosition(elem) {
  const x_pos = parseInt(getComputedStyle(elem).left);
  const y_pos = parseInt(getComputedStyle(elem).top);

  return { x_pos: x_pos, y_pos: y_pos };
}

function getElementSize(elem) {
    const height = parseInt(getComputedStyle(elem).height);
    const width = parseInt(getComputedStyle(elem).width);
  
    return { height: height, width: width };
  }

window.addEventListener("keydown", (e) => {
  console.log(e.code);
  const moveSpeed = 20;
  const mainDotPosition = getElementPosition(mainDot);
  const x_pos = mainDotPosition["x_pos"];
  const y_pos = mainDotPosition["y_pos"];

  switch (e.code) {
    case "ArrowUp":
      mainDot.style.top = y_pos - moveSpeed + "px";
      break;
    case "ArrowRight":
      mainDot.style.left = x_pos + moveSpeed + "px";
      break;
    case "ArrowDown":
      mainDot.style.top = y_pos + moveSpeed + "px";
      break;
    case "ArrowLeft":
      mainDot.style.left = x_pos - moveSpeed + "px";
      break;
    default:
      break;
  }
});

function createCoin() {
  const coin = document.createElement("div");
  coin.classList.add("coins");
  coin.style.backgroundColor = "#" + randomColor();
  coin.style.top = randomYpos() + "px";
  coin.style.left = randomXpos() + "px";
  document.body.appendChild(coin);
  coinsArray.push(coin);
}

function increaseMainDot() {
    mainDot.style.height = (getElementSize(mainDot).height + 5) + 'px';
    mainDot.style.width = (getElementSize(mainDot).width + 5) + 'px';
}

function updateCurrentStatus() {
  const eatenCoins = coinsArray.filter((coin) => {
    coinPos = getElementPosition(coin);
    mainDotPos = getElementPosition(mainDot);

    /* if coin is eaten */
    if (
      coinPos["x_pos"] >= mainDotPos["x_pos"] &&
      coinPos["y_pos"] >= mainDotPos["y_pos"] &&
      coinPos["x_pos"] <= mainDotPos["x_pos"] + getElementSize(mainDot).width &&
      coinPos["y_pos"] <= mainDotPos["y_pos"] + getElementSize(mainDot).height
    ) {
      increaseMainDot();
      mainDot.style.backgroundColor = coin.style.backgroundColor;
      return coin;
    }
  });

  for (eatenCoin of eatenCoins) {
    eatenCoin.remove();
    countTotalCoins--;
    countScore++;
  }
}

let countTotalCoins = 0;
let countScore = 0;
const coinsArray = new Array();

function gameLoop() {

  updateCurrentStatus();
  scorePanel.innerText = `Score: ${countScore}`;
}

setInterval(gameLoop, 100);

setInterval(() => {
  if (countTotalCoins < 20) {
    createCoin();
    countTotalCoins++;
  }
}, 2000);

newGameBtn.addEventListener("click", () => {
    console.log("new game clicked");
    location.reload();
})