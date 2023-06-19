export default function Brick(level, bricks, canvas, brick) {

    // level defines the number of lines of brick we want
    brick.width = canvas.width / 5 - 1;
    let newbricks = [];
    if (!bricks) {
        return [];
    }
    // si tous les levels sont deja remplis de bricks (les lignes de bricks)
    if (bricks.length >= 5 * level) {
        return;
    }

    // Brick formation
    for (let i = 0; i < 5 * level; i++) {
        let newBrick = new SingleBrick(
            brick.x + brick.width,
            brick.y,
            brick.width,
            brick.height,
            brick.color,
        );
        newbricks.push(newBrick);

        brick.x += brick.width + 1;
        if (brick.x + brick.width >= canvas.width) {
            brick.x = 0.5;
            brick.y += brick.height + 1;
        }
    }
    return newbricks;
}

class SingleBrick {
    constructor(x, y, w, h, c) {
        this.x = x - w;
        this.y = y;
        this.width = w;
        this.height = h;
        this.color = c;
        this.broke = false;
    }
    // to display the brick on the screen
    draw(ctx) {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.broke ? '#FFA62B' : this.color;
        ctx.strokeStyle = '#FFA62B';
        ctx.lineWidth = 5;
        ctx.shadowBlur = 0;
        ctx.shadowColor = "blue";
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fill();
;    }
}