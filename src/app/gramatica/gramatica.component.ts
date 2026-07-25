import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterEvent } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
	selector: 'app-gramatica',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './gramatica.component.html',
	styleUrls: ['./gramatica.component.css']
})
export class GramaticaComponent {
	conteudoHtml!: SafeHtml;

	private _http = inject(HttpClient);
	private _activatedRoute = inject(ActivatedRoute);
	private _topicos : any = [];

	constructor(private _sanitizer: DomSanitizer) {
		this._http.get('assets/json/fushi-doclist.json').subscribe(
			(response) => {
				this._topicos = response;
				this._carregarRota();
			}
		);
	}

	private _carregarRota(): void {
		// Access route parameters
		this._activatedRoute.params.subscribe((params) => {
			let assunto = params['subject'];

			for (let item of this._topicos) {
				if (item.type) if (item.type == "content") if (item.topic) if (item.topic == "grammar") if (item.id == assunto) if (item.asset != false) {
					this._carregarDocumento(item.asset);
					return;
				}
			}

			this._carregarDocumento('assets/html/not-found.html');
		});
	}

	private _carregarDocumento(asset: string): void {
		this._http.get(asset, {responseType:'text'}).subscribe(
			(response) => {
				this.conteudoHtml = this._sanitizer.bypassSecurityTrustHtml(response);
			}
		)
	}
}
