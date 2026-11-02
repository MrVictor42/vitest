import { beforeEach, describe, expect, it, vi } from "vitest";
import { calculator } from "./calculator";

/*
    CONCEITOS IMPORTANTES:

    1. .skip:
       Ignora um teste ou conjunto de testes, impedindo sua execução.

    2. .only:
       Executa exclusivamente o teste ou conjunto de testes marcado
       com .only. Os demais testes são ignorados.

    3. .skipIf(condicao):
       Executa o teste normalmente quando a condição é false.
       Quando a condição é true, o teste é ignorado.

    4. SPY (vi.spyOn):
       Espiona um método existente de um objeto.
       Permite verificar se ele foi chamado, quantas vezes foi chamado
       e quais argumentos recebeu.

       Por padrão, o método original continua sendo executado.
       Portanto, o Spy não altera automaticamente o comportamento
       da função.

    5. MOCK:
       Permite substituir o comportamento original de uma função,
       definindo um resultado controlado para ela.
*/

/*
    Variável utilizada para controlar a execução condicional
    do teste que utiliza skipIf.

    false = o teste será executado.
    true  = o teste será ignorado.
*/
const skipTest = false;

describe("Vitest Fundamentals", () => {
	/*
		  beforeEach:
  
		  Executa antes de CADA teste deste describe.
  
		  É utilizado para evitar que o estado de mocks e spies
		  de um teste interfira nos testes seguintes.
  
		  clearAllMocks():
		  Limpa o histórico de chamadas dos mocks e spies.
		  Não remove implementações personalizadas.
  
		  resetAllMocks():
		  Limpa o histórico e remove implementações personalizadas,
		  como mockReturnValue().
  
		  restoreAllMocks():
		  Restaura os métodos originais dos objetos espionados
		  com spyOn().
  
		  OBS: utilizar os três juntos é redundante em muitos casos.
		  O restoreAllMocks() já restaura os spies, enquanto o resetAllMocks()
		  já limpa o histórico dos mocks.
	  */
	beforeEach(() => {
		vi.clearAllMocks();
		vi.resetAllMocks();
		vi.restoreAllMocks();
	});
	
	/*
		  TESTE 1 - SKIPIF
  
		  Testa se a calculadora consegue somar dois números.
  
		  O skipIf() recebe uma condição:
		  - Se skipTest for true, o teste será ignorado.
		  - Se skipTest for false, o teste será executado.
  
		  O toBe(5) verifica se o resultado da soma é exatamente 5.
	  */
	it.skipIf(skipTest)("Deve somar dois numeros", () => {
		const result = calculator.add(2, 3);
		
		expect(result).toBe(5);
	});
	
	/*
		  TESTE 2 - SPY
  
		  O vi.spyOn() cria um espião sobre o método add da calculadora.
  
		  Diferentemente de um mock com comportamento personalizado,
		  o Spy mantém a implementação original da função.
  
		  Portanto, calculator.add(2, 3) continua executando
		  a soma normalmente e retorna 5.
  
		  toHaveBeenCalledOnce():
		  Verifica se o método foi chamado exatamente uma vez.
  
		  toHaveBeenCalledWith(2, 3):
		  Verifica se o método recebeu os argumentos 2 e 3,
		  respeitando a ordem em que foram enviados.
	  */
	it("Mostra como o Spy funciona", () => {
		const spy = vi.spyOn(calculator, "add");
		
		const result = calculator.add(2, 3);
		
		expect(result).toBe(5);
		expect(spy).toHaveBeenCalledOnce();
		expect(spy).toHaveBeenCalledWith(2, 3);
	});
	
	/*
		  TESTE 3 - MOCK UTILIZANDO SPY
  
		  Aqui utilizamos o Spy junto com mockReturnValue().
  
		  O vi.spyOn() continua espionando o método add,
		  mas agora seu comportamento original é substituído.
  
		  mockReturnValue(42):
		  Determina que toda chamada ao método espionado retorne 42,
		  independentemente dos argumentos recebidos.
  
		  Mesmo passando 40 + 2, o resultado será 42 porque
		  o retorno foi definido manualmente.
  
		  IMPORTANTE:
		  O método original NÃO executa sua implementação enquanto
		  essa implementação mockada estiver ativa.
  
		  As verificações seguintes continuam funcionando:
		  - O método foi chamado uma vez?
		  - Recebeu os argumentos 40 e 2?
	  */
	it("Como o Mock funciona", () => {
		const spy = vi.spyOn(calculator, "add").mockReturnValue(42);
		
		const result = calculator.add(40, 2);
		
		expect(result).toBe(42);
		expect(spy).toHaveBeenCalledOnce();
		expect(spy).toHaveBeenCalledWith(40, 2);
		
		/*
				Se executássemos:
	
				const result2 = calculator.add(5, 5);
	
				expect(result2).toBe(10);
	
				O teste falharia!
	
				Isso acontece porque o mockReturnValue(42)
				continua ativo e qualquer chamada ao método
				retornará 42, independentemente dos argumentos.
			*/
	});
	
	/*
		  TESTE 4 - MOCK PURO
  
		  Diferentemente do Spy, aqui não estamos espionando
		  um método existente.
  
		  O vi.fn() cria uma função simulada do zero.
  
		  mockReturnValue(10):
		  Determina que essa função sempre retorne 10.
  
		  addMock(5, 5):
		  Executa a função simulada, mas não realiza uma soma real.
  
		  O resultado será 10 porque foi definido manualmente.
  
		  Esse tipo de Mock é útil quando queremos simular
		  uma dependência que ainda não foi implementada ou
		  que não queremos executar durante o teste.
  
		  Também conseguimos verificar:
		  - Quantas vezes a função foi chamada.
		  - Quais argumentos foram enviados.
	  */
	it("Como o Mock puro funciona", () => {
		const addMock = vi.fn().mockReturnValue(10);
		
		const result = addMock(5, 5);
		
		expect(result).toBe(10);
		expect(addMock).toHaveBeenCalledOnce();
		expect(addMock).toHaveBeenCalledWith(5, 5);
	});
	
	/*
		  TESTE 5 - MOCKCLEAR()
  
		  O mockClear() limpa o histórico de chamadas do Spy.
  
		  IMPORTANTE:
		  Ele NÃO remove o comportamento personalizado da função.
  
		  Exemplo:
  
		  1. Chamamos add(2, 3).
		  2. O Spy registra uma chamada.
		  3. Executamos mockClear().
		  4. O histórico de chamadas é zerado.
		  5. Chamamos add(5, 5).
		  6. O Spy registra uma nova chamada.
  
		  Por isso, o toHaveBeenCalledOnce() funciona novamente:
		  estamos contando apenas as chamadas realizadas depois
		  da limpeza do histórico.
  
		  O comportamento original da função continua ativo,
		  pois não definimos nenhum mockReturnValue().
	  */
	it("Limpando o estado do Spy com mockClear()", () => {
		const spy = vi.spyOn(calculator, "add");
		
		const result = calculator.add(2, 3);
		
		expect(result).toBe(5);
		expect(spy).toHaveBeenCalledOnce();
		
		spy.mockClear();
		
		const result2 = calculator.add(5, 5);
		
		expect(result2).toBe(10);
		
		// O histórico foi zerado, então existe apenas uma chamada.
		expect(spy).toHaveBeenCalledOnce();
	});
	
	/*
		  TESTE 6 - MOCKRESET()
  
		  O mockReset() faz duas coisas:
  
		  1. Limpa o histórico de chamadas.
		  2. Remove a implementação personalizada do Mock.
  
		  Neste exemplo:
  
		  1. Criamos um Spy sobre calculator.add.
		  2. Definimos que ele retorne 10.
		  3. Chamamos add(2, 3), recebendo 10.
		  4. Executamos mockReset().
		  5. O comportamento personalizado é removido.
		  6. Chamamos add(2, 3) novamente.
  
		  Como o método original de um Spy continua existindo,
		  a soma real volta a ser executada e retorna 5.
  
		  ATENÇÃO:
		  mockReset() NÃO restaura a implementação original
		  de forma geral para qualquer função mockada.
  
		  No caso de vi.fn(), por exemplo, a implementação volta
		  ao comportamento padrão de uma função mock vazia,
		  que retorna undefined.
	  */
	it("Mostrando como o mockReset() funciona para Spies", () => {
		const spy = vi.spyOn(calculator, "add");
		
		spy.mockReturnValue(10);
		
		const result = calculator.add(2, 3);
		
		expect(result).toBe(10);
		expect(spy).toHaveBeenCalledOnce();
		
		spy.mockReset();
		
		const result2 = calculator.add(2, 3);
		
		expect(result2).toBe(5);
		expect(spy).toHaveBeenCalledOnce();
	});
	
	/*
		  TESTE 7 - MOCKRESTORE()
  
		  O mockRestore() restaura o método original do objeto,
		  removendo a instrumentação criada pelo Spy.
  
		  Neste exemplo:
  
		  1. Criamos um Spy sobre calculator.add.
		  2. Alteramos seu retorno para 10.
		  3. Chamamos add(5, 5), recebendo 10.
		  4. Executamos mockRestore().
		  5. O método original é restaurado.
		  6. Chamamos add(3, 2), recebendo 5.
  
		  DIFERENÇA IMPORTANTE:
  
		  Depois de mockRestore(), a propriedade calculator.add
		  volta a apontar para a implementação original.
  
		  Isso significa que o Spy deixou de monitorar o método.
  
		  Por esse motivo, o contador de chamadas do Spy
		  permanece zerado após a restauração.
  
		  OBS: mockRestore() é especialmente importante para Spy.
		  Para funções criadas com vi.fn(), utilize mockReset()
		  ou outras operações adequadas ao comportamento desejado.
	  */
	it("Mostrando como o mockRestore() funciona para Spies", () => {
		const spy = vi.spyOn(calculator, "add");
		
		spy.mockReturnValue(10);
		
		const result = calculator.add(5, 5);
		
		expect(result).toBe(10);
		expect(spy).toHaveBeenCalledOnce();
		
		spy.mockRestore();
		
		const result2 = calculator.add(3, 2);
		
		expect(result2).toBe(5);
		
		// O método original foi restaurado.
		// A chamada posterior não é mais registrada pelo Spy.
		expect(spy).toHaveBeenCalledTimes(0);
	});
});