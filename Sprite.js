function Sprite(params = {}) {
    var exemplo = {
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        h: 10,
        w: 10,
        a: 0,
        va: 0,
        vm: 0,
        props: {},
        cooldown: 0,
        escudoCD: 0,
        escudoDuracao: 0,
        color: "blue",
        imune: 0,
        atirando: 0,
        vida: 0,
        score: 0,
        comportar: undefined,
        scene: undefined
    }
    Object.assign(this, exemplo, params);
}
Sprite.prototype = new Sprite();
Sprite.prototype.constructor = Sprite;

Sprite.prototype.desenhar = function (ctx) {

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    //ctx.strokeRect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.rotate(this.a);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(-this.w / 2, -this.h / 2);
    ctx.lineTo(-this.w / 2, +this.h / 2);
    ctx.lineTo(+this.w / 2, 0);
    ctx.closePath();
    ctx.fill();
    //ctx.stroke();

    ctx.restore();
};

Sprite.prototype.desenharPC = function (ctx) {

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    //ctx.strokeRect(-this.w / 2, -this.h / 2, this.w, this.h);
    ctx.rotate(this.a);
    ctx.fillStyle = this.color;

    if (this.imune > 0)
        ctx.globalAlpha = Math.cos(this.imune * 7);
    ctx.beginPath();
    ctx.moveTo(0, -this.w / 2);
    ctx.lineTo(+this.h / 2, -this.w / 4);
    ctx.lineTo(0, +this.h / 2);
    ctx.lineTo(-this.h / 2, -this.w / 4);
    ctx.closePath();
    ctx.fill();
    if (this.escudoDuracao >= 0) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "lightblue";
        ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.restore();

    //DESENHA HUD

    if (teclas.enter && boss.vida > 0) {
        ctx.fillStyle = "green";
        ctx.fillRect(25, canvas.height - 45, 3 * this.vida, 20);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 3;
        ctx.strokeRect(20, canvas.height - 50, 310, 30);
        ctx.fillStyle = "white";
        ctx.font = "bold 20px Trebuchet";
        ctx.fillText("SCORE:", 360, canvas.height - 30, 200);
        ctx.fillText(score, 450, canvas.height - 30, 200);
    }

    if(adicionado) {
        if(boss.vida > 0) {
            ctx.fillStyle = "red";
            ctx.fillRect(canvas.width / 2 - 150, 45, boss.vida, 20);
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            ctx.strokeRect(canvas.width / 2 - 155, 40, 310, 30);
        }
    }

};

Sprite.prototype.desenharEstrelas = function (ctx) {

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.restore();
};

Sprite.prototype.moverEstrelas = function (dt) {

    this.x = this.x + this.vx * dt;
    this.y = this.y + this.vy * dt;
    if (this.y >= 880)
        this.y = 0;
}

Sprite.prototype.mover = function (dt) {
    this.a = this.a + this.va * dt;

    this.x = this.x + this.vx * dt;
    this.y = this.y + this.vy * dt;

    this.vx = this.vm * Math.cos(this.a);
    this.vy = this.vm * Math.sin(this.a);

    this.cooldown -= dt;
    this.imune -= dt;
    this.escudoDuracao -= dt;
    this.escudoCD -= dt;
}

Sprite.prototype.colidiuCom = function (alvo) {
    if (alvo.x + alvo.w / 2 < this.x - this.w / 2)
        return false;
    if (alvo.x - alvo.w / 2 > this.x + this.w / 2)
        return false;
    if (alvo.y + alvo.h / 2 < this.y - this.h / 2)
        return false;
    if (alvo.y - alvo.h / 2 > this.y + this.h / 2)
        return false;

    return true;
}
