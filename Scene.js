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

Scene.prototype.checaColisao = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        for (var j = i + 1; j < this.sprites.length; j++) {
            if (this.sprites[i].colidiuCom(this.sprites[j])) {
                if (this.sprites[i].props.tipo === "pc" && this.sprites[j].props.tipo === "npc" && this.sprites[i].imune <= 0 && this.sprites[j].imune <= 0) {
                    if (this.sprites[i].escudoDuracao >= 0) {
                        if (this.sprites[j].vida == 0) {
                            this.toRemove.push(this.sprites[j]);
                            score += this.sprites[j].props.s;
                        }
                        else {
                            this.sprites[j].vida--;
                            this.sprites[j].imune = 0.2;
                        }
                    }
                    else {
                        if (this.sprites[j].vida == 0) {
                            this.toRemove.push(this.sprites[j]);
                            score += this.sprites[j].props.s;
                        }
                        if (this.sprites[i].vida == 0) {
                            morto = true;
                            this.toRemove.push(this.sprites[i]);
                        }
                        else {
                            this.sprites[i].vida--;
                            this.sprites[j].vida--;
                            this.sprites[i].imune = 1.0;
                            this.sprites[j].imune = 1.0;
                        }
                    }
                }
                else
                    if (this.sprites[i].props.tipo === "npc" && this.sprites[j].props.tipo === "tiro") {
                        if (this.sprites[i].vida == 0) {
                            this.toRemove.push(this.sprites[i]);
                            score += this.sprites[i].props.s;
                        }
                        else
                            this.sprites[i].vida--;
                        this.toRemove.push(this.sprites[j]);
                    }
            }
        }
    }
};

Scene.prototype.inimigos = function () {
    if (!teclas.enter) {
        ctx.fillStyle = "white";
        ctx.font = "55px Trebuchet MS";        
        ctx.fillText("Press Enter to start", 30, 220, 400);
        ctx.font = "25px Trebuchet MS";        
        ctx.fillText("Move with arrows", 30, 260, 400);
        ctx.fillText("Shoot with space", 30, 290, 400);
        ctx.fillText("Shield with shift", 30, 320, 400);
        tempo = 0;
    }
    else {
        if (tempo <= 5) {
            var tO = 1 - tempo / 5;
            ctx.globalAlpha = tO;
            ctx.fillStyle = "white";
            ctx.font = "155px Trebuchet MS";
            ctx.fillText("Stage 1", 180, 220, 400);
            ctx.globalAlpha = 1;
        }
        //STAGE 1
        else if (tempo > 5 && tempo <= 65) {
            if (dtInimigos <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 10,
                    w: 25,
                    vida: 0,
                    color: "red",
                    comportar: persegue2(pc),
                    props: { tipo: "npc", s: 10 },
                    a: Math.PI / 2
                }));
                dtInimigos = 1;
            }
            if (dtInimigos2 <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 10,
                    w: 35,
                    vida: 2,
                    vm: 130 + 130 * Math.random(),
                    color: "orangered",
                    comportar: persegue3(pc),
                    props: { tipo: "npc", s: 30 },
                    a: Math.PI / 2
                }));
                dtInimigos2 = 1.2;
            }
            if (dtInimigos3 <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 15,
                    w: 30,
                    vida: 1,
                    color: "blue",
                    comportar: moveBasico(),
                    props: { tipo: "npc", remover: true, s: 20 },
                    a: Math.PI / 2
                }));
                dtInimigos3 = 0.6;
            }
        }
        
        else if (tempo > 65 && tempo <= 75) {
            var tempoAux = tempo % 65;
            var tO = 1 - tempoAux / 10;
            ctx.globalAlpha = tO;
            ctx.fillStyle = "white";
            ctx.font = "155px Trebuchet MS";
            ctx.fillText("Stage 2", 180, 220, 400);
            ctx.globalAlpha = 1;
            for (var i = 0; i < this.sprites.length; i++) {
                if (this.sprites[i].props.tipo === "npc") {
                    this.sprites[i].comportar = moveBasico();
                    this.sprites[i].va = 0;
                    this.sprites[i].vm = 100;
                    this.sprites[i].props.remover = true;
                }
            }
        }
        //STAGE 2
        else if (tempo > 75 && tempo <= 135) {
            if (dtInimigos <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 10,
                    w: 25,
                    vida: 0,
                    color: "red",
                    comportar: persegue2(pc),
                    props: { tipo: "npc", s: 10 },
                    a: Math.PI / 2
                }));
                dtInimigos = 1.4;
            }
            if (dtInimigos2 <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 10,
                    w: 35,
                    vida: 2,
                    color: "lime",
                    comportar: persegue_Spawn2(pc),
                    props: { tipo: "npc", spawn: 0, s: 50 },
                    a: Math.PI / 2
                }));
                dtInimigos2 = 2.2;
            }
            if (dtInimigos3 <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 35,
                    w: 30,
                    vida: 5,
                    color: "orange",
                    comportar: move_Spawn(pc),
                    props: { tipo: "npc", remover: true, spawn: 0, s: 100 },
                    a: Math.PI / 2
                }));
                dtInimigos3 = 3.6;
            }
        }
        else if (tempo > 135 && tempo <= 145) {
            var tempoAux = tempo % 135;
            var tO = 1 - tempoAux / 10;
            ctx.globalAlpha = tO;
            ctx.fillStyle = "white";
            ctx.font = "155px Trebuchet MS";
            ctx.fillText("Stage 3", 180, 220, 400);
            ctx.globalAlpha = 1;
            for (var i = 0; i < this.sprites.length; i++) {
                if (this.sprites[i].props.tipo === "npc") {
                    this.sprites[i].comportar = moveBasico();
                    this.sprites[i].va = 0;
                    this.sprites[i].vm = 100;
                    this.sprites[i].props.remover = true;
                }
            }
        }
        //STAGE 3
        else if (tempo > 145 && tempo <= 205) {
            if (dtInimigos <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 15,
                    w: 30,
                    vida: 1,
                    color: "blue",
                    comportar: moveBasico(),
                    props: { tipo: "npc", remover: true, s: 20 },
                    a: Math.PI / 2
                }));
                dtInimigos = 1.4;
            }
            if (dtInimigos2 <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 15,
                    w: 30,
                    vida: 1,
                    color: "blue",
                    comportar: persegue4(pc),
                    props: { tipo: "npc", s: 40 },
                    a: Math.PI / 2
                }));
                dtInimigos2 = 2.2;
            }
            if (dtInimigos3 <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 35,
                    w: 30,
                    vida: 5,
                    color: "orange",
                    comportar: move_Spawn(pc),
                    props: { tipo: "npc", remover: true, spawn: 0, s: 100 },
                    a: Math.PI / 2
                }));
                dtInimigos3 = 3.6;
            }
        }
        else if (tempo > 205 && tempo <= 215) {
            var tempoAux = tempo % 205;
            var tO = 1 - tempoAux / 10;
            ctx.globalAlpha = tO;
            ctx.fillStyle = "white";
            ctx.font = "155px Trebuchet MS";
            ctx.fillText("Stage 4", 180, 220, 400);
            ctx.globalAlpha = 1;
            for (var i = 0; i < this.sprites.length; i++) {
                if (this.sprites[i].props.tipo === "npc") {
                    this.sprites[i].comportar = moveBasico();
                    this.sprites[i].va = 0;
                    this.sprites[i].vm = 100;
                    this.sprites[i].props.remover = true;
                }
            }
        }
        //STAGE 4
        else if (tempo > 215 && tempo <= 275) {
            if (dtInimigos <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 10,
                    w: 35,
                    vida: 2,
                    vm: 130 + 180 * Math.random(),
                    color: "orangered",
                    comportar: persegue3(pc),
                    props: { tipo: "npc", s: 30 },
                    a: Math.PI / 2
                }));
                dtInimigos = 1.4;
            }
            if (dtInimigos2 <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 10,
                    w: 35,
                    vida: 2,
                    color: "lime",
                    comportar: persegue_Spawn2(pc),
                    props: { tipo: "npc", spawn: 0, s: 30 },
                    a: Math.PI / 2
                }));
                dtInimigos2 = 2.2;
            }
            if (dtInimigos3 <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 35,
                    w: 30,
                    vida: 5,
                    color: "orange",
                    comportar: move_Spawn(pc),
                    props: { tipo: "npc", remover: true, spawn: 0, s: 110 },
                    a: Math.PI / 2
                }));
                dtInimigos3 = 3.6;
            }
            if (dtInimigos4 <= 0) {
                cena1.adicionar(new Sprite({
                    x: canvas.width * Math.random(),
                    y: 0,
                    h: 15,
                    w: 30,
                    vida: 1,
                    color: "blue",
                    comportar: persegue4(pc),
                    props: { tipo: "npc", s: 40 },
                    a: Math.PI / 2
                }));
                dtInimigos4 = 2.2;
            }
        }
        else if (tempo > 275 && tempo <= 290) {
            var tempoAux = tempo % 275;
            var tO = 1 - tempoAux / 15;
            ctx.globalAlpha = tO;
            ctx.fillStyle = "white";
            ctx.font = "155px Trebuchet MS";
            ctx.fillText("Boss Battle", 5, 220, canvas.width - 5);
            ctx.globalAlpha = 1;
            for (var i = 0; i < this.sprites.length; i++) {
                if (this.sprites[i].props.tipo === "npc") {
                    this.sprites[i].comportar = moveBasico();
                    this.sprites[i].va = 0;
                    this.sprites[i].vm = 100;
                    this.sprites[i].props.remover = true;
                }
            }
        }
        //BOSS BATTLE
        else {
            if (!adicionado) {
                adicionado = true;
                cena1.adicionar(boss);
            }
            if(boss.vida > 0) {
                if (dtInimigos2 <= 0) {
                    cena1.adicionar(new Sprite({
                        x: canvas.width * Math.random(),
                        y: 0,
                        h: 10,
                        w: 35,
                        vida: 1,
                        vm: 200,
                        color: "orangered",
                        comportar: persegue3(boss),
                        props: { tipo: "npc", s: 10 },
                        a: Math.PI / 2
                    }));
                    dtInimigos2 = 1.0;
                }
                if (dtInimigos3 <= 0) {
                    cena1.adicionar(new Sprite({
                        x: canvas.width * Math.random(),
                        y: 0,
                        h: 10,
                        w: 35,
                        vida: 1,
                        vm: 580 + 220 * Math.random(),
                        color: "orangered",
                        comportar: persegue3(boss),
                        props: { tipo: "npc", s: 10 },
                        a: Math.PI / 2
                    }));
                    dtInimigos3 = 1.2;
                }
                if(tempo % 10 * 2 >= 0 && tempo % 10 * 2 < 10 & dtInimigos <= 0) {
                    cena1.adicionar(new Sprite({
                        x: boss.x,
                        y: boss.y,
                        h: 10,
                        w: 10,
                        a: boss.a,
                        vm: 100,
                        color: "lightgreen",
                        comportar: moveBasico(),
                        props: { tipo: "npc", remover: true, s: 1}
                    }));
                dtInimigos = 0.2;
                }
                dieTime = tempo;
            }
            else {
                this.toRemove.push(boss);
                
                ctx.fillStyle = "white";
                ctx.font = "bold 50px Trebuchet";
                ctx.fillText("You made it player!", 30, 200, 700)
                ctx.fillText("Feel free to continue your", 30, 250, 700)
                ctx.fillText("journey now!!!", 30, 300, 700)
                ctx.font = "bold 20px Trebuchet";                
                ctx.fillText("Oh! I also wanna", 30, 340, 700)
                ctx.fillText("thank you for your time!!", 30, 360, 700)
            
                for (var i = 0; i < this.sprites.length; i++) {
                    if (this.sprites[i].props.tipo === "npc") {
                        this.sprites[i].comportar = moveBasico();
                        this.sprites[i].va = 0;
                        this.sprites[i].vm = 100;
                        this.sprites[i].props.remover = true;
                    }
                }
            }
        }
    }
}

Scene.prototype.removeNaBorda = function () {
    for (var i = 0; i < this.sprites.length; i++) {
        var x = this.sprites[i].x;
        var y = this.sprites[i].y;
        if (this.sprites[i].props.remover && (x >= canvas.width + 5 || x <= -5 || y >= canvas.height + 5 || y <= -5))
            this.toRemove.push(this.sprites[i]);
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

Scene.prototype.limpar = function () {
    this.ctx.fillStyle = "rgb(0, 14, 36)";
    this.ctx.fillRect(0, 0, this.w, this.h);
}

Scene.prototype.passo = function (dt,ctx) {
    this.limpar();
    this.comportar();
    if(morto) {
        ctx.fillStyle = "white";
        ctx.font = "bold 50px Trebuchet";
        ctx.fillText("GAME OVER!", 30, 200, 700)
        ctx.fillText("If you wanna play ", 30, 280, 700)
        ctx.fillText("again press F5", 30, 330, 700)
    }
    else {
        this.inimigos();
    }
    this.moverEstrelas(dt);
    this.mover(dt);
    this.desenharPC();
    this.desenharEstrelas();
    this.desenhar();
    this.checaColisao();
    this.removeSprites();
    this.removeNaBorda();
}
