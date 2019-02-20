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

    var board = new Array(16);

    var cards = ["8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin"]

    var text = "Memory Game";

    var cardsFound = 0;

    var flippedCard = undefined;

    var flipping = false;

    var win = false;

    var clickEnable = true;

    // Funciones

    /**
     * Inicia el juego, creando el tablero y añadiendo aleatoreamente las parejas de cartas,
     * para luego empezar el bucle principal del juego
     */
    this.initGame = function () {
        var grid = new Array();
        for (var i = 0; i < board.length; i++) {
            grid.push(i);
        }
        for (var i = 0; i < board.length / 2; i++) {
            // Añado la primera carta
            var pos = this.randomize(grid);
            board[pos] = new MemoryGameCard(cards[i]);

            // Añado la segunda carta
            var pos = this.randomize(grid);
            board[pos] = new MemoryGameCard(cards[i]);
        }
        this.loop();
    }

    /**
     * Funcion que primero dibuja el mensaje correspondiente en su lugar y pinta las cartas en el tablero
     */
    this.draw = function () {
        gs.drawMessage(text);
        for (var i = 0; i < board.length; i++) {
            board[i].draw(gs, i);
        }
    }

    /**
     * Bucle principal del juego
     */
    this.loop = function () {
        setInterval(this.draw, 16);
    }

    /**
     * Funcion que cuando se hace click sobre una carta, primero comprueba que
     * ese ha clickado sobre una carta del tablero o sino te muestra un mensaje de alerta, comprueba que no esta encontrada 
     * y que existe, entonces le da la vuelta y commprueba si:
     *          - Es la primera carta a la que damos la vuelta para seguir jugando y seleccionar otra
     *          - Si ya le habiamos dado la vuelta y la pone boca abajo permitiendo seleccionar una pareja de cartas nueva
     *          - Si no es ninguno de estos casos comprueba si son iguales, si lo son comprueba si se ha ganado, si son distintas
     *            llama a this.tryAgain(cardId) que da la vuelta a las cartas seleccionadas
     *          - Si ya ha terminado el juego y vuelves a seleccionar una carta muestra un dialogo de confirmacion
     *            de si quieres jugar de nuevo o no, donde si clickas "Aceptar" recarga la pagina y empieza un juego nuevo
     * @param {} cardId - Carta seleccionada
     */
    this.onClick = function (cardId) {
        if (cardId !== null && cardId > -1 && clickEnable) {
            if (board[cardId].state !== 2 && board[cardId] !== undefined && !flipping) {
                if (!win) {
                    board[cardId].flip();
                    if (flippedCard === undefined) {
                        flippedCard = cardId;
                    } else {
                        if (board[cardId].pos !== board[flippedCard].pos) {
                            if (board[cardId].compareTo(board[flippedCard])) {
                                this.matchFound(cardId);
                                this.youWin(cardId);
                            } else {
                                this.disableOnClick();
                                this.tryAgain(cardId);
                            }
                        }
                    }
                } else {
                    var reset = confirm("Ya has ganado, ¿quieres jugar de nuevo?")
                    if (reset == true) {
                        location.reload();
                    }
                }
            } else if (board[cardId].state === 2) {
                console.log("Has seleccionado una carta que ya está encontrada, elige otra carta distinta");
            }
        } else if (!clickEnable) {
            console.log("Espera a que las cartas esten dadas la vuelta impaciente");
        } else {
            console.log("Eso no es una carta, ten cuidado donde pones el ratón");
        }
    }

    /**
     * Elige una posicion aleatoria del tablero para crear la carta y la elimina de este haciendo grid.splice(rand, 1)
     * @param  {} grid - Matriz que representa el tablero de juego
     * @return {int} pos - Posicion aleatoria donde estara la carta
     */
    this.randomize = function (grid) {
        var rand = Math.floor(Math.random() * grid.length);
        var pos = grid[rand];
        grid.splice(rand, 1);
        return pos;
    }

    /**
     * Funcion que cambia el texto y el estado de las cartas cuando la pareja coincide
     * @param {} cardId - Carta seleccionada
     */
    this.matchFound = function (cardId) {
        text = "Match found!!"
        board[cardId].found();
        board[flippedCard].found();
        cardsFound++;
        flippedCard = undefined;
    }

    /**
     * Funcion que comprueba si el juego se ha terminado y se ha ganado
     * @param {} cardId - Carta seleccionada
     */
    this.youWin = function (cardId) {
        if (cardsFound === board.length / 2) {
            text = "You win!!";
            win = true;
        }
    }

    /**
     * Funcion que cuando la pareja de cartas no coincide pone el texto Try again y espera 500 milisegundos para dar la 
     * vuelta a las cartas
     * @param {} cardId - Carta seleccionada
     */
    this.tryAgain = function (cardId) {
        text = "Wrong!!";
        flipping = true;
        var flipBack = setInterval(unflip, 500);

        function unflip() {
            if (flippedCard === undefined || cardId === undefined) {
                clearInterval(flipBack);
                game.enableOnClick();
                text = "Try Again";
            } else {
                if (board[flippedCard].state != 2) {
                    board[flippedCard].state = 0;
                }
                if (board[cardId].state != 2) {
                    board[cardId].state = 0;
                }
                flippedCard = undefined;
                flipping = false;
            }
        }
    }

    /**
     * Funcion que "activa" la funcion onClick()
     */
    this.enableOnClick = function () {
        clickEnable = true;
    }

    /**
     * Funcion que "desactiva" la funcion onClick() para prevenir errores mientras se ejecuta la funcion tryAgain(cardId);
     */
    this.disableOnClick = function () {
        clickEnable = false;
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

    this.id = id;

    this.state = 0;

    var pos = undefined;

    // Funciones

    /**
     * Funcion que "da la vuelta" a las cartas cambiando el estado
     * Posibles estados: 0 -> Boca abajo; 1 -> Boca arriba; 2 -> Carta encontrada
     */
    this.flip = function () {
        if (this.state === 0) {
            this.state = 1;
        }
    }

    /**
     * Funcion que cambia el estado de una carta a encontrada para que no pueda ser seleccionada de nuevo
     */
    this.found = function () {
        this.state = 2;
    }

    /**
     * Funcion que compara dos cartas y comprueba si son la misma o no
     * @returns {boolean} True si las cartas son iguales, False en caso contrario
     */
    this.compareTo = function (otherCard) {
        return (otherCard.id === this.id && otherCard.state != 2 && this.state != 2);
    }

    /**
     * Funcion que pinta los sprites de las cartas en su posicion dentro del tablero
     * @param {} gs - Servidor grafico
     * @param {} pos - Posicion de la carta en el tablero
     */
    this.draw = function (gs, pos) {
        if (this.state === 0) {
            gs.draw("back", pos);
            this.pos = pos;
        } else {
            gs.draw(this.id, pos);
        }
    }

};