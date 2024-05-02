import {Charge} from "./charge";
import {Configuration} from "../configuration/configuration";

export class Dipole {
    // it was only pure dipole (+q, -q), but now it uses for (+q, +q) or (-q, -q)
    charge1: Charge;
    charge2: Charge;

    x: number;  // dipole center
    y: number;  // dipole center

    constructor(q: number, r: number, x: number, y: number) {
        this.x = x;
        this.y = y;
        this.charge1 = new Charge(q, x - r / 2 - Configuration.radius, y);
        this.charge2 = new Charge(-q, x + r / 2 + Configuration.radius, this.y);
    }

    swapCharges() {
        // let x = this.charge1.x; let y= this.charge1.y;
        // this.charge1.x = this.charge2.x;
        // this.charge1.y = this.charge2.y;
        // this.charge2.x = x;
        // this.charge2.y = y;
        if (this.charge1.q * this.charge2.q < 0) {
            this.charge1.q *= -1;
            this.charge2.q *= -1;
        }
    }
}
