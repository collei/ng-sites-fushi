import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyRead } from '@angular/compiler';

@Component({
	selector: 'gens-image-paster',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './gensimagepaster.component.html',
	styleUrls: ['./gensimagepaster.component.css']
})
export class GensImagePasterComponent {
	@Input()
	id : string = '';

	@Input()
	name : string = '';

	@Input()
	buttonPosition : string = 'top-right';

	@Input()
	value : string = '';

	@Output()
	valueChange : EventEmitter<string> = new EventEmitter<string>();

	// Evento no textarea para colar uma imagem
	// Pode ser moldado para campo alternartivo (texto/imagem)

	public handlePaste (event: ClipboardEvent) : void {
		let	// imagem que foi colada
			pastedImage = this.getPastedImage(event),
			// objeto para ler os dados da imagem
			reader = new FileReader(),
			// objeto portador do textarea, visor e apagador
			imagePaster = (event.currentTarget as any).parentElement,
			// referência ao componente para uso em closures
			self = this;

		// Faz nada se nenhuma imagem foi colada.
		if (! pastedImage) {
			return;
		}

		// Evento de leitura. Neste ponto, "pastedImage" é um File object.
		// Vamos ler o conteúdo como DataURL, a imagem em forma de
		// uma URL que contém os dados da imagem (base64 encoded). var reader = new FileReader();
		reader.onload = function(event: any) {
			// o conteúdo da imagem, em forma de Data URL 
			let imagedata = event.target.result;
			// Seta e oculta o textarea e exibe a imagem
			$('img', imagePaster).prop('src', imagedata);
			$('textarea', imagePaster).val(imagedata).trigger('change');
			$(imagePaster).attr('data-state', 'Full');
			// Propaga a mudança
			self.valueChange.emit(imagedata);
		};

		// Dispara o Evento de leitura
		reader.readAsDataURL(pastedImage);
	}

	// Evento de clique no apagador (botão vermelho com lixeira) 
	// deve receber o Event para saber a qual paster pertence 
	public removeImage(event: Event): void {
		let	// objeto portador do textarea, visor e apagador
			imagePaster = (event.currentTarget as any).parentElement;
		// Apaga a imagem, limpa e exibe o textarea novamente (CSS)
		$("img", imagePaster).prop('src','');
		$('textarea', imagePaster).val('').trigger('change');
		$(imagePaster).attr('data-state', 'empty');
		// Propaga a mudança
		this.valueChange.emit('');
	}

	// Obtém a imagem colada no evento OnPaste. 
	// Retorna NULL se nada tiver sido colado.
	private getPastedImage(event: ClipboardEvent): File | null {
		// Vamos verificar se alguém tentou colar a imagem no textarea
		if (
			event.clipboardData &&
			event.clipboardData.files &&
			event.clipboardData.files.length &&
			this.isImageFile(event.clipboardData.files[0])
		) {
			return event.clipboardData.files[0];
		}

		return null;
	}

	// Verifica se o tal arquivo é uma imagem // através do Mine-Type.
	private isImageFile(file: File): boolean {
		return (file.type.search(/^image\//i) === 0);
	}
}
