import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { beforeEach, describe, afterEach, it } from "vitest";
import { CoursesService } from "../../services/courses.service";
import { Courses } from "./courses";
import { createCourse, MOCK_COURSES } from "../../testing/testing-data";
import { Course } from "../../model/course";

describe("CoursesService", () => {
    let service: CoursesService;
    let httpTestingController: HttpTestingController;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [Courses],
            providers: [
                CoursesService,
                provideHttpClient(),
                provideHttpClientTesting()
            ],
        });

        service = TestBed.inject(CoursesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it("Deve carregar todos os cursos", async () => {
        const promise = service.reloadAllCourses();
        const req = httpTestingController.expectOne('/api/courses');
        
        expect(req.request.method).toBe('GET');
        req.flush({ payload: MOCK_COURSES });

        await promise;
        expect(service.allCourses()).toEqual(MOCK_COURSES);
    });

    it("Deve buscar curso por ID", async () => {
        const coursePromise = service.findCourseById(1);
        const req = httpTestingController.expectOne('/api/courses/1');

        expect(req.request.method).toBe('GET');
        req.flush(MOCK_COURSES[0]);

        const course = await coursePromise;
        expect(course.id).toBe(1);
        expect(course.titles.description).toBe("Beginner Course");
    });

    it("Deve mostrar lições por query", async () => {
        const promise = service.findLessons(12, "filter-next", "desc", 2, 10);
        const req = httpTestingController.expectOne(req => req.url === "/api/lessons");
        const params = req.request.params;

        expect(params.get("courseId")).toBe("12");
        expect(params.get("filter")).toBe("filter-next");
        expect(params.get("sortOrder")).toBe("desc");
        expect(params.get("pageNumber")).toBe("2");
        expect(params.get("pageSize")).toBe("10");

        const mockLessons = {payload: [{id: 12, description: "Lesson 1"}]};

        req.flush(mockLessons);

        const result = await promise;

        expect(result).toBe(mockLessons.payload);
    });

    it("Deve salvar curso", async () => {
        const course1 = createCourse({ id: 1, titles: { description: "Initial Course" } });
        const course2 = createCourse({ id: 2, titles: { description: "Stay Same" } });

        const loadPromise = service.reloadAllCourses();
        const loadReq = httpTestingController.expectOne('/api/courses');

        loadReq.flush({ payload: [course1, course2] });
        await loadPromise;

        const changes: Partial<Course> = {
            titles: { description: "New title" }
        };
        const savePromise = service.saveCourse(1, changes);
        const saveReq = httpTestingController.expectOne('/api/courses/1');

        expect(saveReq.request.method).toBe('PUT');
        expect(saveReq.request.body.titles.description).toBe("New title");

        saveReq.flush({ ...course1, ...changes });
        await savePromise;

        const allCourses = service.allCourses();

        expect(allCourses[0].titles.description).toBe("New title");
        expect(allCourses[1].id).toBe(2);
        expect(allCourses[1].titles.description).toBe("Stay Same");
    });

    afterEach(() => {
        httpTestingController.verify();
    });
});