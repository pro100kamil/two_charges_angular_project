import {Injectable} from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class Configuration {
    static useImages = true;  // используются ли картинки для зарядов или просто круги


    static firstPositive = true;    // идёт ли положительный заряд первым по порядку


    static canvasWidth = 1000;
    static canvasHeight = 500;

    static centerX = 50;
    static centerY = Configuration.canvasHeight - 50;
    // (centerX;centerY) in computer coordinate system = (0;0) in math coordinate system

    static radius = 50;  // charge radius
    static animation = false;
}
