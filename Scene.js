function Scene(params) {
    var exemplo = {
        sprites: [],
        toRemove: [],
        ctx: null,
        w: 300,
        h: 300,
        t: 0,
    }
    Object.assign(this, exemplo, params);
}

Scene.prototype = new Scene();
Scene.prototype.constructor = Scene;

Scene.prototype.adicionar = function (sprite) {
    this.sprites.push(sprite);
    sprite.scene = this;
};

Scene.prototype.desenhar = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].props.tipo != "star" && this.sprites[i].props.tipo != "pc")
            this.sprites[i].desenhar(this.ctx);
    }
};

Scene.prototype.desenharEstrelas = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].props.tipo === "star")
            this.sprites[i].desenharEstrelas(this.ctx);
    }
};

Scene.prototype.desenharPC = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].props.tipo === "pc")
            this.sprites[i].desenharPC(this.ctx, this.sprites[i].vy);
    }
};

Scene.prototype.mover = function (dt) {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].props.tipo != "star")
            this.sprites[i].mover(dt);
    }
};

Scene.prototype.moverEstrelas = function (dt) {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].props.tipo === "star")
            this.sprites[i].moverEstrelas(dt);
    }
};

Scene.prototype.comportar = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        if (this.sprites[i].comportar) {
            this.sprites[i].comportar();
        }
    }
};


Scene.prototype.limpar = function () {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.w, this.h);
}

Scene.prototype.checaColisao = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        for (var j = i + 1; j < this.sprites.length; j++) {
            if (this.sprites[i].colidiuCom(this.sprites[j])) {
                if (this.sprites[i].props.tipo === "pc" && this.sprites[j].props.tipo === "npc" && this.sprites[i].imune <= 0 && this.sprites[j].imune <= 0) {
                    if (this.sprites[j].vida == 0) {
                        this.toRemove.push(this.sprites[j]);
                        this.sprites[i].score = this.sprites[i].score + 10;
                    }
                    if (this.sprites[i].vida == 0)
                        this.toRemove.push(this.sprites[i]);
                    else {
                        this.sprites[i].vida--;
                        this.sprites[j].vida--;
                        this.sprites[i].imune = 1.5;
                        this.sprites[j].imune = 1.2;
                    }
                }
                else
                    if (this.sprites[i].props.tipo === "npc" && this.sprites[j].props.tipo === "tiro") {
                        //for (var k = 0; k < this.sprites.length; k++)
                            //if (this.sprites[k].props.tipo === "pc")
                            //      this.sprites[k].score = this.sprites[k].score + 10;
                            score += 10;
                        this.toRemove.push(this.sprites[i]);
                        this.toRemove.push(this.sprites[j]);
                    }
            }
        }
    }
};

Scene.prototype.inimigos = function () {
    if(tempo <= 5)
    {
        var tO = 1 - tempo/5;
        ctx.globalAlpha = tO; 
        ctx.fillStyle = "white";
        ctx.font = "155px Arial";
        ctx.fillText("Stage 1", 180, 220, 400);
        ctx.globalAlpha = 1;
    }
    else if (dtInimigos <= 0 && tempo > 5) {
        cena1.adicionar(new Sprite({
            x: canvas.width * Math.random(),
            y: 0,
            h: 20,
            a: 3.14 / 2,
            va: 5 * Math.random(),
            vm: 140 * Math.random(),
            color: "red",
            comportar: persegue2(pc),
            props: { tipo: "npc" }
        }));
        dtInimigos = 0.1;
    }
}

Scene.prototype.removeSprites = function () {
    for (var i = 0; i < this.toRemove.length; i++) {
        var idx = this.sprites.indexOf(this.toRemove[i]);
        if (idx >= 0) {
            this.sprites.splice(idx, 1);
        }
    }
    this.toRemove = [];
};

Scene.prototype.passo = function (dt) {
    this.limpar();
    this.comportar();
    this.inimigos();
    this.moverEstrelas(dt);
    this.mover(dt);
    this.desenharPC();
    this.desenharEstrelas();
    this.desenhar();
    this.checaColisao();
    this.removeSprites();
}
