// Variables

// Funciones y "Clases"

/**
 * SpriteSheet, hoja de sprites
 */
var SpriteSheet = new function () {
  // Variables

  this.map = {};

  // Funciones

  /**
   * Funcion que carga los sprites
   * @param {} spriteData
   * @param {} callback
   */
  this.load = function (spriteData, callback) {
    this.map = spriteData;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = 'sprites/sprites.png';
  };

  /**
   * Dibuja un sprite especifico en una posicion
   * @param {} ctx Contexto
   * @param {} sprite Sprite a dibujar
   * @param {} x Posicion x del sprite
   * @param {} y Posicion y del sprite
   * @param {} frame Frame del sprite a dibujar
   */
  this.draw = function (ctx, sprite, x, y, frame) {
    var s = this.map[sprite];
    if (!frame) frame = 0;
    ctx.drawImage(this.image,
      s.sx + frame * s.w,
      s.sy,
      s.w, s.h,
      x, y,
      s.w, s.h);
  }

  /**
   * Anima un sprite especifico en una posicion
   * @param {} ctx Contexto
   * @param {} sprite Sprite a dibujar
   * @param {} x Posicion x del sprite
   * @param {} y Posicion y del sprite
   * @param {} frame Frame del sprite a dibujar
   */
  this.render = function (ctx, sprite, x, y, frame) {
    var s = this.map[sprite];
    if (!frame) frame = 0;
    ctx.clearRect(x, y, s.w, s.h);
    ctx.fillStyle = "#FFFF00";
    ctx.fillRect(x, y, s.w, s.h);
    ctx.fillStyle = "rgba(0,0,128,0.5)";
    ctx.fillRect(x, y, s.w, s.h);
    ctx.drawImage(this.image, s.sx + frame * s.w, s.sy, s.w, s.h, x, y, s.w, s.h);
  };

}

/**
 * Juego principal
 */
var Game = new function () {
  // Variables

  var boards = [];

  // Le asignamos un nombre lógico a cada tecla que nos interesa
  var KEY_CODES = {
    37: 'left',
    39: 'right',
    32: 'fire'
  };

  this.keys = {};

  var maxTime = 30 / 1000;

  var lastTime = new Date().getTime();

  //Funciones

  /**
   * Inicialización del juego, se obtiene el canvas, se cargan los recursos y se llama a callback
   * @param {} canvasElementId
   * @param {} sprite_data
   * @param {} callback
   */
  this.initialize = function (canvasElementId, sprite_data, callback) {
    this.canvas = document.getElementById(canvasElementId)
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
    if (!this.ctx) {
      return alert("Please upgrade your browser to play");
    }
    this.setupInput();
    this.loop();
    SpriteSheet.load(sprite_data, callback);
  };

  /**
   * Inicializa el input del jugador
   */
  this.setupInput = function () {
    window.addEventListener('keydown', function (e) {
      if (KEY_CODES[e.keyCode]) {
        Game.keys[KEY_CODES[e.keyCode]] = true;
        e.preventDefault();
      }
    }, false);
    window.addEventListener('keyup', function (e) {
      if (KEY_CODES[e.keyCode]) {
        Game.keys[KEY_CODES[e.keyCode]] = false;
        e.preventDefault();
      }
    }, false);
  }

  /**
   * Bucle principal del juego
   */
  this.loop = function () {
    // Cada pasada borramos el canvas
    Game.ctx.fillStyle = "#000";
    Game.ctx.fillRect(0, 0, Game.width, Game.height);
    var curTime = new Date().getTime();
    requestAnimationFrame(Game.loop);
    var dt = (curTime - lastTime) / 1000;
    if (dt > maxTime) {
      dt = maxTime;
    }
    // y actualizamos y dibujamos todas las entidades
    for (var i = 0, len = boards.length; i < len; i++) {
      if (boards[i]) {
        boards[i].step(dt);
        boards[i].draw(Game.ctx);
      }
    }
    lastTime = curTime;
  };

  /**
   * Cambia el tablero activo
   * @param {} num Numero del tablero a activar
   * @param {} board Tablero a activar
   */
  this.setBoard = function (num, board) {
    boards[num] = board;
  };

}

// Funciones

/**
 * Pantalla de titulo
 * @param {} title Titulo del mensaje
 * @param {} subtitle Subtitulo del mensaje
 * @param {} callback 
 */
var TitleScreen = function TitleScreen(title, subtitle, callback) {

  // Variables

  var up = false;

  // Funciones

  /**
   * Funcion step de la pantalla de titulo
   * @param {} dt
   */
  this.step = function (dt) {
    if (!Game.keys['fire']) up = true;
    if (up && Game.keys['fire'] && callback) callback();
  };

  /**
   * Funcion draw de la pantalla de titulo
   * @param {} ctx Contexto
   */
  this.draw = function (ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.font = "bold 40px bangers";
    ctx.fillText(title, Game.width / 2, Game.height / 2);
    ctx.font = "bold 20px bangers";
    ctx.fillText(subtitle, Game.width / 2, Game.height / 2 + 140);
  };

};

/**
 * Tablero de juego
 */
var GameBoard = function () {

  // Variables

  var board = this;

  // Lista de objetos
  this.objects = [];

  this.cnt = {};

  // Funciones

  /**
   * Añade un nuevo objeto a la lista
   * @param {} obj Nuevo objeto
   */
  this.add = function (obj) {
    obj.board = this;
    this.objects.push(obj);
    this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
    return obj;
  };

  /**
   * Resetea la lista de objetos eliminados
   */
  this.resetRemoved = function () {
    this.removed = [];
  };

  /**
   * Marca un objeto para eliminarlo
   * @param {} obj Objeto a marcar
   */
  this.remove = function (obj) {
    var idx = this.removed.indexOf(obj);
    if (idx == -1) {
      this.removed.push(obj);
      return true;
    } else {
      return false;
    }
  };

  /**
   * Elimina los objetos marcados de la lista de eliminar
   */
  this.finalizeRemoved = function () {
    for (var i = 0, len = this.removed.length; i < len; i++) {
      var idx = this.objects.indexOf(this.removed[i]);
      if (idx != -1) {
        this.cnt[this.removed[i].type]--;
        this.objects.splice(idx, 1);
      }
    }
  };

  /**
   * Llama al mismo metodo sobre todos los objetos actuales
   * @param {} funcName Funcion a llamar
   */
  this.iterate = function (funcName) {
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0, len = this.objects.length; i < len; i++) {
      var obj = this.objects[i];
      obj[funcName].apply(obj, args);
    }
  };

  /**
   * Encuentra el primer objeto cuya funcion es true
   * @param {} func Funcion a buscar
   */
  this.detect = function (func) {
    for (var i = 0, val = null, len = this.objects.length; i < len; i++) {
      if (func.call(this.objects[i])) return this.objects[i];
    }
    return false;
  };

  /**
   * Llama a la funcion step de todos los objetos y elimina cualquier objeto marcado para eliminar
   * @param {} dt
   */
  this.step = function (dt) {
    this.resetRemoved();
    this.iterate('step', dt);
    this.finalizeRemoved();
  };

  /**
   * Dibuja todos los objetos
   * @param {} ctx Contexto
   */
  this.draw = function (ctx) {
    this.iterate('draw', ctx);
  };

  /**
   * Funcion que comprueba si solapan los bounding box de dos objetos
   * @param {} o1 Objeto 1
   * @param {} o2 Objeto 2
   */
  this.overlap = function (o1, o2) {
    return !((o1.y + o1.h - 1 < o2.y) || (o1.y > o2.y + o2.h - 1) ||
      (o1.x + o1.w - 1 < o2.x) || (o1.x > o2.x + o2.w - 1));
  };

  /**
   * Comprueba la colision
   * @param {} obj Objeto
   * @param {} type Tipo del objeto
   */
  this.collide = function (obj, type) {
    return this.detect(function () {
      if (obj != this) {
        var col = (!type || this.type & type) && board.overlap(obj, this);
        return col ? this : false;
      }
    });
  };

};

/**
 * Pinta un mensaje en la esquina
 * @param {} message Mensaje a pintar
 */
var PrintMsg = function (message) {

  // Variables


  // Funciones

  /**
   * Dibuja el mensaje
   * @param {} ctx Contexto
   */
  this.draw = function (ctx) {
    ctx.save();
    ctx.font = "bold 18px arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(message, 30, 20);
  }

  /**
   * Funcion step
   * @param {} dt
   */
  this.step = function (dt) {};

};