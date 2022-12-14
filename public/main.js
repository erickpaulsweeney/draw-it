const socket = io.connect(location.origin);
const color = [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
];

let loaded = false;
let history = [];
// console.log(color);

socket.on("load-canvas", (data) => {
    console.log(data);
    history = data;
    loaded = true;
});

function setup() {
    createCanvas(750, 750);
    background(0);
    noStroke();

    socket.on("new-drawing", (data) => {
        fill(...data.color);
        ellipse(data.x, data.y, 10, 10);
    });
}

function draw() {
    if (loaded) {
        for (let i = 0; i < history.length; i++) {
            const item = history[i];
            fill(...item.color);
            ellipse(item.x, item.y, 10, 10);
        }
        loaded = false;
    }
}

const setBg = () => background(0);

socket.on("clear-canvas", () => setBg());

function clearCanvas() {
    setBg();
    socket.emit("clear-canvas");
}

function mouseDragged() {
    let data = {
        x: mouseX,
        y: mouseY,
        color: color,
    };
    fill(...color);
    ellipse(mouseX, mouseY, 10, 10);
    socket.emit("new-drawing", data);
}