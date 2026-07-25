import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranscreverService } from '../transcrever.service';

@Component({
	selector: 'app-escrita',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './escrita.component.html',
	styleUrls: ['./escrita.component.css']
})
export class EscritaComponent {
	textoEntrada: string = '';
	textoSaida: string = '';

	caracteres: string[] = ['Č','č','Ł','ł','Ň','ň','Š','š','Ž','ž'];

	constructor(private _syllabarizer: TranscreverService) { }

	inserirCaractere(c : string): void {
		const element = $('#entrada');
		const caretPos = (element[0] as any).selectionStart;
		const textAreaTxt = element.val() as string;
		const txtToAdd = c;

		element.val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos)).focus();
	}

	transcrever(): void {
		let entrada = this.textoEntrada.toLowerCase(),
			entradaLinhas : string[] = [],
			saidaLinhas : string[] = [];

		entradaLinhas = entrada.split('\n').map((li) => li.trim());

		for (let x = 0; x < entradaLinhas.length; x++) {
			let linha = entradaLinhas[x];
			let palavras = linha.split(/[^a-zîčğǧňšžł]+/),
				palavrasRes : string[] = [];
			
			for (let p = 0; p < palavras.length; p++) {
				palavrasRes.push(this._syllabarizer.silabasComoImagens(palavras[p]));
			}

			saidaLinhas.push(palavrasRes.join(' '));
		}
		
		this.textoSaida = saidaLinhas.join('<br>');
	}
}
