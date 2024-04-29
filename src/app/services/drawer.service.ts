import {Injectable} from '@angular/core';
import {Configuration} from "../configuration/configuration";
import {Charge} from "../models/charge";
import {Dipole} from "../models/dipole";


@Injectable({
    providedIn: 'root'
})
export class DrawerService {
    loaded = 0;  // кол-во загруженных картинок, надо, чтобы их было две

    canvas: any;
    ctx: any;
    defaultArrowDelta = 4;

    electricFieldStrength = 1;

    positiveChargeImage: HTMLImageElement = <HTMLImageElement><unknown>null;
    negativeChargeImage: HTMLImageElement = <HTMLImageElement><unknown>null;

    dipole: any;

    init() {
        this.canvas = document.getElementById("canvas");

        this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
            //TODO
            let x = Configuration.centerX + event.x;
            let y = Configuration.centerY - event.y;
            console.log(x, y);

            let k = 9 * 1e9;
            let q = 1;
            let x0 = 400;
            let y0 = 200;
            let x1 = 600;
            let y1 = 200;
            let r = ((x - x0) ** 2 + (y - y0) ** 2) ** 0.5;
            let r2 = ((x - x1) ** 2 + (y - y1) ** 2) ** 0.5;
            this.electricFieldStrength = k * q / r - k * q / r2;
        });

        this.ctx = this.canvas.getContext("2d");

        this.positiveChargeImage = new Image();
        this.positiveChargeImage.src = "assets/images/cool.png";

        this.negativeChargeImage = new Image();
        this.negativeChargeImage.src = "assets/images/angry.png";

        this.positiveChargeImage.onload = this.negativeChargeImage.onload = () => {
            this.loaded++;
        };
    }

    start() {
        Configuration.firstPositive = !Configuration.firstPositive;
    }

    drawArrow(x: number, y: number, arrowDelta: number, direction: string): void {
        this.ctx.moveTo(x, y);
        if (direction === "right")
            this.ctx.lineTo(x - arrowDelta, y - arrowDelta);
        else if (direction == "left")
            this.ctx.lineTo(x + arrowDelta, y - arrowDelta);
        else
            this.ctx.lineTo(x - arrowDelta, y + arrowDelta);

        this.ctx.moveTo(x, y);
        if (direction === "right")
            this.ctx.lineTo(x - arrowDelta, y + arrowDelta);
        else if (direction == "left")
            this.ctx.lineTo(x + arrowDelta, y + arrowDelta);
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
        let arrowDelta: number = this.defaultArrowDelta;
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
        if (Configuration.useImages) {
            this.ctx.drawImage(charge.q > 0 ? this.positiveChargeImage : this.negativeChargeImage,
                Configuration.centerX + charge.x - charge.radius,
                Configuration.centerY - charge.y - charge.radius,
                charge.radius * 2, charge.radius * 2);
        } else {
            this.ctx.beginPath();
            this.ctx.arc(Configuration.centerX + charge.x, Configuration.centerY - charge.y,
                charge.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = charge.q > 0 ? "blue" : "red";
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.fillStyle = "black";
        }
    }

    drawLine(x1: number, y1: number, x2: number, y2: number) {
        // points in math coordinate system
        this.ctx.moveTo(Configuration.centerX + x1, Configuration.centerY - y1);
        this.ctx.lineTo(Configuration.centerX + x2, Configuration.centerY - y2);
    }

    drawCurve(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        // points in math coordinate system

        this.ctx.moveTo(Configuration.centerX + x1, Configuration.centerY - y1);

        let dy = y2 - y1;

        this.ctx.quadraticCurveTo(Configuration.centerX + x2, Configuration.centerY - (y2 + dy),
            Configuration.centerX + x3, Configuration.centerY - y3);
    }

    drawLinesOfForce(dipole: Dipole) {
        let dy = 50;
        let y0 = dipole.charge1.y;
        let x1 = dipole.charge1.x;
        let x2 = dipole.charge2.x;
        let r = dipole.charge1.radius;

        let k = (x2 - x1);


        this.ctx.beginPath();

        this.drawLine(x1, y0, x2, y0);
        this.drawArrow(Configuration.centerX + (x1 + x2) / 2, Configuration.centerY - y0, this.defaultArrowDelta,
            Configuration.firstPositive ? "right" : "left");

        //up
        for (let y = y0 + r; y <= 400; y += dy) {
            //middle
            this.drawCurve(x1, y0, (x1 + x2) / 2, y, x2, y0);
            this.drawArrow(Configuration.centerX + (x1 + x2) / 2, Configuration.centerY - y, this.defaultArrowDelta,
                Configuration.firstPositive ? "right" : "left");

            //left
            this.drawCurve(x1, y0, x1 - k, y, x1 - 2 * k, y0);
            // this.drawCurve(x1, y0, (x1 * 2 - k) / 2, (y + y) / 2, x1 - k, y);
            // this.drawArrow(Configuration.centerX + (x1 * 2 - k) / 2, Configuration.centerY - (y0 + y) / 2, this.defaultArrowDelta, "right");
            this.drawArrow(Configuration.centerX + (x1 - k), Configuration.centerY - y, this.defaultArrowDelta,
                !Configuration.firstPositive ? "right" : "left");

            //right
            this.drawCurve(x2, y0, x2 + k, y, x2 + k * 2, y0);
            this.drawArrow(Configuration.centerX + x2 + k, Configuration.centerY - y, this.defaultArrowDelta,
                !Configuration.firstPositive ? "right" : "left");
        }
        //down

        for (let y = y0 - r; y >= 0; y -= dy) {
            //middle
            this.drawCurve(x1, y0, (x1 + x2) / 2, y, x2, y0);
            this.drawArrow(Configuration.centerX + (x1 + x2) / 2, Configuration.centerY - y, this.defaultArrowDelta,
                Configuration.firstPositive ? "right" : "left");

            //left
            this.drawCurve(x1, y0, x1 - k, y, x1 - 2 * k, y0);
            this.drawArrow(Configuration.centerX + (x1 - k), Configuration.centerY - y, this.defaultArrowDelta,
                !Configuration.firstPositive ? "right" : "left");

            //right
            this.drawCurve(x2, y0, x2 + k, y, x2 + k * 2, y0);
            this.drawArrow(Configuration.centerX + x2 + k, Configuration.centerY - y, this.defaultArrowDelta,
                !Configuration.firstPositive ? "right" : "left");
        }

        this.ctx.strokeStyle = "black";
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawEquipotentialSurfaces(dipole: Dipole) {
        //TODO
        let dx = 20;

        for (let r = 50; r < 200; r += 50) {
            this.ctx.beginPath();

            this.ctx.arc(Configuration.centerX + dipole.charge1.x - dx,
                Configuration.centerY - dipole.charge1.y,
                r, 0, Math.PI * 2);
            dx += 20;

            this.ctx.strokeStyle = "red";
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.strokeStyle = "black";
        }

        dx = 20;

        for (let r = 50; r < 200; r += 50) {
            this.ctx.beginPath();

            this.ctx.arc(Configuration.centerX + dipole.charge2.x + dx,
                Configuration.centerY - dipole.charge2.y,
                r, 0, Math.PI * 2);
            dx += 20;

            this.ctx.strokeStyle = "red";
            this.ctx.stroke();
            this.ctx.closePath();
            this.ctx.strokeStyle = "black";
        }
    }

    drawDipole(dipole: Dipole) {
        this.drawLinesOfForce(dipole);
        // this.drawEquipotentialSurfaces(dipole);

        this.drawCharge(dipole.charge1);
        this.drawCharge(dipole.charge2);
    }

    draw(r: number) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawAxes(400, 25);

        this.dipole =  new Dipole(1, r, 400, 200);

        if (!Configuration.firstPositive) {
            this.dipole.swapCharges();
        }

        if (!Configuration.useImages || this.loaded == 2) {
            this.drawDipole(this.dipole);
        }
    }
}
