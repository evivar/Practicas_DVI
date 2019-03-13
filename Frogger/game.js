// Variables

var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_ENEMY_PROJECTILE = 8,
    OBJECT_POWERUP = 16;


// Funciones

// Especifica lo que se debe pintar al cargar el juego
var startGame = function () {
    Game.setBoard(0, new BackgroundGame());
    Game.setBoard(0, new TitleScreen("Frogger",
        "Press space to start playing",
        playGame));
}

var playGame = function () {
    var board = new GameBoard();
    Game.setBoard(0, new BackgroundGame());
    board.add(new Car(cars.blue, {}));
    board.add(new Car(cars.brown, {}));
    board.add(new Car(cars.yellow, {}));
    board.add(new Car(cars.white, {}));
    board.add(new Car(cars.green, {}));
    board.add(new Trunk(trunks.small, {}));
    board.add(new Frog());
    Game.setBoard(1, board);
};

var winGame = function () {
    Game.setBoard(0, new BackgroundGame());
}

var loseGame = function () {
    Game.setBoard(1, new TitleScreen("Game Over", "Press space to play again", playGame));
}

// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function () {
    Game.initialize("game", sprites, playGame );
});