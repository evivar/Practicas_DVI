var canvas = document.getElementById('game');
var ctx = canvas.getContext && canvas.getContext('2d');
if (!ctx) {
    // No 2d context available, let the user know
    alert('Please upgrade your browser');
} else {
    startGame();
}
function startGame() {
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(50, 100, 380, 400);
    ctx.fillStyle = "rgba(0,0,128,0.5)";
    ctx.fillRect(25, 50, 380, 400);
    SpriteSheet.load({
        player_ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
        enemy_ship_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
        enemy_ship_orange: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
        enemy_ship_gray: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
        enemy_green_ball: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
        player_missile: { sx: 0, sy: 42, w: 7, h: 20, frames: 1 },
        enemy_missile: { sx: 9, sy: 42, w: 3, h: 20, frames: 1 },
        explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }
    }, function () {
       /* SpriteSheet.draw(ctx, "player_ship", 0, 0);
        SpriteSheet.draw(ctx, "enemy_ship_purple", 50, 0);
        SpriteSheet.draw(ctx, "enemy_ship_orange", 100, 0);
        SpriteSheet.draw(ctx, "enemy_ship_gray", 150, 0);
        SpriteSheet.draw(ctx, "enemy_green_ball", 200, 0);
        SpriteSheet.draw(ctx, "player_missile", 2, 0);
        SpriteSheet.draw(ctx, "player_missile", 30, 0);
        SpriteSheet.draw(ctx, "enemy_missile", 150, 27);
        SpriteSheet.draw(ctx, "enemy_missile", 190, 27);*/
        drawExplosion_Low2High();
        drawExplosion_High2Low();
    });
}

/*
    Para pintar los sprites invocamos desde el canvas del contexto, ctx, la funcion drawImage
        drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
            ·(sx, sy) -> Posicion desde la que empieza la imagen
            ·(sWidth, sHeight) -> Anchura y altura de la imagen
            ·(dx, dy) -> Coordenadas donde coloca la imagen
            ·(dWidth, dHeight) -> Nuevas dimensiones de ancho y alto
*/
function loadAllSprites() {
    var img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 100, 100);
    }
    img.src = 'Sprites/sprites.png';
}

function loadPlayerSpaceship() {
    var img = new Image();
    img.onload = function () {
        ctx.drawImage(img, 0, 0, 40, 40, 100, 100, 40, 40);
    }
    img.src = 'Sprites/sprites.png';
}

function loadSprite(sx, sy) {
    var img = new Image();
    img.onload = function () {
        ctx.drawImage(img, sx, sy, 40, 40, 100, 100, 40, 40);
    }
    img.src = 'Sprites/sprites.png';
}

function drawExplosion_Low2High() {
    var fire = 13;
    var id = setInterval(explosion, 100);
    function explosion() {
        if (fire == -1) {
            clearInterval(id);
        }
        else {
            fire--;
            SpriteSheet.render(ctx, "explosion", 150, 100, fire);
        }
    }
}

function drawExplosion_High2Low(){
    var fire = 0;
    var id = setInterval(explosion, 100);
    function explosion() {
        if (fire > 12) {
            clearInterval(id);
        }
        else {
            fire++;
            SpriteSheet.render(ctx, "explosion", 250, 100, fire);
        }
    }
}

