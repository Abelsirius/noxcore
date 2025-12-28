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

    // 🔥 Carga encuestas desde Firebase
    this.encuestas = await this.encuestaDb.obtenerEncuestas();

    // 🛑 HACK: Forzar imagen correcta para el producto Vampire Hunter
    this.encuestas = this.encuestas.map(e => {
      const base = { ...e, comentarios: [] };

      if (base.nombre.toLowerCase().includes('vampire hunter')) {
        return {
          ...base,
          nombre: 'Essential Mock neck compression',
          imagen: 'assets/essential_mock_neck.png'
        };
      }
      if (base.nombre.toLowerCase().includes('deathblade oversized pullover hoodie')) {
        return {
          ...base,
          nombre: 'Archangel Quarter-Zip',
          imagen: 'assets/archangel_quarter_zip.png'
        };
      }
      return base;
    });

    // Si no hay encuestas, crea 3 de ejemplo
    if (!this.encuestas.length) {
      const base: Omit<Encuesta, 'id'>[] = [
        {
          productoId: 1,
          nombre: 'Compresora A',
          voto: 10,
          edad: 22,
          opinion: '🔥🔥🔥',
          userId: this.userId,
          imagen: '../../../../assets/encuestas/encuesta1.jpeg',
          comentarios: [],
          likedUsers: [],
        },
        {
          productoId: 2,
          nombre: 'Compresora B',
          voto: 7,
          edad: 19,
          opinion: 'Buena calidad 👕',
          userId: this.userId,
          imagen: '../../../../assets/encuestas/encuesta1.jpeg',
          comentarios: [],
          likedUsers: [],
        },
        {
          productoId: 3,
          nombre: 'Compresora C',
          voto: 4,
          edad: 25,
          opinion: 'Fresca 😎',
          userId: this.userId,
          imagen: '../../../../assets/encuestas/encuesta1.jpeg',
          comentarios: [],
          likedUsers: [],
        },
      ];

      for (const e of base) await this.encuestaDb.guardarEncuesta(e);
      this.encuestas = await this.encuestaDb.obtenerEncuestas();
    }

    console.log('Encuestas cargadas desde Firebase:', this.encuestas);

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