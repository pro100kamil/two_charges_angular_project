import {Injectable} from "@angular/core";
import {Dipole} from "../models/dipole";

@Injectable({
    providedIn: 'root'
})
export class CalculatorService {
    k = 9 * 1e9;

    calcDistance(x1: number, y1: number, x2: number, y2: number) {
        return ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** 0.5;
    }

    getForce(q1: number, q2: number, r: number) {
        // закон Кулона
        return this.k * q1 * q2 / r ** 2;
    }

    getElectricFieldStrength(F: number, q: number) {
        // E = F / q
        return F / q;
    }

    getElectricFieldStrengthAtPointOneCharge(q1: number, x1: number, y1: number,
                                             x: number, y: number) {
        let r1 = this.calcDistance(x, y, x1, y1);
        return this.k * q1 / r1 ** 2;
    }

    getElectricFieldStrengthAtPoint(q1: number, x1: number, y1: number,
                                    q2: number, x2: number, y2: number,
                                    x: number, y: number) {
        let r1 = this.calcDistance(x, y, x1, y1);
        let r2 = this.calcDistance(x, y, x2, y2);
        return this.k * q1 / r1 ** 2 + this.k * q2 / r2 ** 2;
    }

    getPotential(q: number, r: number) {
        let w = this.k * q ** 2 / r;
        return w / q;
    }

    getPotentialAtPoint(q1: number, x1: number, y1: number,
                        q2: number, x2: number, y2: number,
                        x: number, y: number) {
        let r1 = this.calcDistance(x, y, x1, y1);
        let r2 = this.calcDistance(x, y, x2, y2);
        return this.k * q1 / r1 + this.k * q2 / r2;
    }

    getLinesOfForce(dipole: Dipole) {
        let q1 = dipole.charge1.q;
        let q2 = dipole.charge2.q;
        let y0 = dipole.charge1.y;
        let x1 = dipole.charge1.x;
        let x2 = dipole.charge2.x;

        let q = Math.abs(q1) / 200;
        let dy = 100 - q * 80;
        // let dy = 50;
        let count = 800;
        let ys = [];
        for (let y = 50; y <= 350; y += dy) ys.push(y);
        // ys = [50, 100, 150, 200, 250, 300, 350];
        let lines = [];
        for (let y of ys)  {
            let y_ = y;
            for (let side of ["right", "left"]) {
                let x = side == "left" ? 50 : 750;

                y = y_;

                let line = [];
                line.push([x, y]);
                for (let i = 0; i < count && (side == "left" && x < 400 || side == "right" && x > 400); i++) {
                    let r1x = x - x1;
                    let r1y = y - y0;
                    let r1 = this.calcDistance(x1, y0, x, y);

                    let r2x = x - x2;
                    let r2y = y - y0;
                    let r2 = this.calcDistance(x2, y0, x, y);

                    let e1 = this.getElectricFieldStrengthAtPointOneCharge(
                        dipole.charge1.q, x1, y0, x, y);
                    let e1x = e1 * r1x / r1;
                    let e1y = e1 * r1y / r1;
                    let e1_ = (e1x ** 2 + e1y ** 2) ** 0.5;

                    let e2 = this.getElectricFieldStrengthAtPointOneCharge(
                        dipole.charge2.q, x2, y0, x, y);
                    let e2x = e2 * r2x / r2;
                    let e2y = e2 * r2y / r2;
                    let e2_ = (e2x ** 2 + e2y ** 2) ** 0.5;

                    let ex = e1x + e2x;
                    let ey = e1y + e2y;
                    let e = this.getElectricFieldStrengthAtPoint(
                        dipole.charge1.q, x1, y0,
                        dipole.charge2.q, x2, y0, x, y);
                    let step = 1;


                    ex = ex / e * step;
                    ey = ey / e * step;

                    if (Math.abs(ex) > 100 || Math.abs(ey) > 100) {
                        ex = 1;
                        e1 = 1;
                    }

                    if (side == "left" && ex < 0) {
                        ex *= -1;
                        ey *= -1;
                    }
                    else if (side == "right" && ex > 0) {
                        ex *= -1;
                        ey *= -1;
                    }

                    x = x + ex;
                    y = y + ey;
                    if (side == "left" && x >= 400) line.push([400, y]);
                    else if (side == "right" && x <= 400) line.push([400, y]);
                    else line.push([x, y]);
                }
                if (q1 == q2 && 25 <= y && y <= 375) continue;
                // if (q1 == q2 && 25 <= y && y <= 375) {
                //     if (line[0][1]) line.push([400, 380]);
                //     else line.push([400, 20]);
                // }
                lines.push(line);
            }
        }
        return lines;
    }
}
