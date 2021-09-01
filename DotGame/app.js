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

function moveMainDot(e) {
  setTimeout(() => {
    const moveSpeed = 40;
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
  }, 40);
}

window.addEventListener("keydown", moveMainDot);

function createCoinElement() {
  const coin = document.createElement("div");
  coin.classList.add("coins");
  coin.style.backgroundColor = "#" + randomColor();
  coin.style.top = randomYpos() + "px";
  coin.style.left = randomXpos() + "px";
  document.body.appendChild(coin);
  coinsArray.push(coin);
}

function createMineElement() {
  const mine = document.createElement("div");
  mine.classList.add("mines");
  mine.style.top = randomYpos() + "px";
  mine.style.left = randomXpos() + "px";
  document.body.appendChild(mine);
  minesArray.push(mine);
}

function increaseMainDot() {
  mainDot.style.height = getElementSize(mainDot).height + 5 + "px";
  mainDot.style.width = getElementSize(mainDot).width + 5 + "px";
}

function decreaseMainDot() {
  mainDot.style.height = getElementSize(mainDot).height - 5 + "px";
  mainDot.style.width = getElementSize(mainDot).width - 5 + "px";
}

function updateCoinsStatus() {
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

function updateMinesStatus() {
  const stepedMines = minesArray.filter((mine) => {
    minePos = getElementPosition(mine);
    mainDotPos = getElementPosition(mainDot);

    /* if coin is eaten */
    if (
      minePos["x_pos"] >= mainDotPos["x_pos"] &&
      minePos["y_pos"] >= mainDotPos["y_pos"] &&
      minePos["x_pos"] <= mainDotPos["x_pos"] + getElementSize(mainDot).width &&
      minePos["y_pos"] <= mainDotPos["y_pos"] + getElementSize(mainDot).height
    ) {
      decreaseMainDot();
      let prevColor = mainDot.style.backgroundColor;
      mainDot.style.backgroundColor = "red";
      setTimeout(() => {
        mainDot.style.backgroundColor = prevColor;
      }, 400);
      return mine;
    }
  });

  for (mine of stepedMines) {
    mine.remove();
    countTotalMines--;
    countScore--;
  }
}

let countTotalCoins = 0;
let countTotalMines = 0;
let countScore = 0;
let deg = 0;
const coinsArray = new Array();
const minesArray = new Array();

function gameLoop() {
  updateCoinsStatus();
  rotateMines();
  updateMinesStatus();
  scorePanel.innerText = `Score: ${countScore}`;
}

function createCoins() {
  if (countTotalCoins < 20) {
    createCoinElement();
    countTotalCoins++;
  }

  const timer = 2000 - countScore * 20;
  timer >= 800 ? setTimeout(createCoins, timer) : setTimeout(createCoins, 800);
}

function createMines() {
  if (countScore >= 10 && countTotalMines <= 5) {
    createMineElement();
    countTotalMines++;
  }

  const timer = 2000 - countScore * 20;
  timer >= 800 ? setTimeout(createMines, timer) : setTimeout(createMines, 800);
}

function rotateMines() {
  if (minesArray.length > 0) {
    deg += 10;
    for (mine of minesArray) {
      mine.style.transform = `rotate(${deg}deg)`;
    }
  }
}

setInterval(gameLoop, 100);
setTimeout(createCoins, 2000);
setTimeout(createMines, 2000);

newGameBtn.addEventListener("click", () => {
  console.log("new game clicked");
  location.reload();
});
