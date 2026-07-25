import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Comando } from './comando';

@Injectable({
	providedIn: 'root'
})
export class DataService {
	private messageSource = new BehaviorSubject<Comando>(new Comando('','',{}));
	currentMessage = this.messageSource.asObservable();

	sendMessage(alvo: string, mensagem: string, dados: any = {}) {
		let comando = new Comando(alvo,mensagem,dados);
		this.messageSource.next(comando);
	}

	constructor() { }
}
