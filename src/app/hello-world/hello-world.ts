import { Component } from "@angular/core";

@Component({
    imports: [],
    selector: "app-hello-world",
    styleUrl: "./hello-world.css",
    templateUrl: "./hello-world.html",
})
export class HelloWorld {
    message = 'Hello World!';
}