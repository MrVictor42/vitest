import { Routes } from '@angular/router';
import { HelloWorld } from "./hello-world/hello-world";
import {Tabs} from "./tabs/tabs";

export const routes: Routes = [
    {
        path: 'world',
        component: HelloWorld
    },
    {
        path: 'tabs',
        component: Tabs
    }
];