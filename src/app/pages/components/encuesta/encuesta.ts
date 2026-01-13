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
  loading: WritableSignal<boolean> = signal(true);

  // Long press state management
  private longPressTimer: any;
  private isLongPressActive = false;
  private readonly LONG_PRESS_DURATION = 200; // milliseconds

  constructor(private encuestaDb: EncuestaDbService) {

  }

  async ngOnInit() {
    this.userId = this.getUserId();

    // 🔥 Carga encuestas desde Firebase (DESACTIVADO POR EL MOMENTO)
    // this.encuestas = await this.encuestaDb.obtenerEncuestas();

    // 🛑 HARDCODED: Solo mostrar Nightfall Compression Longsleeve
    this.encuestas = [{
      productoId: 999, // ID temporal
      nombre: 'Nightfall Compression Longsleeve',
      voto: 0,
      edad: 0,
      opinion: '',
      userId: this.userId,
      imagen: 'assets/nighfall_compression_longsleeve.png',
      videoPreview: 'assets/videos_preview/WhatsApp Video 2025-12-30 at 10.09.37 PM.mp4',
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
