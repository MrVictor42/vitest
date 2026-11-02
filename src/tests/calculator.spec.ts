import { describe, expect, it } from "vitest";
import { calculator } from "./calculator";

/*
    O .skip literalmente pula o test.
    Também pode ser usado para pular o conjunto de testes
    Pode ser usar o .only para rodar apenas um teste
    Tambem é possivel fazer uma condicional para o teste rodar ou não, com o skipIf

    O Spy ele "espiona" a função inteira, inclusive os resultados, então se eu fizer dois testes diferentes utilizando
    a mesma função, vai da erro
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

    it("Como o Mock funciona", () => {
        const spy = vi.spyOn(calculator, "add").mockReturnValue(42);
        const result = calculator.add(40, 2);

        expect(result).toBe(42);
        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(40, 2);

        /*const result2 = calculator.add(5, 5);

        expect(result2).toBe(10);*/
    });

    it.only("Como o Mock 'puro' funciona", () => {
        const addMOck = vi.fn().mockReturnValue(10);
        const result = addMOck(5, 5);

        expect(result).toBe(10);
        expect(addMOck).toHaveBeenCalledOnce();
        expect(addMOck).toHaveBeenCalledWith(5, 5);
    });
});