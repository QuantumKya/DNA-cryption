const canvas = document.getElementById("kansas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let pnts = [
    new DraggablePoint(new Victor(200, 200)),
    new DraggablePoint(new Victor(400, 300)),
    new DraggablePoint(new Victor(600, 100)),
    new DraggablePoint(new Victor(700, 500)),
];

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.height);


function wholeDraw() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let pnt of pnts) {
        pnt.draw(ctx);
    }

    ctx.beginPath();
    ctx.moveTo(pnts[0].pos.x, pnts[0].pos.y);
    ctx.bezierCurveTo(
        pnts[1].pos.x, pnts[1].pos.y,
        pnts[2].pos.x, pnts[2].pos.y,
        pnts[3].pos.x, pnts[3].pos.y
    );
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pnts[0].pos.x, pnts[0].pos.y);
    ctx.lineTo(pnts[1].pos.x, pnts[1].pos.y);
    ctx.lineTo(pnts[2].pos.x, pnts[2].pos.y);
    ctx.lineTo(pnts[3].pos.x, pnts[3].pos.y);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 1;
    ctx.stroke();
}

canvas.addEventListener("mousedown", (event) => {
    for (let pnt of pnts)
        pnt.dragCheck();

    wholeDraw();
});

canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mousePos = new Victor(event.clientX - rect.left, event.clientY - rect.top);
    for (let pnt of pnts) {
        pnt.hoverCheck(mousePos);
        pnt.update(mousePos);
    }

    wholeDraw();
});

canvas.addEventListener("mouseup", (event) => {
    for (let pnt of pnts)
        pnt.letGoCheck();

    wholeDraw();
});