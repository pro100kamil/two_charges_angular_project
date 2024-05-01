import {Charge} from "./charge";

export class Dipole {
    charge1: Charge;
    charge2: Charge;

    x: number;  // dipole center
    y: number;  // dipole center

    constructor(q: number, r: number, x: number, y: number) {
        this.x = x;
        this.y = y;
        this.charge1 = new Charge(q, this.x, this.y);
        this.charge2 = new Charge(-q, this.x + this.charge1.radius + r, this.y);
    }

    swapCharges() {
        let x = this.charge1.x; let y= this.charge1.y;
        this.charge1.x = this.charge2.x;
        this.charge1.y = this.charge2.y;
        this.charge2.x = x;
        this.charge2.y = y;
    }
}
