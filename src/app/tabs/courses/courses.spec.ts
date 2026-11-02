import { describe, beforeEach } from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { DebugElement } from "@angular/core";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { Courses } from "./courses";
import { CoursesService } from "../../services/courses.service";

describe("Courses", () => {
    let component: Courses;
    let fixture: ComponentFixture<Courses>;
    let debug: DebugElement;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Courses],
            providers: [
                CoursesService,
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([])
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(Courses);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges();
    });

    it("Deve carregar cursos e filtrar pela categoria", () => {
        httpMock.expectOne("/api/courses");
    });

    it("Deve mostrar cursos avançados quando tab clicada", () => {

    });
});