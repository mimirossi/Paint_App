let myCanvas = document.querySelector("#myCanva");
let ctx = myCanvas.getContext("2d");
let color = document.querySelector("#color");
let range = document.querySelector("#range");
let save = document.querySelector("#save");
let clear = document.querySelector("#clear");
let output = document.querySelector("#output");

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
  imgContainer.append(imgDownload);
  // aggiungo al container il pulsante di rimozione
  imgContainer.append(deleteButton);
  output.prepend(imgContainer);
}
