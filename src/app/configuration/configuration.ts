import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class Configuration {
    static useImages = false;  // используются ли картинки для зарядов или просто круги


    static firstPositive = true;    // идёт ли положительный заряд первым по порядку


    static canvasWidth = 1000;
    static canvasHeight = 500;

    static centerX = 50;
    static centerY = Configuration.canvasHeight - 50;
    // (centerX;centerY) - (0;0)

    static radius = 25;

    static wolfTrajectoryColor = "red";

    static wolfDefaultY = 350;          //кол-во пикселей над зайцем
}
