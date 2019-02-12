/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function (gs) {

    // Variables
    var cards = ["8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin"]
    var table = new Array(16);
    var text = "MemoryGame";

    // Funciones
    this.initGame = function () {
        var posiciones = new Array();
        for (var i = 0; i < 16; i++) {
            posiciones.push(i);
        }
        for (var i = 0; i < table.length / 2; i++) {
            // Primera carta
            var rand = Math.floor(Math.random() * posiciones.length);
            console.log(rand);
            var pos = posiciones[rand]
            posiciones.splice(rand, 1);
            table[pos] = new MemoryGameCard(cards[i]);

            // Segunda carta
            var rand = Math.floor(Math.random() * posiciones.length);
            console.log(rand);
            var pos = posiciones[rand]
            posiciones.splice(rand, 1);
            table[pos] = new MemoryGameCard(cards[i]);
        }
        this.loop();
    }

    this.draw = function () {
        gs.drawMessage(text);
        for (var i = 0; i < table.length; i++) {
            table[i].draw(gs, i);
        }
    }

    this.loop = function () {
        setInterval(this.draw, 16);
    }
};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function (id) {

    // Variables
    var id = this.id;
    var name;
    var state = 0; // 0 -> Boca abajo, 1 -> Boca arriba, 2 -> Encontrada
    var pos;

    // Funciones
    this.flip = function () {
        this.state = 1;
    }

    this.found = function () {
        this.state = 2;
    }

    this.compareTo = function (otherCard) {
        return (this.id === otherCard.id);
    }

    this.draw = function (gs, pos) {
        switch (this.state) {
            case 0: gs.draw("back", pos);
                this.pos = pos;
                break;
            case 1: gs.draw(id, pos);
                break;
            case 2: gs.draw(id, pos);
                break;
        }
    }
};