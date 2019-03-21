// Funciones

// Especifica lo que se debe pintar al cargar el juego
var startGame = function () {
    Game.setBoard(0, new BackgroundGame());
    Game.setBoard(1, new Title());
    Game.setBoard(2, new TitleScreen("",
        "Press space to start playing",
        playGame));
}

var playGame = function () {
    var board = new GameBoard();
    board.add(new Water());
    board.add(new Home());
    Game.setBoard(1, new BackgroundGame());
    board.add(new Car(cars.blue, {}));
    board.add(new Car(cars.yellow, {
        A: 50
    }));
    board.add(new Car(cars.green, {}));
    board.add(new Car(cars.white, {A: 50}));
    board.add(new Car(cars.brown, {A: -50}));
    board.add(new Trunk(trunks.small, {A: 50}));
    board.add(new Trunk(trunks.small, {A: 50, y: 142}));
    board.add(new Trunk(trunks.medium, {A: 50}));
    board.add(new Trunk(trunks.large, {A: 50}));
    board.add(new Trunk(trunks.turtle, {
        A: 50
    }));
    board.add(new Frog());
    Game.setBoard(2, board);
};

var winGame = function () {
    Game.setBoard(1, new Title());
    Game.setBoard(2, new TitleScreen("",
        "You Win! Press space to start playing",
        playGame));
}

var loseGame = function () {
    Game.setBoard(1, new Title());
    Game.setBoard(2, new TitleScreen("",
        "Game Over: Press space to start playing",
        playGame));
}

// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function () {
    Game.initialize("game", sprites, startGame);
});