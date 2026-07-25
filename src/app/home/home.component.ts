import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  conteudoHtml!: SafeHtml;

  constructor(private _http: HttpClient, private _sanitizer: DomSanitizer) {
		this._http.get('assets/html/index.html', {responseType:'text'}).subscribe(
			(response) => {
				this.conteudoHtml = this._sanitizer.bypassSecurityTrustHtml(response);
			}
		)
  }
}
