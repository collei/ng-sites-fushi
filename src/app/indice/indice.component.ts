import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-indice',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './indice.component.html',
  styleUrls: ['./indice.component.css']
})
export class IndiceComponent {
	indice_fushi : any = [
		'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','r','s','t','u','v','y','z'
	];
	indice_portuguese : any = [
		'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
	];
	indice_topicos : any = [];

	dicbusca: string = '';

	getTopico(s: string) : any {
		return this.indice_topicos.filter((x: any) => x.topic == s);
	}

	dicBusca() : string {
		return "/dic/search/" + this.dicbusca;
	}

	constructor(private _http: HttpClient) {
		this._http.get('assets/json/fushi-doclist.json').subscribe(
			(response) => {
				this.indice_topicos = response;
			}
		)
	}
}
