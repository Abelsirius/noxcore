import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EncuestaDbService } from '../../../../core/encuesta-db';
import { Encuesta } from '../../../../core/interfaces/encuesta.model';
import { LoadingService } from '../../../../core/loading';

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuesta.html',
  imports: [CommonModule],
  styleUrls: ['./encuesta.scss'],
})
export class EncuestasComponent {
  encuestas: Encuesta[] = [];
  userId!: string;
  public loadingService = inject(LoadingService);
  constructor(private encuestaDb: EncuestaDbService) { }
  loading: WritableSignal<boolean> = signal(true);
  async ngOnInit() {
    this.userId = this.getUserId();

    // 🔥 Carga encuestas desde Firebase (DESACTIVADO POR EL MOMENTO)
    // this.encuestas = await this.encuestaDb.obtenerEncuestas();

    // 🛑 HARDCODED: Solo mostrar Nighfall Compression Longsleeve
    this.encuestas = [{
      productoId: 999, // ID temporal
      nombre: 'Nighfall Compression Longsleeve',
      voto: 0,
      edad: 0,
      opinion: '',
      userId: this.userId,
      imagen: 'assets/nighfall_compression_longsleeve.png',
      comentarios: [],
      likedUsers: [],
    }];

    console.log('Encuesta hardcoded cargada:', this.encuestas);

    this.loading.set(false);
  }

  /** Genera o recupera un ID único por dispositivo */
  private getUserId(): string {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem('userId', userId);
    }
    return userId;
  }
}