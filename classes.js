class DraggablePoint {
    constructor(pos) {
        this.pos = pos;
        this.radius = 10;
        this.color = "gray";
        this.hovering = false;
        this.dragging = false;
        this.updated = false;
        
        this.difference = new Victor(0, 0);
    }

    hoverCheck(mousePos) {
        if (this.isOn(mousePos)) {
            this.hovering = true;
            this.radius = 15;
        }
        else {
            this.hovering = false;
            this.radius = 10;
        }
    }

    dragCheck() {
        if (this.hovering) {
            this.dragging = true;
            this.color = "black";
        }
    }

    letGoCheck() {
        if (this.hovering) {
            this.dragging = false;
            this.color = "gray";
        }
    }

    update(mousePos) {
        if (this.dragging) {
            this.difference = mousePos.clone().subtract(this.pos);
            this.pos.copy(mousePos);
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 360);
        ctx.fill();
    }

    isOn(mousePos) {
        let diff = this.pos
                        .clone()
                        .subtract(mousePos)
                        .length();
        
        return (diff <= this.radius + 5);
    }

    sync(pnt) {
        pnt.pos = this.pos.clone();
    }
}

function BézierPoint(pts, t) {
    const u = 1 -t;
    const coefs = [
        u*u*u,
        3*u*u*t,
        3*u*t*t,
        t*t*t,
    ];

    let out = new Victor(0, 0);
    for (let i = 0; i < 4; i++) {
        const term = pts[i].pos.clone().multiply(new Victor(coefs[i], coefs[i]));
        out.add(term);
    }

    return out;
}

function BézierTangent(pts, t) {
    const coefs = [
        -3 * Math.pow(1-t, 2),
        -6 * (1-t) * t + 3 * Math.pow(1-t, 2),
        -3 * t * t + 6 * (1-t) * t,
        3 * t * t,
    ];

    let out = new Victor(0, 0);
    for (let i = 0; i < 4; i++) {
        const term = pts[i].pos.clone().multiply(new Victor(coefs[i], coefs[i]));
        out.add(term);
    }

    return out;
}

class Bézier {
    constructor(p1, p2, p3, p4) {
        this.pnts = [ p1, p2, p3, p4 ];
        this.arcLengths = [0];
        this.inverseMap = [0];
    }

    update() {
        this.arcLengths = [0];
        const steps = 100;

        let last = BézierPoint(this.pnts, 0);
        let length = 0;
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const curr = BézierPoint(this.pnts, t);
            const diff = curr.clone().subtract(last);
            length += diff.length();
            this.arcLengths.push(length);
            last = curr;
        }
        this.arcLengths = this.arcLengths.map(l => l / length);
        

        this.inverseMap = [0];
        for (let i = 1; i < steps; i++) {
            const d = i / steps;
            let low = 0, high = steps;
            while (low < high) {
                let mid = Math.floor((high + low) / 2);
                if (this.arcLengths[mid] < d) {
                    low = mid + 1;
                }
                else {
                    high = mid;
                }
            }

            let p = Math.max(0, low - 1);
            let lowl = this.arcLengths[p];
            let highl = this.arcLengths[p + 1];
            let inter = (p + (d - lowl) / (highl - lowl)) / steps;
            this.inverseMap.push(inter);
        }
        this.inverseMap.push(1);
    }
}



function toggleMenu() {
    document.getElementById("canvas-controls").style.width = (document.getElementById("stack-menu").style.width == "0") ? "350px" : "0";
}