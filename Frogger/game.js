// Funciones

// Especifica lo que se debe pintar al cargar el juego
var startGame = function () {
    
}

var playGame = function () {
    var board = new GameBoard();
    Game.setBoard(0, new BackgroundGame());
    board.add(new Car(cars.blue, {}));
    board.add(new Car(cars.yellow, {A: 50}));
    /*board.add(new Car(cars.green, {}));
    board.add(new Car(cars.white, {A: 50}));
    board.add(new Car(cars.brown, {A: -50}));
    board.add(new Trunk(trunks.small, {}));*/
    board.add(new Trunk(trunks.turtle, {A: 50}));
    board.add(new Frog());
    Game.setBoard(1, board);
};

var winGame = function () {

}

var loseGame = function () {
    
}

// Indica que se llame al método de inicialización una vez
// se haya terminado de cargar la página HTML
// y este después de realizar la inicialización llamará a
// startGame
window.addEventListener("load", function () {
    Game.initialize("game", sprites, playGame );
});