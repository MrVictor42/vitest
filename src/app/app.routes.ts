import { Routes } from '@angular/router';
import { HelloWorld } from "./hello-world/hello-world";
import {Tabs} from "./tabs/tabs";
import { CoursePage } from './course-page/course-page';
import { courseResolver } from './services/course.resolver';

export const routes: Routes = [
    {
        path: 'world',
        component: HelloWorld
    },
    {
        path: 'tabs',
        component: Tabs
    },
    {
        path: 'courses/:id',
        component: CoursePage,
        resolve: {
            course: courseResolver
        }
    },
];