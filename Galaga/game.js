// Variables
var sprites = {
    ship: { sx: 0, sy: 0, w: 37, h: 42, frames: 1 },
    enemy_ship_purple: { sx: 37, sy: 0, w: 42, h: 43, frames: 1 },
    enemy_ship_orange: { sx: 79, sy: 0, w: 37, h: 43, frames: 1 },
    enemy_ship_gray: { sx: 116, sy: 0, w: 42, h: 43, frames: 1 },
    enemy_green_ball: { sx: 158, sy: 0, w: 32, h: 33, frames: 1 },
    player_missile: { sx: 0, sy: 42, w: 7, h: 20, frames: 1 },
    enemy_missile: { sx: 9, sy: 42, w: 3, h: 20, frames: 1 },
    explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12 }
};

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;


// Funciones

// Especifica lo que se debe pintar al cargar el juego
var startGame = function () {
    Game.setBoard(0, new TitleScreen("Alien Invasion",
        "Press fire to start playing",
        playGame));
}
var playGame = function () {
    var board = new GameBoard();
    board.add(new PlayerShip());
    Game.setBoard(0, board);
};

// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function () {
    Game.initialize("game", sprites, startGame);
});

var PlayerShip = function () {
    this.w = SpriteSheet.map['ship'].w;
    this.h = SpriteSheet.map['ship'].h;
    this.x = Game.width / 2 - this.w / 2;
    this.y = Game.height - 10 - this.h;
    this.vx = 0;
    this.maxVel = 200;
    this.step = function (dt) {
        if (Game.keys['left']) { this.vx = -this.maxVel; }
        else if (Game.keys['right']) { this.vx = this.maxVel; }
        else { this.vx = 0; }
        this.x += this.vx * dt;
        if (this.x < 0) { this.x = 0; }
        else if (this.x > Game.width - this.w) {
            this.x = Game.width - this.w
        }
    }
    this.draw = function (ctx) {
        SpriteSheet.draw(ctx, 'ship', this.x, this.y, 0);
    }
}

/*function startGame() {
    // Pinto el fondo que son 3 rectangulos de distintos colores
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(50, 100, 380, 400);
    ctx.fillStyle = "rgba(0,0,128,0.5)";
    ctx.fillRect(25, 50, 380, 400);
    // Pinto la nave en 3 posiciones distintas
    SpriteSheet.load({
        ship: { sx: 0, sy: 0, w: 38, h: 43, frames: 3 },
        explosion: { sx: 0, sy: 64, w: 64, h: 64, frames: 12}
    }, function () {
        SpriteSheet.draw(ctx, "ship", 0, 0);
    });

}*/

function drawExplosion_Low2High() {
    var fire = 13;
    var id = setInterval(explosion, 50);
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

function drawExplosion_High2Low() {
    var fire = 0;
    var id = setInterval(explosion, 50);
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

