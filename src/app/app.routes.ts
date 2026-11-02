import { Routes } from '@angular/router';
import { HelloWorld } from "../hello-world/hello-world";

export const routes: Routes = [
    {
        path: 'world',
        component: HelloWorld
    }
];