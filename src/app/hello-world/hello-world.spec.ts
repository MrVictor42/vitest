import { describe, it, expect, beforeEach } from "vitest";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { HelloWorld } from "./hello-world";

describe.only('Hello World', () => {
    let fixture: ComponentFixture<HelloWorld>;
    let debug: DebugElement;
    let element: HTMLElement;
    let component: HelloWorld;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HelloWorld]
        }).compileComponents();

        fixture = TestBed.createComponent(HelloWorld);
        debug = fixture.debugElement;
        element = debug.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Deve criar o componente', () => {
        expect(fixture.componentInstance).toBeDefined();
    });

    it("Deve mostrar a mensagem", () => {
        const h1 = element.querySelector("h1");

        expect(h1).toBeDefined();
        expect(h1?.textContent).toEqual(component.message);
    });
});