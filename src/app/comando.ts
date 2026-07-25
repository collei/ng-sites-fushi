export class Comando {
	alvo : string;
	mensagem : string;
	dados: any;
	
	constructor(alvo: string, mensagem: string, dados: any = {}) {
		this.alvo = alvo;
		this.mensagem = mensagem;
		this.dados = dados;
	}
}
