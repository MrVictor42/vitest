import { describe, expect, it } from "vitest";
import { calculator } from "./calculator";

/*
    O .skip literalmente pula o test.
    Também pode ser usado para pular o conjunto de testes
    Pode ser usar o .only para rodar apenas um teste
    Tambem é possivel fazer uma condicional para o teste rodar ou não, com o skipIf
 */

const skipTest = false;

describe("Vitest Fundamentals", () => {
    it.skipIf(skipTest)("should add two numbers", () => {
        const result = calculator.add(2, 3);

        expect(result).toBe(5);
    });

    it("should add two numbers V2", () => {
        const result = calculator.add(2, 3);

        expect(result).toBe(5);
    });

    it("should add two numbers V3", () => {
        const result = calculator.add(2, 3);

        expect(result).toBe(5);
    });
});