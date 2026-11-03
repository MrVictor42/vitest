import { Component, DebugElement } from "@angular/core";
import { beforeEach, describe } from "vitest";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DIALOG_DATA, DialogRef } from "@angular/cdk/dialog";
import { CoursesService } from "../../services/courses.service";
import { CoursesDialog } from "./courses-dialog";
import { MOCK_COURSES } from "../../testing/testing-data";
import { FieldState } from "@angular/forms/signals";
import { clickButton } from "../../testing/testing-utils";

describe("CoursesDialog", () => {
    let fixture: ComponentFixture<CoursesDialog>;
    let debug: DebugElement;
    let component: CoursesDialog;
    let mockCoursesService: any;
    let mockDialogRef: any;

    beforeEach(async () => {
        mockCoursesService = {  
            saveCourse: vi.fn().mockResolvedValue({})
        };

        mockDialogRef = {
            close: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [CoursesDialog],
            providers: [
                { provide: CoursesService, useValue: mockCoursesService },
                { provide: DialogRef, useValue: mockDialogRef },
                { provide: DIALOG_DATA, useValue: { course: MOCK_COURSES[0] } }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(CoursesDialog);
        debug = fixture.debugElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("Deve inicializar o formulário com os dados do curso", () => {
        expect(component.courseModel().description).toBe(MOCK_COURSES[0].titles.description);
        expect(component.courseModel().category).toBe(MOCK_COURSES[0].category);
        expect(component.courseModel().longDescription).toBe(MOCK_COURSES[0].titles.longDescription);
        expect(component.courseModel().releasedAt).toBe(new Date().toLocaleDateString('en-CA'));
        expect(component.courseForm().valid()).toBe(true);
    });

    it("Deve lidar com todos os campos obrigatórios", async() => {
        testFieldError(component.courseForm.description(), ".description", "Description is required");
        testFieldError(component.courseForm.category(), ".category", "Category is required");
        testFieldError(component.courseForm.releasedAt(), ".released-at", "Release Date is required");
        testFieldError(component.courseForm.longDescription(), ".long-description", "Long Description is required");
    });

    it("Deve chamar o saveCourse e fechar a modal", async() => {
        component.courseForm.description().value.set("New Course Title");
        fixture.detectChanges();

        clickButton(debug, ".btn-primary");
        await fixture.whenStable();

        expect(mockCoursesService.saveCourse).toHaveBeenLastCalledWith(
            1, expect.objectContaining({
                titles: expect.objectContaining({ description: "New Course Title" })
            })
        );

        expect(mockDialogRef.close).toHaveBeenCalledWith(expect.objectContaining({
            description: "New Course Title",
            category: MOCK_COURSES[0].category,
            longDescription: MOCK_COURSES[0].titles.longDescription,
        }));
    });

    function testFieldError(fieldState: FieldState<any>, selector: string, message: string) {
        fieldState.value.set('');
        fieldState.markAsTouched();
        fixture.detectChanges();

        const errorList = debug.query(By.css(`${selector} .error-list`));

        expect(errorList).toBeTruthy();
        expect(errorList.nativeElement.textContent).toContain(message);

        const saveBtn = debug.query(By.css(".btn-primary"))?.nativeElement;

        expect(saveBtn?.disabled).toBe(true);
    }
});
