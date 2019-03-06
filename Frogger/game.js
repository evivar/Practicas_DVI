// Variables

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
    Game.setBoard(0, new BackgroundGame());
    board.add(new Frog());
    board.add(new Car(cars.blue, {y: 575}));
    Game.setBoard(1, board);
};

var winGame = function () {
    Game.setBoard(0, new BackgroundGame());
}

var loseGame = function () {
    Game.setBoard(3, new TitleScreen("Game Over", "Press fire to play again", playGame));
}

// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function () {
    Game.initialize("game", sprites, playGame  );
});

function drawExplosion_Low2High() {
    var fire = 13;
    var id = setInterval(explosion, 50);

    function explosion() {
        if (fire == -1) {
            clearInterval(id);
        } else {
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
        } else {
            fire++;
            SpriteSheet.render(ctx, "explosion", 250, 100, fire);
        }
    }
}