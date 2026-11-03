import { TabsHarness } from './../tabs/tabs.harness';
import { describe, beforeEach } from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { DebugElement } from "@angular/core";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { Courses } from "./courses";
import { CoursesService } from "../../services/courses.service";
import { MOCK_COURSES } from "../../testing/testing-data";
import { By } from "@angular/platform-browser";
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe("Courses", () => {
    let component: Courses;
    let fixture: ComponentFixture<Courses>;
    let debug: DebugElement;
    let httpMock: HttpTestingController;
    let tabs: TabsHarness

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

        const loader = TestbedHarnessEnvironment.loader(fixture);

        tabs = await loader.getHarness(TabsHarness);
        fixture.detectChanges();
    });

    it("Deve carregar cursos e filtrar pela categoria", async () => {
        const req = httpMock.expectOne("/api/courses");

        req.flush({ payload: MOCK_COURSES });
        await fixture.whenStable();
        fixture.detectChanges();

        const titles = debug.queryAll(By.css(".course-card .card-header"));
        const titleElement = titles[0].nativeElement;

        expect(titles).toHaveLength(1);
        expect(titleElement.textContent).toBe("Beginner Course");   

        expect(await tabs.getTabLabels()).toEqual(["Beginner", "Advanced"]);
        expect(await tabs.getActiveLabel()).toBe("Beginner");
    });

    it("Deve mostrar cursos avançados quando tab clicada", async () => {
        const req = httpMock.expectOne("/api/courses");

        req.flush({ payload: MOCK_COURSES });
        await fixture.whenStable();

        await tabs.clickTabByIndex(1);

        const titles = debug.queryAll(By.css(".course-card .card-header"));
        const titleElement = titles[0].nativeElement;

        expect(titles).toHaveLength(1);
        expect(titleElement.textContent).toBe("Advanced Course");   
    });

    afterEach(() => {
        httpMock.verify();
    });
});