import {AfterViewChecked, AfterViewInit, Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {DrawerService} from "./services/drawer.service";
import {FormsModule} from "@angular/forms";
import {Configuration} from "./configuration/configuration";
import {CalculatorService} from "./services/calculator.service";
import {Dipole} from "./models/dipole";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [CommonModule, RouterOutlet, FormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit, AfterViewChecked {
    protected readonly Math = Math;
    protected readonly Configuration = Configuration;

    title = 'project2';
    chargeDistance: number = 200;
    chargeModule: number = 1;

    playAudio = true;
    drawLines = true;
    drawSurfaces = true;

    electricFieldStrength = 1;
    potential = 1;
    mode = "+-";

    dipole: any;
    usePictures = Configuration.useImages;


    constructor(public drawer: DrawerService,
                public calculator: CalculatorService) {
    }

    getForce() {
        // закон Кулона
        let q = this.chargeModule / 1e6;  // потому что изначально задаётся в микрокулонах
        let r = this.chargeDistance;
        return this.calculator.getForce(q, q, r);
    }

    getElectricFieldStrength() {
        let q = this.chargeModule / 1e6;  // потому что изначально задаётся в микрокулонах
        let r = this.chargeDistance;
        let F = this.calculator.getForce(q, q, r);
        return this.calculator.getElectricFieldStrength(F, q);
    }

    getPotential() {
        let q = this.chargeModule / 1e6;  // потому что изначально задаётся в микрокулонах
        let r = this.chargeDistance;
        return this.calculator.getPotential(q, r);
    }

    ngAfterViewInit(): void {
        let audio = document.getElementsByTagName('audio')[0];
        audio.volume = 0;

        let canvas = document.getElementById("canvas");

        if (canvas == null) return;

        canvas.addEventListener("mousemove", (event: MouseEvent) => {
            //from computer coordinate system to math coordinate system
            let cx = event.x - canvas.offsetLeft;
            let cy = event.clientY - canvas.offsetTop;

            let x = cx - Configuration.centerX;
            let y = Configuration.centerY - cy;

            let q1 = this.dipole.charge1.q / 1e6;  // потому что изначально задаётся в микрокулонах
            let x1 = this.dipole.charge1.x;
            let y1 = this.dipole.charge1.y;

            let q2 = this.dipole.charge2.q / 1e6;  // потому что изначально задаётся в микрокулонах
            let x2 = this.dipole.charge2.x;
            let y2 = this.dipole.charge2.y;

            this.electricFieldStrength = this.calculator.getElectricFieldStrengthAtPoint(q1, x1, y1,
                q2, x2, y2, x, y);

            this.potential = this.calculator.getPotentialAtPoint(q1, x1, y1,
                q2, x2, y2, x, y);

            if (!this.playAudio) return;

            if (audio.ended || audio.currentTime == 0) audio.play();

            // volume and durations depends on electricFieldStrength
            if (Math.abs(this.electricFieldStrength) > 20) {
                // audio.pause();
                audio.volume = 1;
            } else if (Math.abs(this.electricFieldStrength) > 10) {
                audio.volume = 0.75;
            }else if (Math.abs(this.electricFieldStrength) > 5) {
                audio.volume = 0.5;
            }else if (Math.abs(this.electricFieldStrength) > 1) {
                audio.volume = 0.25;
            }else if (Math.abs(this.electricFieldStrength) > 0.2) {
                audio.volume = 0.15;
            }
            else {
                audio.volume = 0;
            }
        });

        canvas.addEventListener("mouseleave", (event: MouseEvent) => {
            audio.volume = 0;
        });

        this.drawer.init();
    }

    ngAfterViewChecked() {
        Configuration.useImages = this.usePictures;

        //раньше было because pics contains empty space
        // if (Configuration.useImages) Configuration.radius = 50;
        // else Configuration.radius = 25;

        this.dipole = new Dipole(this.chargeModule, this.chargeDistance, 400, 200);
        if (this.mode == '--') {
            this.dipole.charge1.q *= -1;
        } else if (this.mode == '++') {
            this.dipole.charge2.q *= -1;
        }

        this.drawer.draw(this.dipole, this.drawLines, this.drawSurfaces);
    }

    onSwapButtonClick($event: MouseEvent) {
        Configuration.firstPositive = !Configuration.firstPositive;
    }

    onAnimationButtonClick($event: MouseEvent) {
        Configuration.animation = !Configuration.animation;
    }
}
