import {Injectable} from "@angular/core";

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
}
