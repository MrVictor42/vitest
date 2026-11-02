import { Component, DebugElement } from "@angular/core";
import { beforeEach, describe } from "vitest";
import { HighlightDirective } from "./highlight.directive";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

@Component({
	imports: [HighlightDirective],
	template: `
		<div id="default-highlight" appHighlight>Default Color</div>
		<div id="custom-highlight" appHighlight highlightColor="rgb(0, 0, 255)">Custom Color</div>
		<div id="no-highlight">No Highlight</div>
	`,
})
class TestHostComponent {

}

describe("HighlightDirective", () => {
  	let fixture: ComponentFixture<TestHostComponent>;
	let debug: DebugElement;
	let defaultHighlight: any;
	let customHighlight: any;
	let noHighlight: any;
	
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TestHostComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(TestHostComponent);
		debug = fixture.debugElement;
		fixture.detectChanges();

		defaultHighlight = debug.query(By.css("#default-highlight")).nativeElement;
		customHighlight = debug.query(By.css("#custom-highlight")).nativeElement;
		noHighlight = debug.query(By.css("#no-highlight")).nativeElement;
	});

	it("Deve conter todos os elementos", () => {
		expect(defaultHighlight).toBeTruthy();
		expect(customHighlight).toBeTruthy();
		expect(noHighlight).toBeTruthy();
	});

	it("Deve aplicar a cor padrão de destaque ao passar o mouse e deixar limpo quando o mouse sair de cima", () => {
		defaultHighlight.dispatchEvent(new Event("mouseenter"));
		fixture.detectChanges();
		expect(defaultHighlight.style.backgroundColor).toBe("rgb(0, 128, 0)"); 

		defaultHighlight.dispatchEvent(new Event("mouseleave"));
		fixture.detectChanges();
		expect(defaultHighlight.style.backgroundColor).toBe(""); 
	});

	it("Aplicar uma cor personalizada", () => {
		customHighlight.dispatchEvent(new Event("mouseenter"));
		fixture.detectChanges();
		expect(customHighlight.style.backgroundColor).toBe("rgb(0, 0, 255)"); 
	});

	it("Não deve aplicar nenhuma cor de destaque sem diretiva", () => {
		noHighlight.dispatchEvent(new Event("mouseenter"));
		fixture.detectChanges();
		expect(noHighlight.style.backgroundColor).toBe(""); 
	});
});