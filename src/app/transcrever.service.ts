import { Injectable } from '@angular/core';
import { FushiString } from './fushistring';
import { FushiWriting } from './fushiwriting';

@Injectable({
	providedIn: 'root'
})
export class TranscreverService {
	private _syllabarizer: FushiString;
	private _writer: FushiWriting

	constructor() {
		this._syllabarizer = new FushiString();
		this._writer = new FushiWriting();
	}

	separarSilabas(termo: string, separador: string = ''): any {
		return this._syllabarizer.syllablesOf(termo, separador);
	}

	silabasComoImagens(termo: string, separador: string = ''): string {
		let silabas: string[] = this._syllabarizer.syllablesAsArray(termo);
		return this._writer.syllablesToImageTags(silabas, separador);
	}
}
