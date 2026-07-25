import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-conteudos',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './conteudos.component.html',
	styleUrls: ['./conteudos.component.css']
})
export class ConteudosComponent {
	conteudoHtml!: SafeHtml;

	private _http = inject(HttpClient);
	private _activatedRoute = inject(ActivatedRoute);
	private _conteudos : any = [];

	constructor(private _sanitizer: DomSanitizer) {
		this._http.get('assets/json/fushi-doclist.json').subscribe(
			(response) => {
				this._conteudos = response;
				this._carregarRota();
			}
		);
	}

	private _carregarRota(): void {
		// Access route parameters
		this._activatedRoute.params.subscribe((params) => {
			let assunto = params['subject'];

			for (let item of this._conteudos) {
				if (item.type) if (item.type == "content") if (item.id == assunto) if (item.asset != false) {
					this._carregarConteudo(item.asset);
					return;
				}
			}

			this._carregarConteudo('assets/html/not-found.html');
		});
	}

	private _carregarConteudo(asset: string): void {
		this._http.get(asset, {responseType:'text'}).subscribe(
			(response) => {
				this.conteudoHtml = this._sanitizer.bypassSecurityTrustHtml(response);
			}
		)
	}
}
