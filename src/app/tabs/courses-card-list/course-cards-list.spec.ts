import { describe, beforeEach } from "vitest";
import { CoursesCardList } from "./courses-card-list";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { MOCK_COURSES } from "../../testing/testing-data";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";
import { CoursesDialog } from "../courses-dialog/courses-dialog";

describe("CoursesCardList", () => {
    let component: CoursesCardList;
    let fixture: ComponentFixture<CoursesCardList>;
    let debug: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CoursesCardList, CoursesDialog],
            providers: [provideRouter([])],
        }).compileComponents();

        fixture = TestBed.createComponent(CoursesCardList);
        component = fixture.componentInstance;
        debug = fixture.debugElement;

        fixture.componentRef.setInput("courses", MOCK_COURSES);
        fixture.detectChanges();
    });

    it("Mostrar lista de cursos", () => {
        const cardTitles = debug.queryAll(By.css(".course-card .card-header"));
        const titleElement = cardTitles[0].nativeElement;

        expect(cardTitles.length).toBe(MOCK_COURSES.length);
        expect(titleElement.textContent).toBe("Beginner Course");
    });

    it("Mostrar mensagem quando não houver cursos", () => {
        fixture.componentRef.setInput("courses", []);
        fixture.detectChanges();

        const message = debug.query(By.css(".no-courses"));

        expect(message).toBeTruthy();
        expect(message.nativeElement.textContent).toContain("No courses found");
    });

    it("Deve abrir a modal quando clicar no botão de editar curso", () => {
        const button = debug.query(By.css(".course-card:first-child .edit-btn"));

        button.nativeElement.click();
        fixture.detectChanges();

        const form = document.querySelectorAll(".course-form");

        expect(form.length, "The edit course form should be visible.").toBeGreaterThan(0);
    });
});