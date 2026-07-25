import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { GramaticaComponent } from './gramatica/gramatica.component';
import { DicionarioComponent } from './dicionario/dicionario.component';
import { EscritaComponent } from './escrita/escrita.component';
import { ConteudosComponent } from './conteudos/conteudos.component';

export const routes: Routes = [
	{ path: 'dic/:lingua/:letra', pathMatch: 'full', component: DicionarioComponent },
	{ path: 'grammar/:subject', pathMatch: 'full', component: GramaticaComponent },
	{ path: 'contents/:subject', pathMatch: 'full', component: ConteudosComponent },
	{ path: 'writing', component: EscritaComponent },
	{ path: '**', component: HomeComponent }
];
