export default function WallCollision (ballObj, canvas, player, paddleProps) {

    // if we hit bottom wall
    if (ballObj.x + ballObj.rad >= canvas.width) {
        player.lives--;
        ballObj.x = paddleProps.x;
        ballObj.y = paddleProps.y - 30;
        ballObj.dx = 6 * (Math.random() * 2 - 1);
        ballObj.dy = -6;
    }

    if (ballObj.x - ballObj.rad <= 0) {
        ballObj.dx *= -1; // on recule pour rebondir sur les bords
    }

    if (ballObj.y - ballObj.rad <= 0 || 
        ballObj.y + ballObj.rad >= canvas.height) {
        ballObj.dy *= -1; // on recule pour rebondir sur les bords
    }
}