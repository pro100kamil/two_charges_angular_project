import {Charge} from "./charge";

export class Dipole {
    charge1: Charge;
    charge2: Charge;

    x: number;  // beginning of first charge
    y: number;  // beginning of first charge

    constructor(q: number, r: number, x: number, y: number) {
        this.x = x;
        this.y = y;
        this.charge1 = new Charge(q, this.x, this.y);
        this.charge2 = new Charge(-q, this.x + this.charge1.radius + r, this.y);
    }
}
