import {Injectable} from '@angular/core';
import {Configuration} from "../configuration/configuration";
import {Charge} from "../models/charge";
import {Dipole} from "../models/dipole";


@Injectable({
    providedIn: 'root'
})
export class DrawerService{
    canvas: any;
    ctx: any;
    hareImg: HTMLImageElement = <HTMLImageElement><unknown>null;
    wolfImg: HTMLImageElement = <HTMLImageElement><unknown>null;
    curTime = 0;
    wolfTrajectory: Array<Array<number>> = [];

    init() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.hareImg = new Image();
        this.hareImg.src = "assets/images/hare.png";

        this.wolfImg = new Image();
        this.wolfImg.src = "assets/images/wolf.png";
    }


    drawHare() {
        // this.ctx.drawImage(this.hareImg,
        //     this.hare.curX - Configuration.radius, this.hare.curY - Configuration.radius,
        //     Configuration.radius * 2, Configuration.radius * 2);
    }

    drawArrow(x: number, y: number, arrowDelta: number, direction: string): void {
        this.ctx.moveTo(x, y);
        if (direction === "right")
            this.ctx.lineTo(x - arrowDelta, y - arrowDelta);
        else
            this.ctx.lineTo(x - arrowDelta, y + arrowDelta);

        this.ctx.moveTo(x, y);
        if (direction === "right")
            this.ctx.lineTo(x - arrowDelta, y + arrowDelta);
        else
            this.ctx.lineTo(x + arrowDelta, y + arrowDelta);
    }

    drawTextWithDeltaX(text: string, x: number, y: number, delta: number = 4): void {
        //смещение по оси х для надписей на оси y
        this.ctx.fillText(text, x + delta, y);
        this.drawPoint(x, y);
    }

    drawTextWithDeltaY(text: string, x: number, y: number, delta: number = 4): void {
        //смещение по оси y для надписей на оси x
        this.ctx.fillText(text, x, y - delta);
        this.drawPoint(x, y);
    }

    drawPoint(x: number, y: number, delta: number = 2): void {
        this.ctx.rect(x - delta / 2, y - delta / 2, delta, delta);
    }

    drawAxes(radius: number, delta: number): void {
        let arrowDelta: number = 4;
        this.ctx.beginPath();

        this.ctx.fillStyle = "black";
        this.drawPoint(Configuration.centerX, Configuration.centerY, 4);

        this.ctx.moveTo(Configuration.centerX - radius - delta, Configuration.centerY);
        this.ctx.lineTo(Configuration.centerX + 2 * radius + delta, Configuration.centerY); //OX

        this.drawArrow(Configuration.centerX + 2 * radius + delta, Configuration.centerY, arrowDelta, "right");
        this.ctx.fillText("X", Configuration.centerX + 2 * radius + delta, Configuration.centerY);

        this.ctx.moveTo(Configuration.centerX, Configuration.centerY + radius + delta);
        this.ctx.lineTo(Configuration.centerX, Configuration.centerY - radius - delta); //OY
        this.drawArrow(Configuration.centerX, Configuration.centerY - radius - delta, arrowDelta, "up");
        this.ctx.fillText("Y", Configuration.centerX, Configuration.centerY - radius - delta);

        //OX
        this.drawTextWithDeltaY("200", Configuration.centerX + radius / 2, Configuration.centerY);
        this.drawTextWithDeltaY("400", Configuration.centerX + radius, Configuration.centerY);
        this.drawTextWithDeltaY("600", Configuration.centerX + 1.5 * radius, Configuration.centerY);
        this.drawTextWithDeltaY("800", Configuration.centerX + 2 * radius, Configuration.centerY);

        //OY
        this.drawTextWithDeltaX("200", Configuration.centerX, Configuration.centerY - radius / 2);
        this.drawTextWithDeltaX("400", Configuration.centerX, Configuration.centerY - radius);

        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawCharge(charge: Charge) {
        this.ctx.beginPath();
        this.ctx.arc(Configuration.centerX + charge.x, Configuration.centerY - charge.y,
            charge.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = charge.q > 0 ? "blue" : "red";
        this.ctx.fill();
        this.ctx.closePath();
    }

    drawLine(x1: number, y1: number, x2: number, y2: number) {
        // points in math coordinate system
        this.ctx.beginPath();
        this.ctx.moveTo(Configuration.centerX + x1, Configuration.centerY - y1);
        this.ctx.lineTo(Configuration.centerX + x2, Configuration.centerY - y2);
        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawCurve(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        // points in math coordinate system
        this.ctx.beginPath();
        this.ctx.moveTo(Configuration.centerX + x1, Configuration.centerY - y1);

        let dy = y2 - y1;

        this.ctx.quadraticCurveTo(Configuration.centerX + x2, Configuration.centerY - (y2 + dy),
            Configuration.centerX + x3, Configuration.centerY - y3);

        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawLinesOfForce(dipole: Dipole) {
        let dy = 25;
        let y0 = dipole.charge1.y;
        let x1 = dipole.charge1.x;
        let x2 = dipole.charge2.x;
        let r = dipole.charge1.radius;

        this.drawLine(x1 + r, y0, x2 - r, y0);
        // this.ctx.beginPath();
        // this.ctx.moveTo(Configuration.centerX + x1, Configuration.centerY - y0 + 25);
        //
        // this.ctx.lineTo(Configuration.centerX + x2, Configuration.centerY - y0 + 25);
        //
        // this.ctx.strokeStyle = "black";
        // this.ctx.stroke();
        // this.ctx.closePath();

        //up
        for (let y = y0 + r; y <= 400; y+= dy) {
            //middle
            this.drawCurve(x1, y0, (x1 + x2) / 2, y, x2, y0);
            let arrowDelta: number = 4;

            this.ctx.beginPath();
            this.drawArrow(Configuration.centerX + (x1 + x2) / 2, Configuration.centerY - y, arrowDelta, "right");
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath();
            // this.drawTextWithDeltaY(y + "", Configuration.centerX + (x1 + x2) / 2, Configuration.centerY - y);
            // this.drawTextWithDeltaY(2 * y + "", Configuration.centerX + (x1 + x2) / 2, Configuration.centerY - y * 2);
            // break;
            // this.ctx.beginPath();
            // this.ctx.moveTo(Configuration.centerX + x1, Configuration.centerY - y0);
            //
            // this.ctx.quadraticCurveTo(Configuration.centerX + (x1 + x2) / 2, Configuration.centerY - y -100,
            //     Configuration.centerX + x2, Configuration.centerY - y0);
            //
            // this.ctx.strokeStyle = "black";
            // this.ctx.stroke();
            // this.ctx.closePath();

            //left

            // this.ctx.beginPath();
            // this.ctx.moveTo(Configuration.centerX + x1 - 200, Configuration.centerY - y0);
            //
            // this.ctx.quadraticCurveTo(Configuration.centerX + x1 - 100, Configuration.centerY - y -100,
            //     Configuration.centerX + x1, Configuration.centerY - y0);
            //
            // this.ctx.strokeStyle = "black";
            // this.ctx.stroke();
            // this.ctx.closePath();
        }
        //down

        for (let y = y0 - r; y >= 0; y-= dy) {
            //middle
            this.drawCurve(x1, y0, (x1 + x2) / 2, y, x2, y0);
            this.ctx.beginPath();
            this.drawArrow(Configuration.centerX + (x1 + x2) / 2, Configuration.centerY - y, 4, "right");
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath();
        }
        return;
        // y0 -= 50;
        // for (let y = y0; y >=  0; y -= dy) {
        //     this.ctx.beginPath();
        //     this.ctx.moveTo(Configuration.centerX + x1, Configuration.centerY - y0);
        //
        //     // this.ctx.lineTo(Configuration.centerX + x2, Configuration.centerY - y);
        //     // this.ctx.arcTo(Configuration.centerX + x1, Configuration.centerY - y,
        //     //     Configuration.centerX + x2, Configuration.centerY - y, 90);
        //     this.ctx.quadraticCurveTo(Configuration.centerX + (x1 + x2) / 2, Configuration.centerY - y + 100,
        //         Configuration.centerX + x2, Configuration.centerY - y0);
        //
        //     this.ctx.strokeStyle = "black";
        //     this.ctx.stroke();
        //     this.ctx.closePath();
        // }
    }

    drawDipole(dipole: Dipole) {
        this.drawLinesOfForce(dipole);

        this.drawCharge(dipole.charge1);
        this.drawCharge(dipole.charge2);
    }

    draw(r: number) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawAxes(400, 25);

        let dipole = new Dipole(1, r, 400, 200);
        // this.drawCharge(new Charge(1, 200, 200));
        this.drawDipole(dipole);
        // this.drawHare();
        // this.drawTrajectory();
        // this.drawWolf();
    }
}
