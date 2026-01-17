import { CommonModule } from '@angular/common';
import { Component, inject, input, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EncuestaDbService } from '../../../../core/encuesta-db';
import { Encuesta } from '../../../../core/interfaces/encuesta.model';
import { LoadingService } from '../../../../core/loading';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuesta.html',
  imports: [CommonModule, RouterModule],
  styleUrls: ['./encuesta.scss'],
})
export class EncuestasComponent {
  hasEntered = input<boolean>(false);
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
      videoPreview: 'assets/nuevo_banner.mp4',
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
