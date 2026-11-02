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
    it.skipIf(skipTest)("Deve somar dois numeros", () => {
        const result = calculator.add(2, 3);

        expect(result).toBe(5);
    });

    it("Mostra como o spipes funciona", () => {
        const spy = vi.spyOn(calculator, "add");
        const result = calculator.add(2, 3);

        expect(result).toBe(5);
        expect(spy).toHaveBeenCalledOnce(); //confirma que o metodo foi chamado uma vez
        expect(spy).toHaveBeenCalledWith(2, 3); //confirma que o metodo foi chamado com os argumentos originais e na ordem colocada
    });
});