import {Configuration} from "../configuration/configuration";

export class Charge {
    radius: number = Configuration.radius;
    // (x, y) - charge center
    constructor(public q: number,
                public x: number,
                public y: number) {}
}
