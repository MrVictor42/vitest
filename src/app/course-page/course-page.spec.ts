import { provideHttpClientTesting } from "@angular/common/http/testing";
import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { getMockLessonsPage, MOCK_COURSES, MOCK_LESSONS } from "../testing/testing-data";
import { CoursePage } from "./course-page";
import { describe, it, beforeEach } from "vitest";
import { CoursesService } from "../services/courses.service";
import { provideHttpClient } from "@angular/common/http";
import { ActivatedRoute, provideRouter } from "@angular/router";
import { clickButton, getTableContent } from "../testing/testing-utils";
import { By } from "@angular/platform-browser";

const FIRST_PAGE = getMockLessonsPage(1, '', 'asc', 0, 3);
const SECOND_PAGE = getMockLessonsPage(1, '', 'asc', 1, 3);
const SEARCH_RESULT = getMockLessonsPage(1, 'Lesson 20', 'asc', 0, 3);

describe('CoursePage', () => {
    let mockCoursesService: any;
    let component: CoursePage;
    let fixture: ComponentFixture<CoursePage>;
    let debug: DebugElement;

    beforeEach(async () => {
        mockCoursesService = {
            findLessons: vi.fn()
        };

        await TestBed.configureTestingModule({
            imports: [CoursePage],
            providers: [
                { provide: CoursesService, useValue: mockCoursesService },
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([]),
                { provide: ActivatedRoute, useValue: { snapshot: { data: { course: MOCK_COURSES[0] } } } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CoursePage);
        component = fixture.componentInstance;
        debug = fixture.debugElement;
    });

    it("Deve carregar a primeira página de lições, com o on init", async () => {
        mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);

        await fixture.whenStable();

        expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', "asc", 0, 3);

        const lessons = getTableContent(debug, "tbody tr td.description-cell");

        expect(lessons).toHaveLength(3);
        expect(lessons[0]).toBe("Lesson 1");
        expect(lessons[1]).toBe("Lesson 2");
        expect(lessons[2]).toBe("Lesson 3");
    });

    it("Deve mostrar o carregamento spinner enquanto as lições estão sendo carregadas", async () => {
        fixture.detectChanges();

        const spinner = debug.query(By.css(".loading-spinner"));

        expect(spinner).toBeTruthy();
        expect(component.loading()).toBe(true);
    });

    it("Deve navegar para a proxima página", async () => {
        mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(mockCoursesService.findLessons).toHaveBeenCalledOnce();
        expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', "asc", 0, 3);

        mockCoursesService.findLessons.mockReturnValueOnce(SECOND_PAGE);

        clickButton(debug, ".page-controls button:last-child");

        await fixture.whenStable();

        expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2);
        expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', "asc", 1, 3);

        fixture.detectChanges();

        const lessons = getTableContent(debug, "tbody tr td.description-cell");

        expect(lessons).toHaveLength(3);
        expect(lessons[0]).toBe("Lesson 4");
        expect(lessons[1]).toBe("Lesson 5");
        expect(lessons[2]).toBe("Lesson 6");
    });

    it("Deve navegar para a página anterior", async () => {
        mockCoursesService.findLessons.mockReturnValueOnce(SECOND_PAGE).mockReturnValueOnce(FIRST_PAGE);
        component.pageIndex.set(1);
        fixture.detectChanges();
        await fixture.whenStable();

        expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(1);
        expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', "asc", 1, 3);

        clickButton(debug, ".page-controls button:first-child");

        await fixture.whenStable();

        expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2);
        expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', "asc", 0, 3);

        const lessons = getTableContent(debug, "tbody tr td.description-cell");

        expect(lessons).toHaveLength(3);
        expect(lessons[0]).toBe("Lesson 1");
        expect(lessons[1]).toBe("Lesson 2");
        expect(lessons[2]).toBe("Lesson 3");
    });

    it("Should toggle sort direction", async () => {
        mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);

        await fixture.whenStable();

        expect(component.sortDirection()).toBe("asc");

        mockCoursesService.findLessons.mockReturnValueOnce(MOCK_LESSONS.reverse().slice(0, 3));

        clickButton(debug, ".sortable");

        await fixture.whenStable();

        expect(component.sortDirection()).toBe("desc");
        expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2);
        expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, '', "desc", 0, 3);

        const lessons = getTableContent(debug, "tbody tr td.description-cell");

        expect(lessons).toHaveLength(3);
        expect(lessons[0]).toBe("Lesson 20");
        expect(lessons[1]).toBe("Lesson 19");
        expect(lessons[2]).toBe("Lesson 18");
    });

    it("Deve atualizar o tamanho da pagina (pageSize) e recarregar as lições", async () => {
        mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);

        await fixture.whenStable();

        mockCoursesService.findLessons.mockReturnValueOnce(getMockLessonsPage(1, '', 'asc', 0, 10));

        const selectElement = debug.query(By.css('.items-label select')).nativeElement;

        selectElement.value = 10;
        selectElement.dispatchEvent(new Event('change'));
        
        await fixture.whenStable();

        expect(component.pageSize()).toBe(10);
        expect(component.pageIndex()).toBe(0);

        const lessons = getTableContent(debug, "tbody tr td.description-cell");

        expect(lessons).toHaveLength(10);
        expect(lessons[0]).toBe("Lesson 1");
        expect(lessons[1]).toBe("Lesson 2");
        expect(lessons[2]).toBe("Lesson 3");
        expect(lessons[3]).toBe("Lesson 4");
        expect(lessons[4]).toBe("Lesson 5");
        expect(lessons[5]).toBe("Lesson 6");
        expect(lessons[6]).toBe("Lesson 7");
        expect(lessons[7]).toBe("Lesson 8");
        expect(lessons[8]).toBe("Lesson 9");
        expect(lessons[9]).toBe("Lesson 10");
    });

    it("Should debounce search input by 400ms", async () => {
        vi.useFakeTimers();

        mockCoursesService.findLessons.mockReturnValueOnce(FIRST_PAGE);
        fixture.detectChanges();

        expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(1);

        mockCoursesService.findLessons.mockReturnValueOnce(SEARCH_RESULT);

        component.onSearch("Lesson 20");
        fixture.detectChanges();
        await vi.advanceTimersByTimeAsync(0);

        await vi.advanceTimersByTimeAsync(399);
        fixture.detectChanges();

        expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(1);

        await vi.advanceTimersByTimeAsync(400);
        expect(mockCoursesService.findLessons).toHaveBeenCalledTimes(2);
        expect(mockCoursesService.findLessons).toHaveBeenLastCalledWith(1, 'Lesson 20', "asc", 0, 3);

        vi.useRealTimers();
        await fixture.whenStable();
        fixture.detectChanges();

        expect(component.lessons()?.length, "lesson() valor não é correto").toBe(1);

        const lessons = getTableContent(debug, "tbody tr td.description-cell");

        expect(lessons).toHaveLength(1);
        expect(lessons[0]).toBe("Lesson 20");
    });

    afterEach(() => {
        vi.useRealTimers();
    });
});
