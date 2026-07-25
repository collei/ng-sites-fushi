import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConjugarService } from '../conjugar.service';
import { DataService } from '../data.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-conjugador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './conjugador.component.html',
  styleUrls: ['./conjugador.component.css']
})
export class ConjugadorComponent implements OnInit, OnDestroy {
	tabela : any = {
		termo: '',
		tipo: '',
		tabela: []
	};
	
	private _termo : string = '';
	private _tipo : string = '';
	private _timer : any;
	
	getFiniteItens(tempo: string, natureza: string, voz: string = 'active') {
		return this.tabela.tabela.filter((p: any) => p.tipo==='finite' && p.tempo===tempo && p.natureza===natureza && p.voz===voz);
	}
	
	getImperativeItens(natureza: string) {
		return this.tabela.tabela.filter((p: any) => p.tipo==='imperative' && p.natureza===natureza);
	}
	
	getParticipleItens(tempo: string) {
		return this.tabela.tabela.filter((p: any) => p.tipo==='participle' && p.tempo===tempo);
	}

	getVozes() {
		return [
			{ tipo: 'active', nome: 'Ativa', participio: 'Ativo' },
			{ tipo: 'passive', nome: 'Passiva', participio: 'Passivo' },
			{ tipo: 'medial', nome: 'Média', participio: 'Médio' },
		];
	}

	getCasos() {
		return [
			{ tipo: 'nominative', nome: 'Nominativo' },
			{ tipo: 'accusative', nome: 'Acusativo' },
			{ tipo: 'genitive', nome: 'Genitivo' },
			{ tipo: 'dative', nome: 'Dativo' },
			{ tipo: 'ablative', nome: 'Ablativo' },
			{ tipo: 'locative', nome: 'Locativo' },
			{ tipo: 'instrumental', nome: 'Instrumental' },
			{ tipo: 'partitive', nome: 'Partitivo' },
			{ tipo: 'abessive', nome: 'Abessivo' },
			{ tipo: 'comitative', nome: 'Comitativo' },
			{ tipo: 'terminative', nome: 'Terminativo' }
		];
	}

	getDeclinacoes(caso: string, numeros: string[] = []) {
		return this.tabela.tabela.filter((p: any) => p.caso===caso && (numeros.includes(p.numero) || numeros.length===0));
	}

	getPossessivos(pessoa: string, numeros: string[] = []) {
		return this.tabela.tabela.filter((p: any) => p.caso==='possessive' && p.pessoa===pessoa && (numeros.includes(p.numero) || numeros.length===0));
	}

	getGraus() {
		return [
			{ tipo: 'absolute', nome: 'Absoluto' },
			{ tipo: 'comparative', nome: 'Comparativo' },
			{ tipo: 'superlative', nome: 'Superlativo' },
			{ tipo: 'equitative', nome: 'Equitativo' }
		];
	}

	getFlexoesAdjetivo(tempo: string, modo: string, grau: string) {
		return this.tabela.tabela.filter((p: any) => p.tempo===tempo && p.modo===modo && p.grau===grau);
	}
	
	constructor(private inflector: ConjugarService, private dataService: DataService, private _ref: ChangeDetectorRef) { } // Inject the service

	conjugarAgora(): void {
		this._termo = this.tabela.termo;
		this._tipo = this.tabela.tipo;
		//
		this.tabela = this.inflector.conjugar(this._termo, this._tipo);
	}

	limparConjugacao(): void {
		this._termo = '';
		this._tipo = '';
		this.tabela.termo = '';
		this.tabela.tipo = '';
		this.tabela = [];
	}

	ngOnInit(): void {
		this.dataService.currentMessage.subscribe(message => {
			if ('conjugador' === message.alvo) {
				this._termo = message.dados.termo;
				this._tipo = message.dados.tipo;
				//
				this.tabela = this.inflector.conjugar(this._termo, this._tipo);
			}
		});
		
		this._timer = window.setInterval(() => this._detectChangeWhenChanged(), 750);
	}

	ngOnDestroy(): void {
		window.clearInterval(this._timer);
	}

	private _detectChangeWhenChanged(): void {
		let changed = (this.tabela.termo != $('#conjugadorTermo').val())
					|| (this.tabela.tipo != $('#conjugadorTipo').val());
		
		if (changed) {
			this.tabela.termo = $('#conjugadorTermo').val();
			this.tabela.tipo = $('#conjugadorTipo').val();
			this._ref.detectChanges();
			this.conjugarAgora();
		}
	}
}
