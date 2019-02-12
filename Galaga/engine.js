var SpriteSheet = new function () {
    this.map = {};

    this.load = function (spriteData, callback) {
        this.map = spriteData;
        this.image = new Image();
        this.image.onload = callback;
        this.image.src = 'Sprites/sprites.png';
    };

    this.draw = function (ctx, sprite, x, y, frame) {
        var s = this.map[sprite];
        if (!frame) frame = 0;
        ctx.drawImage(this.image, s.sx + frame * s.w, s.sy, s.w, s.h, x, y, s.w, s.h);

    };

    this.render = function (ctx, sprite, x, y, frame) {
        var s = this.map[sprite];
        if (!frame) frame = 0;
        ctx.clearRect(x, y, s.w, s.h);
        ctx.fillStyle = "#FFFF00";
        ctx.fillRect(x, y, s.w, s.h);
        ctx.fillStyle = "rgba(0,0,128,0.5)";
        ctx.fillRect(x, y, s.w, s.h);
        ctx.drawImage(this.image, s.sx + frame * s.w, s.sy, s.w, s.h, x, y, s.w, s.h);
    }
}


