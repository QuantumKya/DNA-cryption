const canvas = document.getElementById("kansas");
const ctx = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 720;

const DNA_WIDTH = 50;


var segments = [
    new Bézier(
        new DraggablePoint(new Victor(200, 100)),
        new DraggablePoint(new Victor(400, 200)),
        new DraggablePoint(new Victor(700, 100)),
        new DraggablePoint(new Victor(700, 250))
    ),
    new Bézier(
        new DraggablePoint(new Victor(700, 250)),
        new DraggablePoint(new Victor(700, 400)),
        new DraggablePoint(new Victor(300, 400)),
        new DraggablePoint(new Victor(100, 550))
    )
];

var code = "ACTGATAGCTAATCGTACCA";

var showBézier = true;
var showDNA = true;

document.getElementById("toggleBézier").addEventListener("change", (e) => {
    showBézier = e.target.checked;
    wholeDraw();
});
document.getElementById("toggleDNA").addEventListener("change", (e) => {
    showDNA = e.target.checked;
    wholeDraw();
});

document.getElementById("toggleBézier").checked = true;
document.getElementById("toggleDNA").checked = true;

document.getElementById("datain").addEventListener("change", (e) => {
    encodeToDNA();
    wholeDraw();
});

wholeDraw();

document.getElementById("export").addEventListener("click", (e) => {
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'dna-cryption.png';
    link.click();
});


function encodeToDNA() {
    const filesIn = document.getElementById("datain");
    const file = filesIn.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const arrayBuffer = event.target.result;
            const uint8array = new Uint8Array(arrayBuffer);

            let dataString = '';
            for (let i = 0; i < uint8array.length; i++) {
                dataString += uint8array[i].toString(4);
            }
            console.log("base4 string:", dataString);

            let dnaString = '';
            for (let i = 0; i < dataString.length; i++) {
                dnaString += acidFromDigit(dataString[i]);
            }

            console.log("DNA string:", dnaString);
            code = dnaString;
        };

        reader.readAsArrayBuffer(file);
    }
}

function colorFromAcid(char) {
    switch (char) {
        case 'A':
            return ["orange", "green"];
            break;
        case 'T':
            return ["green", "orange"];
            break;
        case 'C':
            return ["yellow", "lightblue"];
            break;
        case 'G':
            return ["lightblue", "yellow"];
            break;
        default:
            console.log("INVALID DNA CHARACTER??!!?!!");
            break;
    }
}

function acidFromDigit(digit) {
    switch (digit) {
        case '0':
            return 'A';
            break;
        case '1':
            return 'T';
            break;
        case '2':
            return 'C';
            break;
        case '3':
            return 'G';
            break;
        default:
            console.log("INVALID BASE-4 DATA?????!?!?!?!??!!");
            break;
    }
}



function drawDNALines(pnts) {
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 10;
    
    ctx.beginPath();
    const pinit = BézierPoint(pnts, 0);
    const tinit = BézierTangent(pnts, 0).norm().multiply(new Victor(DNA_WIDTH, DNA_WIDTH));
    ctx.moveTo(pinit.x + tinit.y, pinit.y - tinit.x);
    for (let t = -0.02; t <= 1.03; t += 0.005) {
        const point = BézierPoint(pnts, t);
        const tant = BézierTangent(pnts, t).norm().multiply(new Victor(DNA_WIDTH, DNA_WIDTH));
        ctx.lineTo(point.x + tant.y, point.y - tant.x);
    }
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(pinit.x - tinit.y, pinit.y + tinit.x);
    for (let t = -0.02; t <= 1.03; t += 0.005) {
        const point = BézierPoint(pnts, t);
        const tant = BézierTangent(pnts, t).norm().multiply(new Victor(DNA_WIDTH, DNA_WIDTH));
        ctx.lineTo(point.x - tant.y, point.y + tant.x);
    }
    ctx.stroke();
}

function drawATCG() {
    ctx.lineWidth = 10;

    const strandPer = code.length / segments.length;
    for (let s = 0; s < segments.length; s++) {
        const bzr = segments[s];
        for (let i = 0; i <= strandPer; i++) {
            if (s > 0 && i == 0) continue;

            const clr = colorFromAcid(code[strandPer * s + i - s]);

            ctx.beginPath();
            const t = bzr.inverseMap[Math.floor(i * 100 / (strandPer))];
            const point = BézierPoint(bzr.pnts, t);
            const tant = BézierTangent(bzr.pnts, t).norm().multiply(new Victor(DNA_WIDTH, DNA_WIDTH));
            const normup = new Victor(tant.y, -tant.x).add(point);
            const normdown = new Victor(-tant.y, tant.x).add(point);
            ctx.moveTo(normup.x, normup.y);
            ctx.lineTo(point.x, point.y);
            ctx.strokeStyle = clr[0];
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(normdown.x, normdown.y);
            ctx.strokeStyle = clr[1];
            ctx.stroke();
        }
    }
}

function drawBézier(pnts) {
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

function wholeDraw() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    

    if (showBézier) for (const bzr of segments) drawBézier(bzr.pnts);
    if (showDNA) {
        drawATCG();
        for (const bzr of segments) drawDNALines(bzr.pnts);
    }
}

wholeDraw();

canvas.addEventListener("mousedown", (event) => {
    for (let bzr of segments)
        for (let pnt of bzr.pnts)
            pnt.dragCheck();

    wholeDraw();
});

canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mousePos = new Victor(event.clientX - rect.left, event.clientY - rect.top);
    for (const bzr of segments) {
        for (const pnt of bzr.pnts) {
            pnt.hoverCheck(mousePos);
            pnt.update(mousePos);
        }
        bzr.update();
    }

    for (let s = 0; s < segments.length - 1; s++) {
        const lpnt = segments[s].pnts[3];
        if (lpnt.dragging) {
            segments[s].pnts[2].pos.add(lpnt.difference);
            segments[s+1].pnts[1].pos.add(lpnt.difference);
        }

        const anch1 = segments[s].pnts[2];
        if (anch1.dragging) {
            const diff = anch1.pos.clone().subtract(lpnt.pos);
            segments[s+1].pnts[1].pos.copy(lpnt.pos.clone().subtract(diff));
        }
    }

    for (let s = 1; s < segments.length; s++) {
        const lpnt = segments[s-1].pnts[3];

        const anch2 = segments[s].pnts[1];
        if (anch2.dragging) {
            const diff = anch2.pos.clone().subtract(lpnt.pos);
            segments[s-1].pnts[2].pos.copy(lpnt.pos.clone().subtract(diff));
        }
    }

    wholeDraw();
});

canvas.addEventListener("mouseup", (event) => {
    for (let bzr of segments)
        for (let pnt of bzr.pnts)
            pnt.letGoCheck();

    wholeDraw();
});