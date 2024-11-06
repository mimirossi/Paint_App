let myCanvas = document.querySelector("#myCanva");
let ctx = myCanvas.getContext("2d");
let color = document.querySelector("#color");
let range = document.querySelector("#range");
let save = document.querySelector("#save");
let clear = document.querySelector("#clear");
let output = document.querySelector("#output");
console.dir(myCanvas);
let mouseLocation = {
  lastX: 0,
  lastY: 0,
  currentX: 0,
  currentY: 0,
  canDraw: false,
};

// // Pain parte da un punto e segue il mouse
// myCanvas.addEventListener("mousemove", (event) => {
//   draw(event.offsetX, event.offsetY);
//   console.log(event);
//   console.log(event.offsetX, event.offsetY);
// });
// function draw(x, y) {
//   ctx.beginPath();
//   ctx.moveTo(200, 200);
//   ctx.lineTo(x, y);
//   ctx.lineWidth = 1;
//   ctx.strokeStyle = "pink";
//   ctx.stroke();
//   ctx.closePath();
// }

// Paint classico , linea parte dal click e segue il mouse
myCanvas.addEventListener("mousedown", (event) => {
  mouseLocation.canDraw = true;
});
myCanvas.addEventListener("mouseup", (event) => {
  mouseLocation.canDraw = false;
});
myCanvas.addEventListener("mousemove", (event) => {
  mouseLocation.lastX = mouseLocation.currentX;
  mouseLocation.lastY = mouseLocation.currentY;
  mouseLocation.currentX = event.offsetX;
  mouseLocation.currentY = event.offsetY;
  if (mouseLocation.canDraw) {
    draw();
  }
});
function draw() {
  ctx.beginPath();
  ctx.moveTo(mouseLocation.lastX, mouseLocation.lastY);
  ctx.lineTo(mouseLocation.currentX, mouseLocation.currentY);
  ctx.lineWidth = range.value;
  ctx.strokeStyle = color.value;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.closePath();
}
clear.addEventListener("click", () => {
  ctx.clearRect(0, 0, 800, 600);
});
save.addEventListener("click", saveImg);
function saveImg() {
  // Con il metodo toDataURL prendiamo i dati che compongono l'immagine nel canvas e li convertiamo in formato JPEG, codificato in base64
  let dataURL = myCanvas.toDataURL("image/jpeg");

  // creo un div in cui metterò immagine e pulsante di download
  let imgContainer = document.createElement("div");
  imgContainer.classList.add("imgContainer");
  // creo un tag img
  let img = document.createElement("img");
  // Passo la stringa di dati direttamente all'attributo src dell'immagine
  img.src = dataURL;
  // metto l'immagine nel div contenitore
  imgContainer.append(img);
  let buttonContainer = document.createElement("div");
  buttonContainer.classList.add("buttons");
  imgContainer.append(buttonContainer);
  // aggiungo un pulsante per rimuovere l'immagine
  let deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    imgContainer.remove();
  });
  // creo un link per scaricare l'immagine
  let imgDownload = document.createElement("a");
  imgDownload.classList.add("download");
  // metto un testo
  imgDownload.textContent = "Download";
  // Passo la stringa di dati all'attributo href del link
  imgDownload.href = dataURL;
  // Aggiungo l'attributo download, specificando il nome da dare al file
  // in questo modo lo posso scaricare al click del pulsante
  imgDownload.setAttribute("download", "my-painting.jpg");
  // aggiungo il pulsante di download al container
  buttonContainer.append(imgDownload);
  // aggiungo al container il pulsante di rimozione
  buttonContainer.append(deleteButton);
  output.prepend(imgContainer);
}
function changeCanvas(mediaQuery) {
  if (mediaQuery.matches) {
    myCanvas.width = 300;
  } else {
    myCanvas.width = 700;
  }
}
let mediaQuery = window.matchMedia("(max-width: 800px)");

changeCanvas(mediaQuery);
mediaQuery.addEventListener("change", function () {
  changeCanvas(mediaQuery);
});

function startup() {
  myCanvas.addEventListener("touchstart", handleStart);
  myCanvas.addEventListener("touchend", handleEnd);
  myCanvas.addEventListener("touchcancel", handleCancel);
  myCanvas.addEventListener("touchmove", handleMove);
  log("Initialized.");
}

document.addEventListener("DOMContentLoaded", startup);

const ongoingTouches = [];
function handleStart(evt) {
  evt.preventDefault();
  log("touchstart.");
  const myCanvas = document.getElementById("canvas");
  const ctx = el.getContext("2d");
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    log(`touchstart: ${i}.`);
    ongoingTouches.push(copyTouch(touches[i]));
    const color = colorForTouch(touches[i]);
    log(`color of touch with id ${touches[i].identifier} = ${color}`);
    ctx.beginPath();
    ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false); // a circle at the start
    ctx.fillStyle = color;
    ctx.fill();
  }
}
function handleMove(evt) {
  evt.preventDefault();
  const myCanvas = document.getElementById("canvas");
  const ctx = el.getContext("2d");
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    const color = colorForTouch(touches[i]);
    const idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      log(`continuing touch ${idx}`);
      ctx.beginPath();
      log(
        `ctx.moveTo( ${ongoingTouches[idx].pageX}, ${ongoingTouches[idx].pageY} );`
      );
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      log(`ctx.lineTo( ${touches[i].pageX}, ${touches[i].pageY} );`);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      ctx.stroke();

      ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
    } else {
      log("can't figure out which touch to continue");
    }
  }
}
function handleEnd(evt) {
  evt.preventDefault();
  log("touchend");
  const myCanvas = document.getElementById("canvas");
  const ctx = el.getContext("2d");
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    const color = colorForTouch(touches[i]);
    let idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ctx.lineWidth = 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8); // and a square at the end
      ongoingTouches.splice(idx, 1); // remove it; we're done
    } else {
      log("can't figure out which touch to end");
    }
  }
}
function handleCancel(evt) {
  evt.preventDefault();
  log("touchcancel.");
  const touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    let idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1); // remove it; we're done
  }
}

function colorForTouch(touch) {
  let r = touch.identifier % 16;
  let g = Math.floor(touch.identifier / 3) % 16;
  let b = Math.floor(touch.identifier / 7) % 16;
  r = r.toString(16); // make it a hex digit
  g = g.toString(16); // make it a hex digit
  b = b.toString(16); // make it a hex digit
  const color = `#${r}${g}${b}`;
  return color;
}
function ongoingTouchIndexById(idToFind) {
  for (let i = 0; i < ongoingTouches.length; i++) {
    const id = ongoingTouches[i].identifier;

    if (id === idToFind) {
      return i;
    }
  }
  return -1; // not found
}
