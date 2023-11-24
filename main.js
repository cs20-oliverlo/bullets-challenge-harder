// Set up canvas and graphics context
let cnv = document.getElementById("my-canvas");
let ctx = cnv.getContext("2d");
cnv.width = 800;
cnv.height = 550;

// EVENT STUFF
let mouseIsPressed = false;
document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);  
document.addEventListener("mousedown", mousedownHandler);
document.addEventListener("mouseup", mouseupHandler);

function keydownHandler(event) {
    if (event.code === "KeyW") {
        player.up = true;
    } else if (event.code === "KeyA") {
        player.left = true;
    } else if (event.code === "KeyD") {
        player.right = true;
    } else if (event.code === "KeyS") {
        player.down = true;
    }
}
  
function keyupHandler(event) {
    if (event.code === "KeyW") {
        player.up = false;
    } else if (event.code === "KeyA") {
        player.left = false;
    } else if (event.code === "KeyD") {
        player.right = false;
    } else if (event.code === "KeyS") {
        player.down = false;
    }
}


function mousedownHandler() {
    mouseIsPressed = true;
}

function mouseupHandler() {
    mouseIsPressed = false;
}

// Global Variables
let canvasMidWidth = cnv.width / 2;
let canvasMidHeight = cnv.height / 2;

// Reset Variables
let circles;
let circleSpawnTimer = 0;
let player;
let bullets;

reset();


// Animation
requestAnimationFrame(animate);
function animate() {
    // Fill Background
    ctx.fillStyle = `rgb(50, 50, 50)`;
    ctx.fillRect(0, 0, cnv.width, cnv. height);

    // Food Helper Functions
    for (let i = 0; i < circles.length; i++) {
        drawCircles(circles, i);
        moveCircles(i);
    }
    spontaneousGeneration();

    // Player Helper Functions
    drawCircles(player, 0);
    playerControls();

    // Bullet Helper Functions
    for (let i = 0; i < bullets.length; i++) {
        drawCircles(bullets, i);
        bulletMovement(i);
        bulletDetection(i);
    }

    // Request Animation Frame
    requestAnimationFrame(animate);
}

function drawCircles(shape, n) {
    if (shape === circles) {
        ctx.strokeStyle = shape[n].color;
        ctx.lineWidth = shape[n].lineWidth;
        ctx.beginPath();
        ctx.arc(shape[n].x, shape[n].y, shape[n].r, shape[n].startAngle, shape[n].endAngle * Math.PI);
        ctx.stroke();
    }
    
    if (shape === player) {
        ctx.fillStyle = shape.circleColor;
        ctx.beginPath();
        ctx.arc(shape.circleX, shape.circleY, shape.circleR, shape.startAngle, shape.endAngle * Math.PI);
        ctx.fill();

        ctx.strokeStyle = shape.lineColor;
        ctx.lineWidth = shape.lineWidth;
        ctx.beginPath();
        ctx.save();
        ctx.translate(shape.circleX, shape.circleY);
        rotateLine(shape);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -shape.circleR);
        ctx.stroke();
        ctx.restore();
    }

    if (shape === bullets) {
        ctx.fillStyle = shape[n].color;
        ctx.beginPath();
        ctx.arc(shape[n].x, shape[n].y, shape[n].r, shape[n].startAngle, shape[n].endAngle * Math.PI);
        ctx.fill();
    }
}

function playerControls() {
    playerMovement();
    playerShoot();
}

function playerMovement() {
    if (player.up === true) {
        player.circleY -= player.yVelocity;
        player.lineY -= player.yVelocity;
        player.lineY1 -= player.yVelocity;
        player.lastKeyPressed = "w";
    } else if (player.left === true) {
        player.circleX -= player.xVelocity;
        player.lineX -= player.xVelocity;
        player.lineX1 -= player.xVelocity;
        player.lastKeyPressed = "a";
    } else if (player.right === true) {
        player.circleX += player.xVelocity;
        player.lineX += player.xVelocity;
        player.lineX1 += player.xVelocity;
        player.lastKeyPressed = "d";
    } else if (player.down === true) {
        player.circleY += player.yVelocity;
        player.lineY += player.yVelocity;
        player.lineY1 += player.yVelocity;
        player.lastKeyPressed = "s";
    }

    if (player.circleX < 0) {
        player.circleX = 0;
        player.lineX = 0;
        player.lineX1 = 0;
    } else if (player.circleX > cnv.width) {
        player.circleX = cnv.width;
        player.lineX = cnv.width;
        player.lineX1 = cnv.width;
    }

    if (player.circleY < 0) {
        player.circleY = 0;
        player.lineY = 0;
        player.lineY1 = 0;
    } else if (player.circleY > cnv.height) {
        player.circleY = cnv.height;
        player.lineY = cnv.height;
        player.lineY1 = cnv.height;
    }
}

function playerShoot() {
    if (mouseIsPressed === true && player.reload === 15) {
        if (player.lastKeyPressed === "w") {
            bullets.push(newBullet(player.circleX, player.circleY, 5, "white", 0, 2, 0, -10));
        } else if (player.lastKeyPressed === "a") {
            bullets.push(newBullet(player.circleX, player.circleY, 5, "white", 0, 2, -10, 0));
        } else if (player.lastKeyPressed === "d") {
            bullets.push(newBullet(player.circleX, player.circleY, 5, "white", 0, 2, 10, 0));
        } else if (player.lastKeyPressed === "s") {
            bullets.push(newBullet(player.circleX, player.circleY, 5, "white", 0, 2, 0, 10));
        }

        player.reload = 0;
    }
    player.reload++;

    if (player.reload > 15) {
        player.reload = 15;
    }
}

function rotateLine(shape) {
    if (shape.lastKeyPressed === "w") {
        return ctx.rotate(0 * Math.PI / 180);
    } else if (shape.lastKeyPressed === "a") {
        return ctx.rotate(270 * Math.PI / 180);
    } else if (shape.lastKeyPressed === "d") {
        return ctx.rotate(90 * Math.PI / 180);
    } else {
        return ctx.rotate(180 * Math.PI / 180);
    }
}

function moveCircles(n) {
    if (circles[n].xVelocity === 0) {
        circles[n].xVelocity = randomInt(-5, 5);
    }
    if (circles[n].yVelocity === 0) {
        circles[n].yVelocity = randomInt(-5, 5);
    }

    circles[n].x += circles[n].xVelocity;
    circles[n].y += circles[n].yVelocity;

    if (circles[n].x + circles[n].r > cnv.width || circles[n].x - circles[n].r < 0) {
        circles[n].xVelocity = circles[n].xVelocity * -1;
    }
    if (circles[n].y + circles[n].r > cnv.height || circles[n].y - circles[n].r < 0) {
        circles[n].yVelocity = circles[n].yVelocity * -1;
    }
}

function spontaneousGeneration() {
    if (circleSpawnTimer > 120) {
        circles.push(newCircle(randomInt(50, cnv.width - 50), randomInt(50, cnv.height - 50), randomInt(10, 50), 3, 0, 2, randomInt(-5, 5), randomInt(-5, 5), `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`));
        circleSpawnTimer = 0;
    }
    circleSpawnTimer++;
}

function bulletMovement(n) {
    bullets[n].x += bullets[n].xVelocity;
    bullets[n].y += bullets[n].yVelocity;
}

function bulletDetection(n) {
    if (bullets[n].y < 0) {
        bullets.splice(n, 1);
    } else {
        for (let i = 0; i < circles.length; i++) {
            let run = circles[i].x - bullets[n].x;
            let rise = circles[i].y - bullets[n].y;
            let d = Math.sqrt(run ** 2 + rise ** 2);
    
            if (d < bullets[n].r + circles[i].r) {
                circles.splice(i, 1);
                bullets.splice(n, 1);
                return;
            }
        }  
    }
}

function newCircle(x1, y1, r1, lineWidth1, startAngle1, endAngle1, xVelocity1, yVelocity1, color1) {
    return {
        x: x1,
        y: y1,
        r: r1,
        lineWidth: lineWidth1,
        startAngle: startAngle1,
        endAngle: endAngle1,
        xVelocity: xVelocity1,
        yVelocity: yVelocity1,
        color: color1
    };
}

function newBullet(x1, y1, r1, color1, startAngle1, endAngle1, xVelocity1, yVelocity1) {
    return {
        x: x1,
        y: y1,
        r: r1,
        color: color1,
        startAngle: startAngle1,
        endAngle: endAngle1,
        xVelocity: xVelocity1,
        yVelocity: yVelocity1
    };
}

function reset() {
    circles = [];

    player = {
        circleX: canvasMidWidth,
        circleY: canvasMidHeight,
        circleR: 25,
        startAngle: 0,
        endAngle: 2,
        circleColor: "white",
        lineX: canvasMidWidth,
        lineY: canvasMidHeight,
        lineX1: canvasMidWidth,
        lineY1: canvasMidHeight - 25,
        lineWidth: 5,
        lineColor: "red",
        xVelocity: 5,
        yVelocity: 5,
        up: false,
        left: false,
        right: false,
        down: false,
        shoot: false,
        reload: 0,
        lastKeyPressed: "w"
    };

    bullets = [];
}