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


    constructor(public drawer: DrawerService) {
    }

    getForce() {
        // закон Кулона
        let k = 9 * 1e9;
        return k * this.chargeModule ** 2 / this.chargeDistance ** 2;
    }

    getElectricFieldStrength() {
        // E = F / q
        return this.getForce() / this.chargeModule;
    }

    getPotential() {
        let k = 9 * 1e9;
        let w = k * this.chargeModule ** 2 / this.chargeDistance;
        return w / this.chargeModule;
    }

    ngOnInit() {


    }

    ngAfterViewInit(): void {
        this.drawer.init();
        // this.drawer.draw(this.chargeDistance);

        // setInterval(() => {
        //
        // }, 1);
    }

    ngAfterViewChecked() {
        this.drawer.draw(this.chargeDistance);
    }

    start() {

    }

    restart() {

        // this.hare = this.animalFactory.getNewHare(this.hareSpeed);
        // this.wolf = this.animalFactory.getNewWolf(this.hare, this.wolfStartY, this.wolfSpeed);
        //
        // this.drawer.setAnimals(this.hare, this.wolf);
    }


    onStartButtonClick($event: MouseEvent) {
        // this.start();
        this.drawer.start();
    }

    onRestartButtonClick($event: MouseEvent) {
        this.restart();
    }

    onApplyButtonClick($event: MouseEvent) {
        // this.hare.speed = this.hareSpeed;
        //
        // this.wolf.curY = Configuration.centerY - this.wolfStartY;
        // this.wolf.startY = this.wolfStartY;
        // this.wolf.speed = this.wolfSpeed;
    }

    hasChanges() {
        return false;
        // return this.hareSpeed !== this.hare.speed ||
        //     this.wolfSpeed !== this.wolf.speed ||
        //     this.wolfStartY !== this.wolf.startY;
    }
}
