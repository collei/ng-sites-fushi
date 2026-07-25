import { Component, OnInit, inject, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from "@angular/router";
import { DataService } from '../data.service';
import { on } from '../searcher';

@Component({
  selector: 'app-dicionario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dicionario.component.html',
  styleUrls: ['./dicionario.component.css']
})
export class DicionarioComponent implements OnInit {
	private _activatedRoute = inject(ActivatedRoute);
	
	private dic : any = {
		fushi: {},
		portuguese: {}
	};
	private dic_indice : any = {
		a: 'aáãâ',
		b: 'b',
		c: 'cč',
		d: 'd',
		e: 'eéê',
		f: 'f',
		g: 'g',
		h: 'h',
		i: 'ií',
		j: 'j',
		k: 'k',
		l: 'lł',
		m: 'm',
		n: 'nň',
		o: 'oóô',
		p: 'p',
		q: 'q',
		r: 'r',
		s: 'sš',
		t: 't',
		u: 'uú',
		v: 'v',
		w: 'w',
		x: 'x',
		y: 'y',
		z: 'zž'
	};

	dic_lingua : any = '';
	dic_palavra : any = '';
	dic_letra : any = 'a';
	dic_secao : any = [];

	dic_search_results : any = {
		fushi: [],
		portuguese: []
	};
	
	constructor(private _http: HttpClient, private _dataService: DataService) {
		// Access route parameters
		this._activatedRoute.params.subscribe((params) => {
			let letra = params['letra'];
			let lingua = params['lingua'];

			this.dic_lingua = lingua ? lingua.toLowerCase() : 'fushi';

			if (letra) {
				letra = letra.toLowerCase();
				//
				if (letra.length > 1) {
					this.dic_palavra = letra;
					this.dic_letra = letra.charAt(0);
				} else {
					this.dic_palavra = '';
					this.dic_letra = letra;
				}
			}
		});
	}

	conjugar(termo : string, tipo : string) : void {
		let dados = {
			termo: termo,
			tipo: tipo
		};
		this._dataService.sendMessage('conjugador', '', dados);
	}
	
	ngOnInit(): void {
		this._http.get('assets/json/fushi-dic.json').subscribe({
			next: (response) => {
				this.dic.fushi = response;
				this.exibirSecao(this.dic_letra);
			},
			error: (error) => console.error('Erro ao carregar o arquivo JSON:', error)
		});
		this._http.get('assets/json/fushi-dic-portuguese.json').subscribe({
			next: (response) => {
				this.dic.portuguese = response;
				this.exibirSecao(this.dic_letra);
			},
			error: (error) => console.error('Erro ao carregar o arquivo JSON:', error)
		});
		this._activatedRoute.paramMap.subscribe(params => {
			this.dic_letra = params.get('letra');
			this.dic_lingua = params.get('lingua');
			// Do more processing here if needed
			this.exibirSecao(this.dic_letra);
		});
	}

	exibirSecao(letra : any): void {
		if (('search' == this.dic_lingua) && ('' != this.dic_palavra)) {
			const toIndex = (x:any) => x.index;
			const toSort = (a:any,b:any) => b.relevance - a.relevance;

			let fushi_entries = on(this.dic.fushi).search(this.dic_palavra),
				portuguese_entries = on(this.dic.portuguese).search(this.dic_palavra);

			fushi_entries.sort(toSort);
			portuguese_entries.sort(toSort);

			fushi_entries = fushi_entries.map(toIndex);
			portuguese_entries = portuguese_entries.map(toIndex);

			let fushi_ids = new Set(fushi_entries),
				portuguese_ids = new Set(portuguese_entries);

			this.dic_search_results.fushi = [];
			this.dic_search_results.portuguese = [];

			for (let x of fushi_ids) {
				this.dic_search_results.fushi.push(this.dic.fushi[x]);
			}

			for (let x of portuguese_ids) {
				this.dic_search_results.portuguese.push(this.dic.portuguese[x]);
			}

			return;
		}

		let letra_chave = this.dic_indice[letra],
			letra_length = 0;

		if (letra_chave) {
			letra_length = letra_chave.length;
		}
		
		if (letra_length <= 0) return;
		
		if ('portuguese'==this.dic_lingua) {
			if (Array.isArray(this.dic.portuguese))
				this.dic_secao = this.dic.portuguese.filter(function(it : any) {
					for (let n=0; n<letra_length; n++) {
						if (letra_chave.charAt(n)===it.entry.charAt(0)) {
							return true;
						}
					}
					//
					return false;
				});
		} else if ('fushi'==this.dic_lingua) {
			if (Array.isArray(this.dic.fushi))
				this.dic_secao = this.dic.fushi.filter(function(it : any) {
					for (let n=0; n<letra_length; n++) {
						if (letra_chave.charAt(n)===it.entry.charAt(0)) {
							return true;
						}
					}
					//
					return false;
				});
		}

		if (this.dic_palavra) {
			let palavra = this.dic_palavra;
			setTimeout(function(){
				$(('#' + palavra))[0].scrollIntoView();
			}, 1000);
		}
	}
}
