// Variables

// Clases -> var NombreVar = new function() {}
var SpriteSheet = new function () {
  // Variables
  this.map = {};
  // Funciones
  // Carga de los sprites
  this.load = function (spriteData, callback) {
    this.map = spriteData;
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = 'images/sprites.png';
  };
  // Dibuja un sprite especifico en una posicion
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
  // Dibuja la animacion de un sprite
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

var Game = new function () {
  // Variables
  var boards = [];
  // le asignamos un nombre lógico a cada tecla que nos interesa
  var KEY_CODES = { 37: 'left', 39: 'right', 32: 'fire' };

  this.keys = {};
  //Funciones

  // Inicialización del juego
  // se obtiene el canvas, se cargan los recursos y se llama a callback
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

  this.loop = function () {
    var dt = 30 / 1000;
    // Cada pasada borramos el canvas
    Game.ctx.fillStyle = "#000";
    Game.ctx.fillRect(0, 0, Game.width, Game.height);
    // y actualizamos y dibujamos todas las entidades
    for (var i = 0, len = boards.length; i < len; i++) {
      if (boards[i]) {
        boards[i].step(dt);
        boards[i].draw(Game.ctx);
      }
    }
    setTimeout(Game.loop, 30);
  };


  // Change an active game board
  this.setBoard = function (num, board) {
    boards[num] = board;
  };
};

// Funciones

var TitleScreen = function TitleScreen(title, subtitle, callback) {
  var up = false;

  this.step = function (dt) {
    if (!Game.keys['fire']) up = true;
    if (up && Game.keys['fire'] && callback) callback();
  };

  this.draw = function (ctx) {
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.font = "bold 40px bangers";
    ctx.fillText(title, Game.width / 2, Game.height / 2);
    ctx.font = "bold 20px bangers";
    ctx.fillText(subtitle, Game.width / 2, Game.height / 2 + 140);
  };
};

var GameBoard = function () {
  var board = this;
  // The current list of objects
  this.objects = [];
  this.cnt = {};
  // Add a new object to the object list
  this.add = function (obj) {
    obj.board = this;
    this.objects.push(obj);
    this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
    return obj;
  };
  // Reset the list of removed objects
  this.resetRemoved = function () { this.removed = []; };
  // Mark an object for removal
  this.remove = function (obj) {
    var idx = this.removed.indexOf(obj);
    if (idx == -1) {
      this.removed.push(obj);
      return true;
    } else {
      return false;
    }
  };
  // Removed an objects marked for removal from the list
  this.finalizeRemoved = function () {
    for (var i = 0, len = this.removed.length; i < len; i++) {
      var idx = this.objects.indexOf(this.removed[i]);
      if (idx != -1) {
        this.cnt[this.removed[i].type]--;
        this.objects.splice(idx, 1);
      }
    }
  };
  // Call the same method on all current objects
  this.iterate = function (funcName) {
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0, len = this.objects.length; i < len; i++) {
      var obj = this.objects[i];
      obj[funcName].apply(obj, args);
    }
  };
  // Find the first object for which func is true
  this.detect = function (func) {
    for (var i = 0, val = null, len = this.objects.length; i < len; i++) {
      if (func.call(this.objects[i])) return this.objects[i];
    }
    return false;
  };
  // Call step on all objects and them delete
  // any object that have been marked for removal
  this.step = function (dt) {
    this.resetRemoved();
    this.iterate('step', dt);
    this.finalizeRemoved();
  };
  // Draw all the objects
  this.draw = function (ctx) {
    this.iterate('draw', ctx);
  };
};

var FrameRate = function () {

  this.draw = function (ctx) {
    ctx.save();
    ctx.font = "bold 18px arial";
    ctx.fillStyle = "#FFFFFF";

    var txt = "Holi";

    ctx.fillText(txt, 10, 20);
  }


};
