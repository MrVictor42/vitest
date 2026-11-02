import { describe, it, expect, beforeEach } from "vitest";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { TabsComponent } from "./tabs/tabs";
import { TabData } from "./tabs/tabs.model";
import { MOCK_TABS } from "../testing/testing-data";
import { By } from "@angular/platform-browser";

describe("Tabs", () => {
    let component: TabsComponent;
	let fixture: ComponentFixture<TabsComponent>;
	let debug: DebugElement;
	const mockTabs: TabData[] = MOCK_TABS;
	
	beforeEach(async () => {
		TestBed.configureTestingModule({
			imports: [TabsComponent]
		});
		await TestBed.compileComponents();

		fixture = TestBed.createComponent(TabsComponent);
		component = fixture.componentInstance;
		debug = fixture.debugElement;
		fixture.componentRef.setInput("tabs", mockTabs);
		fixture.detectChanges();
	});
	
	it("Deve criar o component", () => {
		expect(component).toBeDefined();
	});
	
	it("Renderizar corretamente o numero de tabs", () => {
	    const buttons = debug.queryAll(By.css(".tab-link"));
		
		expect(buttons.length).toBe(2);
		expect(buttons[0].nativeElement.textContent.trim()).toBe("Beginner");
		expect(buttons[1].nativeElement.textContent.trim()).toBe("Advanced");
	});
	
	it("Aplicar a tab ativa", () => {
	    fixture.componentRef.setInput("activeTab", "advanced");
		fixture.detectChanges();
		
		const button = debug.query(By.css(".tab-link:last-child"));
		
		expect(button.nativeElement.classList).toContain("active");
	});
	
	it("Deve mostrar quando a tab ativa é clicada", () => {
		const button = debug.query(By.css(".tab-link:last-child"));
	
		button.nativeElement.click();
		fixture.detectChanges();
		expect(component.activeTab()).toBe("advanced");
	});
	
	it("Deve mostrar quando ocorre uma mudança de tab", () => {
	    const emitSpy = vi.spyOn(component.tabChanged, "emit");
		const button = debug.query(By.css(".tab-link:last-child"));
		
		button.nativeElement.click();
		fixture.detectChanges();
		expect(emitSpy).toHaveBeenCalledWith("advanced");
		expect(emitSpy).toHaveBeenCalledOnce();
	});
});