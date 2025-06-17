class DraggablePoint {
    constructor(pos) {
        this.pos = pos;
        this.radius = 10;
        this.color = "gray";
        this.hovering = false;
        this.dragging = false;
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
        console.log(mousePos.toString());
        console.log(this.hovering);
        if (this.dragging) {
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
}