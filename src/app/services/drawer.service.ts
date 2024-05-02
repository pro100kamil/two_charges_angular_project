import {Injectable} from '@angular/core';
import {Configuration} from "../configuration/configuration";
import {Charge} from "../models/charge";
import {Dipole} from "../models/dipole";
import {CalculatorService} from "./calculator.service";


@Injectable({
    providedIn: 'root'
})
export class DrawerService {
    loaded = 0;  // кол-во загруженных картинок, надо, чтобы их было две

    canvas: any;
    ctx: any;
    defaultArrowDelta = 4;

    positiveChargeImage: HTMLImageElement = <HTMLImageElement><unknown>null;
    negativeChargeImage: HTMLImageElement = <HTMLImageElement><unknown>null;

    leftL = 50;
    leftC = 50;
    leftR = 250;

    middleL = 250;
    middleC = 250;
    middleR = 550;

    middleL1 = 250;
    middleC1 = 250;
    middleR1 = 400;

    middleL2 = 400;
    middleC2 = 400;
    middleR2 = 550;

    rightL = 550;
    rightC = 550;
    rightR = 750;

    animationLineLength = 20;

    reDrawTimer: any;

    constructor(public calculator: CalculatorService) {
    }

    init() {
        this.canvas = document.getElementById("canvas");

        this.ctx = this.canvas.getContext("2d");

        this.positiveChargeImage = new Image();
        this.positiveChargeImage.src = "assets/images/sigma.png";

        this.negativeChargeImage = new Image();
        this.negativeChargeImage.src = "assets/images/fearful.png";

        this.positiveChargeImage.onload = this.negativeChargeImage.onload = () => {
            this.loaded++;
        };

        this.reDrawTimer = null;
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
        // point in computer coordinate system!
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

    oldestDrawLinesOfForce(dipole: Dipole) {
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


    oldDrawLinesOfForce(dipole: Dipole) {
        let q1 = dipole.charge1.q;
        let q2 = dipole.charge2.q;
        let y0 = dipole.charge1.y;
        let x1 = dipole.charge1.x;
        let x2 = dipole.charge2.x;

        let k = (x2 - x1);

        // this.ctx.beginPath();
        let dx = 20;
        let q = Math.abs(q1) / 200;
        let dy = 100 - q * 80;
        // let dy = 50;
        let count = 700;
        let ys = [];
        for (let y = 50; y <= 350; y += dy) ys.push(y);
        // ys = [50, 100, 150, 200, 250, 300, 350];
        for (let y of ys) {
            let y_ = y;
            // 250 550
            for (let x of [50]) {
                for (let i = 0; i < count && x < 400; i++) {
                    let r1x = x - x1;
                    let r1y = y - y0;
                    let r1 = this.calculator.calcDistance(x1, y0, x, y);

                    let r2x = x - x2;
                    let r2y = y - y0;
                    let r2 = this.calculator.calcDistance(x2, y0, x, y);

                    let e1 = this.calculator.getElectricFieldStrengthAtPointOneCharge(
                        dipole.charge1.q, x1, y0, x, y);
                    let e1x = e1 * r1x / r1;
                    let e1y = e1 * r1y / r1;
                    let e1_ = (e1x ** 2 + e1y ** 2) ** 0.5;

                    let e2 = this.calculator.getElectricFieldStrengthAtPointOneCharge(
                        dipole.charge2.q, x2, y0, x, y);
                    let e2x = e2 * r2x / r2;
                    let e2y = e2 * r2y / r2;
                    let e2_ = (e2x ** 2 + e2y ** 2) ** 0.5;

                    let ex = e1x + e2x;
                    let ey = e1y + e2y;
                    let e = this.calculator.getElectricFieldStrengthAtPoint(
                        dipole.charge1.q, x1, y0,
                        dipole.charge2.q, x2, y0, x, y);
                    let step = 1;


                    ex = ex / e * step;
                    ey = ey / e * step;

                    // if (y_ == 200) {
                    //     ex = 1;
                    //     ey = 0;
                    // }


                    if (Math.abs(ex) > 100 || Math.abs(ey) > 100) {
                        ex = 1;
                        e1 = 1;
                    }

                    if (ex < 0) {
                        ex *= -1;
                        ey *= -1;
                    }

                    this.ctx.beginPath();
                    if (x + ex >= 400) {
                        this.drawLine(x, y, 400, y + ey);
                        // this.drawArrow(Configuration.centerX + 400, Configuration.centerY - y, this.defaultArrowDelta,
                        //     Configuration.firstPositive ? "right" : "left");
                    } else {
                        this.drawLine(x, y, x + ex, y + ey);
                    }
                    this.ctx.stroke();
                    this.ctx.fill();
                    this.ctx.closePath();
                    x = x + ex;
                    y = y + ey;

                }
            }
        }
        for (let y of ys) {
            let y_ = y;
            // 250 550
            for (let x of [750]) {
                for (let i = 0; i < count && x >= 400; i++) {
                    let r1x = x - x1;
                    let r1y = y - y0;
                    let r1 = this.calculator.calcDistance(x1, y0, x, y);

                    let r2x = x - x2;
                    let r2y = y - y0;
                    let r2 = this.calculator.calcDistance(x2, y0, x, y);

                    let e1 = this.calculator.getElectricFieldStrengthAtPointOneCharge(
                        dipole.charge1.q, x1, y0, x, y);
                    let e1x = e1 * r1x / r1;
                    let e1y = e1 * r1y / r1;
                    let e1_ = (e1x ** 2 + e1y ** 2) ** 0.5;

                    let e2 = this.calculator.getElectricFieldStrengthAtPointOneCharge(
                        dipole.charge2.q, x2, y0, x, y);
                    let e2x = e2 * r2x / r2;
                    let e2y = e2 * r2y / r2;
                    let e2_ = (e2x ** 2 + e2y ** 2) ** 0.5;

                    let ex = e1x + e2x;
                    let ey = e1y + e2y;
                    let e = this.calculator.getElectricFieldStrengthAtPoint(
                        dipole.charge1.q, x1, y0,
                        dipole.charge2.q, x2, y0, x, y);
                    let step = 1;


                    ex = ex / e * step;
                    ey = ey / e * step;

                    if (y_ == 200) {
                        ex = 1;
                        ey = 0;
                    }


                    if (Math.abs(ex) > 100 || Math.abs(ey) > 100) {
                        ex = 1;
                        e1 = 1;
                    }

                    if (ex > 0) {
                        ex *= -1;
                        ey *= -1;
                    }

                    this.ctx.beginPath();
                    if (x + ex < 400) this.drawLine(x, y, 400, y + ey);
                    else this.drawLine(x, y, x + ex, y + ey);
                    this.ctx.stroke();
                    this.ctx.fill();
                    this.ctx.closePath();
                    x = x + ex;
                    y = y + ey;

                }
            }
        }

        console.log('end');

    }

    drawLinesOfForce(dipole: Dipole) {
        let lines = this.calculator.getLinesOfForce(dipole);
        for (let line of lines) {

            let n = line.length;
            for (let i = 0; i + 1 < n; i++) {
                let x1 = line[i][0];
                let y1 = line[i][1];
                let x2 = line[i + 1][0];
                let y2 = line[i + 1][1];
                this.ctx.beginPath();
                this.drawLine(x1, y1, x2, y2);
                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
    }

    drawAnimLinesOfForce(dipole: Dipole) {
        let lines = this.calculator.getLinesOfForce(dipole);

        let q1 = dipole.charge1.q;
        let q2 = dipole.charge2.q;

        for (let line of lines) {

            let n = line.length;
            for (let i = 0; i + 1 < n; i++) {
                let x1 = line[i][0];
                let y1 = line[i][1];
                let x2 = line[i + 1][0];
                let y2 = line[i + 1][1];
                this.ctx.beginPath();
                if (q1 == q2) {
                    if (this.leftC <= x1 && x1 <= this.leftC + this.animationLineLength ||
                        this.middleC1 <= x1 && x1 <= this.middleC1 + this.animationLineLength ||
                        this.middleC2 <= x1 && x1 <= this.middleC2 + this.animationLineLength ||
                        this.rightC <= x1 && x1 <= this.rightC + this.animationLineLength) {

                        this.ctx.strokeStyle = 'red';
                        this.ctx.lineWidth = 5;
                    }
                } else {
                    if (this.leftC <= x1 && x1 <= this.leftC + this.animationLineLength ||
                        this.middleC <= x1 && x1 <= this.middleC + this.animationLineLength ||
                        this.rightC <= x1 && x1 <= this.rightC + this.animationLineLength) {

                        this.ctx.strokeStyle = 'red';
                        this.ctx.lineWidth = 5;
                    }
                }
                this.drawLine(x1, y1, x2, y2);

                this.ctx.stroke();
                this.ctx.fill();
                this.ctx.closePath();
                this.ctx.strokeStyle = 'black';
                this.ctx.lineWidth = 1;
            }
        }
        if (dipole.charge1.q < 0) {
            if (this.leftC >= this.leftR) {
                this.leftC = this.leftL;
            } else {
                this.leftC += this.animationLineLength / 2;
            }
        } else {
            if (this.leftC <= this.leftL) {
                this.leftC = this.leftR;
            } else {
                this.leftC -= this.animationLineLength / 2;
            }
        }
        if (dipole.charge1.q < 0) {
            if (q1 == q2) {
                if (this.middleC1 <= this.middleL1) {
                    this.middleC1 = this.middleR1;
                } else {
                    this.middleC1 -= this.animationLineLength / 2;
                }
                if (this.middleC2 >= this.middleR2) {
                    this.middleC2 = this.middleL2;
                } else {
                    this.middleC2 += this.animationLineLength / 2;
                }
            } else {
                if (this.middleC <= this.middleL) {
                    this.middleC = this.middleR;
                } else {
                    this.middleC -= this.animationLineLength / 2;
                }
            }
        } else {
            if (q1 == q2) {
                if (this.middleC1 >= this.middleR1) {
                    this.middleC1 = this.middleL1;
                } else {
                    this.middleC1 += this.animationLineLength / 2;
                }
                if (this.middleC2 <= this.middleL2) {
                    this.middleC2 = this.middleR2;
                } else {
                    this.middleC2 -= this.animationLineLength / 2;
                }
            } else {
                if (this.middleC >= this.middleR) {
                    this.middleC = this.middleL;
                } else {
                    this.middleC += this.animationLineLength / 2;
                }
            }
        }

        if (dipole.charge2.q < 0) {
            if (this.rightC <= this.rightL) {
                this.rightC = this.rightR;
            } else {
                this.rightC -= this.animationLineLength / 2;
            }
        } else {
            if (this.rightC >= this.rightR) {
                this.rightC = this.rightL;
            } else {
                this.rightC += this.animationLineLength / 2;
            }
        }
    }

    newDrawEquipotentialSurfaces(dipole: Dipole) {
        let q1 = dipole.charge1.q / Math.abs(dipole.charge1.q) / 1e6;  // потому что изначально задаётся в микрокулонах
        let x1 = dipole.charge1.x;
        let y1 = dipole.charge1.y;

        let q2 = dipole.charge2.q / Math.abs(dipole.charge2.q) / 1e6;  // потому что изначально задаётся в микрокулонах
        let x2 = dipole.charge2.x;
        let y2 = dipole.charge2.y;

        let potentialMap = new Map();
        //potentialMap[potential] = [(x1, y1), (x2, y2), ...]

        let potentials = dipole.charge1.q != dipole.charge2.q ? [40, 50, 70, 90] : [90, 110, 130, 150];

        for (let potential of potentials) {
            potentialMap.set(potential, []);
            potentialMap.set(-potential, []);
        }

        for (let y = 0; y <= 400; y++) {
            for (let x = 0; x <= 950; x++) {
                let potential = Math.round(this.calculator.getPotentialAtPoint(q1, x1, y1,
                    q2, x2, y2,
                    x, y));
                let eps = 1;  // допустимо, чтобы внутри поверхности модуль разности потенциалов был такой
                for (let shift = -eps; shift <= eps; shift++) {
                    if (potentialMap.has(potential + shift)) {
                        potentialMap.get(potential + shift).push([x, y]);
                    }
                }
            }
        }

        for (let potential of potentialMap.keys()) {
            this.ctx.beginPath();
            for (let xy of potentialMap.get(potential)) {
                let x = xy[0];
                let y = xy[1];
                let cx = Configuration.centerX + x;
                let cy = Configuration.centerY - y;
                this.drawPoint(cx, cy, 1);
            }
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.closePath();
        }
    }

    drawDipole(dipole: Dipole) {
        this.drawCharge(dipole.charge1);
        this.drawCharge(dipole.charge2);
    }

    draw(dipole: Dipole, drawLines: boolean, drawSurfaces: boolean) {
        if (this.reDrawTimer != null) {
            clearInterval(this.reDrawTimer);
        }
        if (!Configuration.animation) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.drawAxes(400, 25);

            if (!Configuration.firstPositive) {
                dipole.swapCharges();
            }

            if (!Configuration.useImages || this.loaded == 2) {
                if (drawLines) this.drawLinesOfForce(dipole);
                if (drawSurfaces) this.newDrawEquipotentialSurfaces(dipole);

                this.drawDipole(dipole);
            }
        } else {
            this.reDrawTimer = setInterval(() => {
                this.reDraw(dipole, drawLines, drawSurfaces);
            }, 200);
        }
    }

    reDraw(dipole: Dipole, drawLines: boolean, drawSurfaces: boolean) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.drawAxes(400, 25);

        if (!Configuration.firstPositive) {
            dipole.swapCharges();
        }

        if (!Configuration.useImages || this.loaded == 2) {
            if (drawSurfaces) this.newDrawEquipotentialSurfaces(dipole);
            if (drawLines) this.drawAnimLinesOfForce(dipole);

            this.drawDipole(dipole);
        }
    }
}
