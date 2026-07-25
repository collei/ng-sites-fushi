import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

import { IndiceComponent } from './indice/indice.component';
import { DicionarioComponent } from './dicionario/dicionario.component';
import { ConjugadorComponent } from './conjugador/conjugador.component';
import { GensImagePasterComponent } from './gensimagepaster/gensimagepaster.component';
import { $ } from 'jquery';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		CommonModule,
		RouterLink,
		RouterOutlet,
		IndiceComponent,
		//DicionarioComponent,
		ConjugadorComponent//,
		//GensImagePasterComponent
	],
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'fushi';
	imagem = '';
	objeto : any = {
		imagem: '',
		descricao: ''
	};
}

(window as any).conjugateVerb = function(verb: string) {
	$('#conjugadorTermo').val(verb).trigger('change');
	$('#conjugadorTipo').val('verb').trigger('change');
};
(window as any).conjugateNoun = function(noun: string) {
	$('#conjugadorTermo').val(noun).trigger('change');
	$('#conjugadorTipo').val('noun').trigger('change');
};
(window as any).conjugateAdjective = function(adjective: string) {
	$('#conjugadorTermo').val(adjective).trigger('change');
	$('#conjugadorTipo').val('adjective').trigger('change');
};

function calcIngestaoAgua(idade: number, peso: number, asLitros: boolean = false) {
    let mll = 40,
        resultado = 0;
    if (idade>17) mll = 35;
    if (idade>55) mll = 30;
    if (idade>65) mll = 25;
    resultado = peso*mll;
    if (asLitros) return resultado/1000.0;
    return resultado;
}
