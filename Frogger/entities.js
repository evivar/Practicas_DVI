var sprites = {
    blue_car: {
        sx: 8,
        sy: 6,
        w: 90,
        h: 47,
        frames: 1
    },
    green_car: {
        sx: 108,
        sy: 4,
        w: 95,
        h: 47,
        frames: 1
    },
    yellow_car: {
        sx: 213,
        sy: 6,
        w: 95,
        h: 47,
        frames: 1
    },
    white_van: {
        sx: 6,
        sy: 62,
        w: 125,
        h: 46,
        frames: 1
    },
    brown_van: {
        sx: 148,
        sy: 62,
        w: 199,
        h: 47,
        frames: 1
    },
    skull: {
        sx: 211,
        sy: 123,
        w: 48,
        h: 40,
        frames: 4
    },
    medium_trunk: {
        sx: 0,
        sy: 116,
        w: 200,
        h: 51,
        frames: 1
    },
    large_trunk: {
        sx: 0,
        sy: 163,
        w: 268,
        h: 51,
        frames: 1
    },
    small_trunk: {
        sx: 260,
        sy: 173,
        w: 140,
        h: 40,
        frames: 1
    },
    leaf: {
        sx: 4,
        sy: 234,
        w: 44,
        h: 40,
        frames: 1
    },
    fly: {
        sx: 58,
        sy: 239,
        w: 31,
        h: 34,
        frames: 1
    },
    green: {
        sx: 95,
        sy: 225,
        w: 58,
        h: 57,
        frames: 1
    },
    blue: {
        sx: 158,
        sy: 225,
        w: 58,
        h: 57,
        frames: 1
    },
    black: {
        sx: 221,
        sy: 225,
        w: 58,
        h: 57,
        frames: 1
    },
    grass: {
        sx: 284,
        sy: 225,
        w: 58,
        h: 57,
        frames: 1
    },
    leaf_grass: {
        sx: 348,
        sy: 225,
        w: 58,
        h: 57,
        frames: 1
    },
    animate_turtle: {
        sx: 5,
        sy: 288,
        w: 50,
        h: 47,
        frames: 9
    },
    frog: {
        sx: 0,
        sy: 339,
        w: 38,
        h: 45,
        frames: 7
    },
    turtle: {
        sx: 281,
        sy: 344,
        w: 52,
        h: 40,
        frames: 2
    },
    title: {
        sx: 8,
        sy: 395,
        w: 261,
        h: 164,
        frames: 1
    },
    background: {
        sx: 398,
        sy: 0,
        w: 549,
        h: 624,
        frames: 1
    },
    water: {
        sx: 421,
        sy: 48,
        w: 550,
        h: 240,
        frames: 1
    },
    home: {
        sx: 421,
        sy: 0,
        w: 550,
        h: 49,
        frames: 1
    }
}

var OBJECT_PLAYER = 1,
    OBJECT_ENEMY = 2,
    OBJECT_WATER = 4,
    OBJECT_TRUNK = 8,
    OBJECT_HOME = 16;

/*
    Utilizamos esta funcion para el movimiento de los enemigos:
        vx = A + B * sin (C * t + D)
        vy = E + F * sin (G * t + H)

        A: Velocidad constante horizontal
        B: Velocidad sinusoidal horizontal
        C: Periodo horizontal
        D: Desfase de la velocidad sinusoidal horizontal
        E: Velocidad constante vertical
        F: Velocidad sinusoidal vertical
        G: Periodo vertical
        H: Desfase de la velocidad sinusoidal vertical
*/
// Blueprints de los enemigos
var cars = {
    blue: {
        x: -90,
        y: 478,
        sprite: 'blue_car',
        A: 100,
    },
    green: {
        x: 485,
        y: 526,
        sprite: 'green_car',
        A: -100
    },
    yellow: {
        x: -95,
        y: 430,
        sprite: 'yellow_car',
        A: 100
    },
    white: {
        x: -125,
        y: 336,
        sprite: 'white_van',
        A: 100
    },
    brown: {
        x: 485,
        y: 382,
        sprite: 'brown_van',
        A: -100
    },
};

//Blueprints de los troncos y las ranas
var trunks = {
    small: {
        x: -90,
        y: 248,
        sprite: 'small_trunk',
        A: 50
    },
    medium: {
        x: -90,
        y: 47,
        sprite: 'medium_trunk',
        A: 100
    },
    large: {
        x: -90,
        y: 95, // Para ir mas arriba: 95 y 47
        sprite: 'large_trunk',
        A: 100
    },
    turtle: {
        x: 0,
        y: 191, // Para ir mas arriba: 95 y 47
        sprite: 'turtle',
        A: 50
    }
};

var Sprite = function () {}

Sprite.prototype.setup = function (sprite, props) {
    this.sprite = sprite;
    this.merge(props);
    this.frame = this.frame || 0;
    this.w = SpriteSheet.map[sprite].w;
    this.h = SpriteSheet.map[sprite].h;
}

Sprite.prototype.merge = function (props) {
    if (props) {
        for (var prop in props) {
            this[prop] = props[prop];
        }
    }
}

Sprite.prototype.draw = function (ctx) {
    SpriteSheet.draw(ctx, this.sprite, this.x, this.y, this.frame);
}

Sprite.prototype.hit = function () {
    this.board.remove(this);
}

var BackgroundGame = function () {
    this.setup('background', {});
    this.x = Game.width / 2 - this.w / 2;
    console.log(this.x);
    this.y = Game.height - this.h;
    this.y = this.y + 2
    console.log(this.y);
}

BackgroundGame.prototype = new Sprite();

BackgroundGame.prototype.step = function (dt) {}

var Frog = function() {
    this.setup('frog', {vx: 0, time: 0.25});
    this.reload = this.time;
    this.x = Game.width / 2 - this.w / 2;
    this.y = Game.height - this.h;
}

Frog.prototype = new Sprite();
Frog.prototype.type = OBJECT_PLAYER;

Frog.prototype.step = function(dt) {

  if(this.board.collide(this,OBJECT_WATER)){
      if(!this.board.collide(this,OBJECT_TRUNK))
           this.hit();
   }
    // Restamos el tiempo trancurrido
    this.reload -= dt;

    if (this.reload <= 0) {

        this.x += this.vx * dt;
        
        if (Game.keys['up']) {
            this.reload = this.time;
            this.y -= 48;
        } else if (Game.keys['down']) {
            this.reload = this.time;
            this.y += 48;
        } else if (Game.keys['right'] && this.x + this.w <= Game.width - this.w) {
            this.reload = this.time;
            this.x += 40;
        } else if (Game.keys['left'] && this.x - this.w >= 0) {
            this.reload = this.time;
            this.x -= 40;
        }

        if (this.y < 0)
        { 
            this.y = 0;
        }
        else if (this.y > Game.height - this.h){
         this.y = Game.height - this.h;
         }
        if (this.x < 0)
        { 
            this.x = 0;
            
        }
        else if (this.x > Game.width - this.w){
         this.x = Game.width - this.w;
         }
    }
    this.vx = 0;
};

Frog.prototype.hit = function(damage) {
  if(this.board.remove(this)) {
    this.board.add(new Death(this.x, this.y));
    loseGame();
  }
};

Frog.prototype.onObject = function(vObj) {
  this.vx = vObj;
};

var Car = function (blueprint, override) {
    this.merge(this.baseParameters);
    this.setup(blueprint.sprite, blueprint);
    this.merge(override);
}

Car.prototype = new Sprite();

Car.prototype.baseParameters = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    t: 0
};


Car.prototype.type = OBJECT_ENEMY;

Car.prototype.step = function (dt) {
    this.t += dt;
    this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
    this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.y > Game.height ||
        this.x < -this.w ||
        this.x > Game.width) {
        this.board.remove(this);
    }
    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) {
        collision.hit();
        this.board.remove(this);
    }

}

Car.prototype.hit = function () {
    if (this.board.remove(this)) {
        this.board.add(new Death(this.x + this.w / 2,
            this.y + this.h / 2));
        loseGame();
    }
}

var Trunk = function (blueprint, override) {
    this.merge(this.baseParameters);
    this.setup(blueprint.sprite, blueprint);
    this.merge(override);
}

Trunk.prototype = new Sprite();

Trunk.prototype.baseParameters = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    G: 0,
    H: 0,
    t: 0
};


Trunk.prototype.type = OBJECT_TRUNK;

Trunk.prototype.step = function (dt) {
    this.t += dt;
    this.vx = this.A + this.B * Math.sin(this.C * this.t + this.D);
    this.vy = this.E + this.F * Math.sin(this.G * this.t + this.H);
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.y > Game.height ||
        this.x < -this.w ||
        this.x > Game.width) {
        this.board.remove(this);
    }
    var collision = this.board.collide(this, OBJECT_PLAYER);
    if(collision){
        collision.onObject(this.vx);
    }
}

var Water = function () {
    this.setup('water', {});
    this.x = -9;
    this.y = 46;
}

Water.prototype = new Sprite();

Water.prototype.step = function (dt) {}

Water.prototype.type = OBJECT_WATER;

Water.prototype.draw = function (ctx) {}

var Home = function () {
    this.setup('home', {});
    this.x = 0;
    this.y = 0;
}

Home.prototype = new Sprite();

Home.prototype.step = function (dt) {
    var collision = this.board.collide(this, OBJECT_PLAYER);
    if(collision){
        this.board.remove(Frog);
        winGame();
    }
}

Home.prototype.type = OBJECT_HOME;

Home.prototype.draw = function (ctx) {}

var Title = function(){
    this.setup('title',{
        frame: 0
    });
    this.x = this.w / 2;
    this.y =  this.h / 2;
}

Title.prototype = new Sprite();

Title.prototype.step = function() {};

var Death = function (centerX, centerY) {
    this.setup('skull', {
        frame: 0
    });
    this.x = centerX - this.w / 2;
    this.y = centerY - this.h / 2;
    this.subFrame = 0;
};

Death.prototype = new Sprite();

Death.prototype.step = function (dt) {
        this.frame = Math.floor(this.subFrame++/ 3);
            if (this.subFrame >= 12) {
                this.board.remove(this);
            }
        }