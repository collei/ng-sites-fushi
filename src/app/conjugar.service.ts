import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
	providedIn: 'root'
})
export class ConjugarService {
	private _paradigma: any = {};
	private _termo = {
		tipo: 'verb',
		valor: 'eda'
	};

	/**
	 * Inicializa o serviço conjugador.
	 * @param _http : HttpClient - cliente HTTP para carregar o paradigma desde os assets json.
	 */
	constructor(private _http: HttpClient) {
		this._http.get('assets/json/fushi-paradigm.json').subscribe({
			next: (response) => this._paradigma = response,
			error: (error) => console.error('Erro ao carregar o arquivo JSON:', error)
		});
	};
	
	/**
	 * Flexiona um verbo, adjetivo ou substantivo.
	 * @param termo : string - termo a ser flexionado.
	 * @param tipoTermo : string - tipo do termo (deveria ser um destes três: 'verb', 'adjective', 'noun').
	 * @returns TabelaConjugacao - a tabela de conjugação.
	 */
	conjugar(termo : string, tipoTermo : string) {
		if ('' === termo) {
			return { termo: '', tipo: tipoTermo, tabela: [] } as TabelaConjugacao;
		}
		//
		if ('verb' === tipoTermo) return {
			termo: termo,
			tipo: tipoTermo,
			tabela: this._conjugarVerbo(termo)
		} as TabelaConjugacao;
		if ('adjective' === tipoTermo) return {
			termo: termo,
			tipo: tipoTermo,
			tabela: this._conjugarAdjetivo(termo)
		} as TabelaConjugacao;
		if ('noun' === tipoTermo) return {
			termo: termo,
			tipo: tipoTermo,
			tabela: this._declinarSubstantivo(termo)
		} as TabelaConjugacao;
		//
		return { termo: termo, tipo: '', tabela: [] } as TabelaConjugacao;
	};
	
	/**
	 * Conjuga um verbo.
	 * @param verbo : string - Verbo a ser conjugado. Deve estar no infinitivo (-da)
	 * @returns FormaVerbal[] - a tabela de conjugação do verbo.
	 */
	private _conjugarVerbo(verbo : string) {
		let tempos = ['imperfect','perfect'],
			naturezas = ['indefinite','definite'],
			pessoas = ['mi','ti','on','biz','tiz','onk'],
			vozes = ['active','medial','passive'],
			harmonia = '',
			vocalizado = true,
			verbo_raiz = '',
			paradigmas = [],
			tabela: FormaVerbal[] = [];

		if (verbo==='') return [];
		
		verbo = verbo.toLowerCase();
		
		if (verbo.slice(-2)!=='da') return [];
		
		verbo_raiz = verbo.substring(0, verbo.length - 2);
		harmonia = this._detectarHarmonia(verbo_raiz);
		vocalizado = ('aeiou'.indexOf(verbo_raiz.slice(-1)) >= 0);

		let verb_paradigm = this._paradigma.find((x:any) => x.type==='verb');
		if (verb_paradigm) {
			paradigmas = verb_paradigm.paradigm.filter((x:any) => x.harmony===harmonia && x.voweled==vocalizado);
		} else {
			throw new Error('Arquivo [fushi-paradigm.json] não possui o paradigma [verb] ou o JSON está mal-formado.');
		}

		for (let v = 0; v < vozes.length; v++) {
			for (let t = 0; t < tempos.length; t++) {
				for (let s = 0; s < naturezas.length; s++) {
					for (let p = 0; p < pessoas.length; p++) {
						let para = paradigmas.find((x:any) => x.type==='finite' && x.tense===tempos[t] && x.nature===naturezas[s]);

						let verbo_forma = (pessoas[p] + ' ' + verbo_raiz + '.' + para.value[p]);

						if ('passive'===vozes[v]) {
							verbo_forma = verbo_forma + '.' + ('aeiîou'.indexOf(verbo_forma.slice(-1)) >= 0 ? 'ri' : 'i' );
						} else if ('medial'===vozes[v]) {
							if ('back'===harmonia) {
								verbo_forma = verbo_forma + '.' + ('aeiîou'.indexOf(verbo_forma.slice(-1)) >= 0 ? 'ror' : 'or' );
							} else if ('front'===harmonia) {
								verbo_forma = verbo_forma + '.' + ('aeiîou'.indexOf(verbo_forma.slice(-1)) >= 0 ? 'rer' : 'er' );
							}
						}
						
						tabela.push({
							tipo: 'finite',
							tempo: tempos[t],
							natureza: naturezas[s],
							voz: vozes[v],
							forma: verbo_forma,
							formaDetalhada: verbo_forma.split('.')
						} as FormaVerbal);
					}
				}
			}
		}

		for (let s = 0; s < naturezas.length; s++) {
			for (let p = 0; p < pessoas.length; p++) {
				let para = paradigmas.find((x:any) => x.type==='imperative' && x.nature===naturezas[s]);
				let verbo_forma = (para.value[p]!=='') ? (pessoas[p] + ' ' + verbo_raiz + '.' + para.value[p]) : '';

				tabela.push({
					tipo: 'imperative',
					tempo: '',
					natureza: naturezas[s],
					voz: '',
					forma: verbo_forma,
					formaDetalhada: verbo_forma.split('.')
				} as FormaVerbal);
			}
		}

		for (let t = 0; t < tempos.length; t++) {
			for (let v = 0; v < vozes.length; v++) {
				let para = paradigmas.find((x:any) => x.type==='participle' && x.tense===tempos[t] && x.voice===vozes[v]);
				let verbo_forma = verbo_raiz + '.' + para.value[0];

				tabela.push({
					tipo: 'participle',
					tempo: tempos[t],
					natureza: '',
					voz: vozes[v],
					forma: verbo_forma,
					formaDetalhada: verbo_forma.split('.')
				} as FormaVerbal);
			}
		}
		
		return tabela;
	};
	
	/**
	 * Flexiona um adjetivo.
	 * @param adjetivo : string - Adjetivo a ser conjugado.
	 * @returns FormaAdjetiva[] - tabela de flexões do adjetivo.
	 */
	private _conjugarAdjetivo(adjetivo : string) {
		let graus = ['absolute','comparative','superlative','equitative'],
			tempos = ['imperfect','perfect'],
			formas = ['positive','negative'],
			adjetivo_raiz = adjetivo,
			harmonia = '',
			pre_vocalizado = true,
			pos_vocalizado = true,
			paradigmas = [],
			tabela: FormaAdjetiva[] = [];

		if (adjetivo==='') return [];

		adjetivo = adjetivo.toLowerCase();

		if ('i'===adjetivo.slice(-1)) {
			adjetivo_raiz = adjetivo.substring(0, adjetivo.length-1);
		}
		
		harmonia = this._detectarHarmonia(adjetivo_raiz);
		pre_vocalizado = ('aeiouy'.indexOf(adjetivo_raiz.charAt(0)) >= 0);
		pos_vocalizado = ('aeiou'.indexOf(adjetivo_raiz.slice(-1)) >= 0);

		let adjective_paradigm = this._paradigma.find((x:any) => x.type==='adjective');
		if (adjective_paradigm) {
			paradigmas = adjective_paradigm.paradigm.filter((x:any) => {
				return x.harmony===harmonia && x.vowel_start===pre_vocalizado && x.vowel_end===pos_vocalizado
			});
		} else {
			throw new Error('Arquivo [fushi-paradigm.json] não possui o paradigma [adjective] ou o JSON está mal-formado.');
		}

		for (let t = 0; t < tempos.length; t++) {
			for (let f = 0; f < formas.length; f++) {
				let para = paradigmas.find((x:any) => x.tense===tempos[t] && x.form===formas[f]);
				let adjetivo_forma_base = (('positive'==formas[f] && 'imperfect'==tempos[t]) ? adjetivo : adjetivo_raiz);

				for (let g = 0; g < graus.length; g++) {
					let adjetivo_forma = para.prefix[g] + '.' + adjetivo_forma_base + '.' + para.suffix[g];
					
					tabela.push({
						tempo: tempos[t],
						modo: formas[f],
						grau: graus[g],
						forma: adjetivo_forma.replaceAll('.',''),
						formaDetalhada: adjetivo_forma.split('.')
					} as FormaAdjetiva);
				}
			}
		}

		return tabela;
	};
	
	/**
	 * Declina um substantivo.
	 * @param substantivo : string - Substantivo a ser declinado.
	 * @returns FormaNominal[] - tabela de declinação do substantivo.
	 */
	private _declinarSubstantivo(substantivo : string) {
		let pessoas = ['mi','ti','on','biz','tiz','onk'],
			numeros = ['singular','dual','trial','plural'],
			casos = ['nominative','accusative','genitive','dative','ablative','locative','instrumental','partitive','abessive','comitative','terminative'],
			harmonia = this._detectarHarmonia(substantivo),
			vocalizado = ('AaEeIiOoUu'.indexOf(substantivo.slice(-1)) >= 0),
			vocalizado_acc = ('AaEeIiOoUuLlŁłRrSsŠšZzŽž'.indexOf(substantivo.slice(-1)) >= 0),
			paradigmas = [],
			elidir_consoante : boolean,
			tabela: FormaNominal[] = [];

		if (substantivo==='') return [];
		
		substantivo = substantivo.toLowerCase();
		elidir_consoante = ['us','um','on'].includes(substantivo.slice(-2));

		let noun_paradigm = this._paradigma.find((x:any) => x.type==='noun');
		if (noun_paradigm) {
			paradigmas = noun_paradigm.paradigm.filter((x:any) => x.harmony===harmonia);
		} else {
			throw new Error('Arquivo [fushi-paradigm.json] não possui o paradigma [noun] ou o JSON está mal-formado.');
		}

		for (let c = 0; c < casos.length; c++) {
			let para = paradigmas.find((x:any) => x.case===casos[c] && x.voweled==vocalizado),
				substantivo_forma = substantivo,
				substantivo_forma_plural = substantivo,
				substantivo_forma_dual = substantivo,
				substantivo_forma_trial = substantivo;

			if ((c > 0) && elidir_consoante) {
				substantivo_forma = substantivo.substring(0, substantivo.length-1);
				vocalizado_acc = true;
				vocalizado = true;
			}

			substantivo_forma = substantivo_forma + '.' + (('accusative'===casos[c] && vocalizado_acc) ? 't' : ('genitive'===casos[c] && vocalizado) ? 'n' : para.value[0]);
			substantivo_forma_plural = this._pluralizar(substantivo_forma, harmonia, 'nominative'!==casos[c]);
			substantivo_forma_dual = substantivo_forma + '.' + (harmonia==='back' ? 'lar' : 'ler');
			substantivo_forma_trial = substantivo_forma + '.' + 'lir';

			tabela.push({
				caso: casos[c],
				numero: 'singular',
				pessoa: '',
				forma: (substantivo_forma+'.').replaceAll('.',''),
				formaDetalhada: (substantivo_forma+'.').split('.')
			} as FormaNominal);

			tabela.push({
				caso: casos[c],
				numero: 'plural',
				pessoa: '',
				forma: substantivo_forma_plural.replaceAll('.',''),
				formaDetalhada: substantivo_forma_plural.split('.')
			} as FormaNominal);

			tabela.push({
				caso: casos[c],
				numero: 'dual',
				pessoa: '',
				forma: substantivo_forma_dual.replaceAll('.',''),
				formaDetalhada: substantivo_forma_dual.split('.')
			} as FormaNominal);

			tabela.push({
				caso: casos[c],
				numero: 'trial',
				pessoa: '',
				forma: substantivo_forma_trial.replaceAll('.',''),
				formaDetalhada: substantivo_forma_trial.split('.')
			} as FormaNominal);
		}

		vocalizado = ('AaEeIiOoUuLlŁłRrSsŠšZzŽž'.indexOf(substantivo.slice(-1)) >= 0);

		for (let n = 0; n < numeros.length; n++) {
			let para = paradigmas.find((x:any) => x.case==='possessive' && x.number===numeros[n] && x.voweled==vocalizado);

			for (let p = 0; p < pessoas.length; p++) {
				let substantivo_forma = substantivo + '.' + para.value[p];

				tabela.push({
					caso: 'possessive',
					numero: numeros[n],
					pessoa: pessoas[p],
					forma: substantivo_forma.replaceAll('.',''),
					formaDetalhada: substantivo_forma.split('.')
				} as FormaNominal);
			}
		}

		return tabela;
	};
	
	/**
	 * Detecta a harmonia vocálica do termo.
	 * @param termo : string - Palavra a ser detectada.
	 * @returns string - 'back' se a última vogal é (a/o/u), 'front' se a última vogal é (e) ou se não houver ao menos um de (a/o/u)
	 */
	private _detectarHarmonia(termo : string): string {
		const len = termo.length,
			vogais_back = 'AOUaou',
			vogais_front = 'Ee';
		
		for (let i = len-1; i>=0; i--) {
			if (vogais_back.indexOf(termo.charAt(i)) >= 0) return 'back';
			if (vogais_front.indexOf(termo.charAt(i)) >= 0) return 'front';
		}
		
		return 'front';
	};

	/**
	 * Pluraliza um substantivo conforme regras de plurais Fushi.
	 * @param substantivo : string - Nome a ser pluralizado.
	 * @param harmonia : string - Harmonia vocálica (deve ser um destes: 'front', 'back')
	 * @param desativarCasosEspeciais : boolean - Desativar plurais especiais
	 * @returns string - o nome pluralizado.
	 */
	private _pluralizar(substantivo : string, harmonia : string, desativarCasosEspeciais : boolean = false): string {
		let substantivo_dotless = substantivo.replaceAll('.','');
		//
		if (desativarCasosEspeciais) {
			switch (substantivo_dotless.slice(-2)) {
				case 'ra':
					return substantivo_dotless.substring(0,substantivo_dotless.length-2) + '..ri';
				case 'ri':
					return substantivo + 'k';
				default:
					return substantivo + (
						('aeiou'.indexOf(substantivo_dotless.slice(-1)) >= 0)
							? '.ra'
							: (('back'===harmonia ? '.o' : '.e') + 'k')
					);
			}
		}
		//
		switch (substantivo_dotless.slice(-2)) {
			case 'us':
				return substantivo_dotless.substring(0,substantivo_dotless.length-2) + '..i';
			case 'um':
			case 'on':
				return substantivo_dotless.substring(0,substantivo_dotless.length-2) + '..a';
			case 'ra':
				return substantivo_dotless.substring(0,substantivo_dotless.length-2) + '..ri';
			case 'ri':
				return substantivo + '.m';
			default:
				return substantivo + (
					('aeiou'.indexOf(substantivo_dotless.slice(-1)) >= 0)
						? '.ra'
						: (('back'===harmonia ? '.o' : '.e') + 'k')
				);
		}
	}
}

export interface FormaTermo {
	forma : string;
	formaDetalhada : string[];
}

export interface TabelaConjugacao {
	termo : string;
	tipo : string;
	tabela : FormaTermo[];
}

export interface FormaVerbal extends FormaTermo {
	tipo : string;
	tempo : string;
	natureza : string;
	voz : string;
	forma : string;
	formaDetalhada : string[];
}

export interface FormaAdjetiva extends FormaTermo {
	tempo : string;
	modo : string;
	grau : string;
	forma : string;
	formaDetalhada : string[];
}

export interface FormaNominal extends FormaTermo {
	caso : string;
	numero : string;
	pessoa : string;
	forma : string;
	formaDetalhada : string[];
}
