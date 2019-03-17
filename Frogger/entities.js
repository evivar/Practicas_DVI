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
        sy: 128,
        w: 46,
        h: 35,
        frames: 4
    },
    medium_trunk: {
        sx: 9,
        sy: 122,
        w: 191,
        h: 41,
        frames: 1
    },
    large_trunk: {
        sx: 9,
        sy: 171,
        w: 248,
        h: 191,
        frames: 1
    },
    small_trunk: {
        sx: 270,
        sy: 172,
        w: 131,
        h: 39,
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
        w: 49,
        h: 43,
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
    }
}

var OBJECT_PLAYER = 1,
    OBJECT_ENEMY = 2,
    OBJECT_WATER = 4,
    OBJECT_TRUNK = 8;

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
        x: 485,
        y: 191,
        sprite: 'medium_trunk',
        A: 100
    },
    large: {
        x: -90,
        y: 143, // Para ir mas arriba: 95 y 47
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
    this.y = Game.height - this.h;
}

BackgroundGame.prototype = new Sprite();

BackgroundGame.prototype.step = function (dt) {}

var Frog = function () {
    this.setup('frog', {});
    this.x = Game.width / 2 - this.w / 2;
    this.y = Game.height - this.h;
    this.dx = this.x;
    this.dy = this.y;
    this.trunked = false;
    this.keyPressed = false;
}

Frog.prototype = new Sprite();

Frog.prototype.type = OBJECT_PLAYER;

Frog.prototype.step = function (dt) {
    if ((this.dx == this.x) && (this.dy == this.y) && (!this.keyPressed)) {
        if (Game.keys['left']) {
            console.log("L");
            this.vx = -450;
            this.dx = this.x - 40;
            this.mov = 'left';
            this.keyPressed = true;
        } else if (Game.keys['right']) {
            console.log("R");
            this.vx = 450;
            this.dx = this.x + 40;
            this.mov = 'right';
            this.keyPressed = true;
        } else if (Game.keys['up']) {
            console.log("U");
            this.vy = -450;
            this.dy = this.y - 48;
            this.mov = 'up';
            this.keyPressed = true;
        } else if (Game.keys['down']) {
            console.log("D");
            this.vy = 450;
            this.dy = this.y + 48;
            this.mov = 'down';
            this.keyPressed = true;
        } else if (this.trunked == false) {
            this.vx = 0;
            this.vy = 0;
        }
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if ((this.mov == 'up') && (this.y < this.dy)) {
        this.y = this.dy;
        this.keyPressed = false;
        this.vy = 0;
    }
    if ((this.mov == 'down') && (this.y > this.dy)) {
        this.y = this.dy;
        this.keyPressed = false;
        this.vy = 0;
    }
    if ((this.mov == 'left') && (this.x < this.dx)) {
        this.x = this.dx;
        this.keyPressed = false;
        this.vx = 0;
    }
    if ((this.mov == 'right') && (this.x > this.dx)) {
        this.x = this.dx;
        this.keyPressed = false;
        this.vx = 0;
    }
    if (this.x < 0) {
        this.x = 0;
    } else if (this.x > Game.width - this.w) {
        this.x = Game.width - this.w
    }
    if (this.y < 0) {
        this.y = 0;
    } else if (this.y > Game.height - this.h) {
        this.y = Game.height - this.h
    }
    var collision = this.board.collide(this, OBJECT_ENEMY);
    if (collision) {
        collision.hit();
        this.board.remove(this);
    }
    var trunkCollision = this.board.collide(this, OBJECT_TRUNK);
    if (trunkCollision) {
        this.onTrunk(trunkCollision.vx);
    }
}

Frog.prototype.onTrunk = function (vt) {
    this.vx = vt;
}


Frog.prototype.hit = function () {
    if (this.board.remove(this)) {
        loseGame();
    }
}

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
}

var Water = function () {

}