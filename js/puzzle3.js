const canvas =
  window.innerWidth > window.innerHeight
    ? window.innerHeight
    : window.innerWidth;
const puzzle = document.getElementById("puzzle");
puzzle.style.width = canvas + "px";
puzzle.style.height = canvas * 0.8 + "px";
let puzzleW = puzzle.clientWidth;
let puzzleH = puzzle.clientHeight;

let difficulty = 9;
let pieceW = puzzleW / Math.sqrt(difficulty);
let pieceH = puzzleH / Math.sqrt(difficulty);
let speed = 5;
let xPos = 0;
let yPos = 0;
let puzzleImg = "./assets/underwater/underwater1.svg";
let rotation = true;
let angles = [0, 90, 180, 270];
// puzzle.style.backgroundImage = `url(${puzzleImg})`
// puzzle.style.backgroundSize = `${puzzleW}px ${puzzleH}px`;
// puzzle.style.backgroundPosition = '0px 0px'

function sq(num) {
  return num * num;
}
function createPieces() {
  if (xPos + yPos * ~~Math.sqrt(difficulty) < difficulty) {
    if (xPos >= Math.sqrt(difficulty)) {
      xPos = 0;
      yPos += 1;
    }
    //action
    let d = document.createElement("div");
    //background and attributes
    d.style.backgroundImage = `url(${puzzleImg})`;
    d.style.backgroundSize = `${puzzleW}px ${puzzleH + 1}px`;
    d.style.backgroundPosition = `${-xPos * pieceW}px ${-yPos * pieceH}px`;
    d.setAttribute("class", "piece");

    //width height
    d.dataset.origX = xPos * pieceW;
    d.dataset.origY = yPos * pieceH;
    d.style.width = pieceW - 1 + "px";
    d.style.height = pieceH + "px";

    // position and rotation
    d.style.left = Math.random() * puzzleW + "px";
    d.style.top = Math.random() * puzzleH + "px";

    d.style.transform = `rotate(${
      angles[~~(Math.random() * angles.length)]
    }deg)`;

    puzzle.append(d);
    xPos += 1;
    d.innerHTML = xPos + yPos * ~~Math.sqrt(difficulty);
    setTimeout(createPieces, speed);
  }
}
function dist(x, y, x2, y2) {
  let X = x - x2;
  let Y = y - y2;
  return Math.sqrt(sq(X) + sq(Y));
}
createPieces();

let element;
let touching = false;
let dragging = false;
let overlap = { x: 0, y: 0 };

//mouse events
puzzle.addEventListener("mousedown", chooseElement);
puzzle.addEventListener("mousemove", moveElement);
puzzle.addEventListener("mouseup", releaseElement);
// window.addEventListener("click", rotateElement);
//touchevents
puzzle.addEventListener("touchstart", (e) => {
  touching = true;
  chooseElement(e);
});
puzzle.addEventListener("touchmove", moveElement);
puzzle.addEventListener("touchend", releaseElement);

//choose a puzzle piece
function chooseElement(e) {
  element = e.target;
  if (element.className !== "piece") {
    return;
  }
  if (touching) {
    if (e.touches) {
      overlap.x = readPx(element.style.left) - e.touches[0].clientX;
      overlap.y = readPx(element.style.top) - e.touches[0].clientY;
    } else {
      overlap.x = readPx(element.style.left) - e.clientX;
      overlap.y = readPx(element.style.top) - e.clientY;
    }
  } else {
    overlap.x = readPx(element.style.left) - e.clientX;
    overlap.y = readPx(element.style.top) - e.clientY;
  }

  element.style.zIndex = "1";
  console.log(element.innerHTML);
  return false;
}
//drag a puzzle piece
function moveElement(e) {
  if (e.target.className !== "piece") {
    return;
  }

  dragging = true;
  if (element) {
    if (touching) {
      element.style.left = e.touches[0].clientX + overlap.x + "px";
      element.style.top = e.touches[0].clientY + overlap.y + "px";
    } else {
      element.style.left = e.clientX + overlap.x + "px";
      element.style.top = e.clientY + overlap.y + "px";
    }
  }
  return false;
}
//rotate
function rotateElement(e) {
  if (e.target.className !== "piece") {
    return;
  }

  let original = e.target.style.transform;
  original = Number(original.replace(/rotate\(|(deg)|\)$/gm, "")) + 90;
  if (original >= 360) {
    original = 0;
  }

  e.target.style.transform = `rotate(${original}deg)`;
  return false;
}
//release
function releaseElement(e) {
  if (e.target.className !== "piece") {
    return;
  }

  if (!dragging) {
    rotateElement(e);
    // return false;
  }
  element.style.zIndex = "0";
  snapPiece();
  element = false;
  dragging = false;
}

function readPx(value) {
  return Number(value.replace("px", ""));
}

function snapPiece() {
  let origX = element.dataset.origX;
  let origY = element.dataset.origY;
  if (
    dist(readPx(element.style.left), readPx(element.style.top), origX, origY) <
    (element.clientWidth / 2 + element.clientHeight / 2) / 2
  ) {
    element.style.left = origX + "px";
    element.style.top = origY + "px";
  }
}
