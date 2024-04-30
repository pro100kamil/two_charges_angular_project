import {AfterViewChecked, AfterViewInit, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {DrawerService} from "./services/drawer.service";
import {FormsModule} from "@angular/forms";
import {Configuration} from "./configuration/configuration";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, OnInit, AfterViewChecked {
    protected readonly Math = Math;
    protected readonly Configuration = Configuration;

    title = 'project2';
    chargeDistance: number = 200;
    chargeModule: number = 1;

    drawLines = true;
    drawSurfaces = true;

    electricFieldStrength = 1;
    potential = 1;


    constructor(public drawer: DrawerService) {
    }

    getForce() {
        // закон Кулона
        let k = 9 * 1e9;
        let q = this.chargeModule / 1e6;  // потому что изначально задаётся в микрокулонах
        let r = this.chargeDistance;
        return k * q ** 2 / r ** 2;
    }

    getElectricFieldStrength() {
        // E = F / q
        let q = this.chargeModule / 1e6;  // потому что изначально задаётся в микрокулонах
        return this.getForce() / q;
    }

    getPotential() {
        let k = 9 * 1e9;
        let q = this.chargeModule / 1e6;  // потому что изначально задаётся в микрокулонах
        let r = this.chargeDistance;
        let w = k * q ** 2 / r;
        return w / q;
    }

    ngOnInit() {

    }

    ngAfterViewInit(): void {
        let canvas = document.getElementById("canvas");

        if (canvas == null) return;

        canvas.addEventListener("mousemove", (event: MouseEvent) => {
            //TODO
            let x = Configuration.centerX + event.x;
            let y = Configuration.centerY - event.y;
            console.log(x, y);

            let k = 9 * 1e9;
            let q = this.chargeModule / 1e6;  // потому что изначально задаётся в микрокулонах

            let x0 = 400;
            let y0 = 200;
            let x1 = 600;
            let y1 = 200;
            let r = ((x - x0) ** 2 + (y - y0) ** 2) ** 0.5;
            let r2 = ((x - x1) ** 2 + (y - y1) ** 2) ** 0.5;
            this.electricFieldStrength = k * q / r ** 2 - k * q / r2 ** 2;

            this.potential = k * q / r - k * q / r2;
        });

        this.drawer.init();
    }

    ngAfterViewChecked() {
        this.drawer.draw(this.chargeDistance, this.drawLines, this.drawSurfaces);
    }

    onSwapButtonClick($event: MouseEvent) {
        this.drawer.swapCharges();
    }
}
