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

  // Countdown properties
  targetDate: Date = new Date('2026-01-15T00:00:00');
  days: WritableSignal<number> = signal(0);
  hours: WritableSignal<number> = signal(0);
  minutes: WritableSignal<number> = signal(0);
  seconds: WritableSignal<number> = signal(0);
  private timerInterval: any;

  constructor(private encuestaDb: EncuestaDbService) {

  }

  async ngOnInit() {
    this.userId = this.getUserId();

    // Start countdown
    this.startCountdown();

    // 🔥 Carga encuestas desde Firebase (DESACTIVADO POR EL MOMENTO) (DESACTIVADO POR EL MOMENTO)
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

  private startCountdown() {
    this.updateTime();
    this.timerInterval = setInterval(() => {
      this.updateTime();
    }, 100);
  }

  private updateTime() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      this.days.set(0);
      this.hours.set(0);
      this.minutes.set(0);
      this.seconds.set(0);
      clearInterval(this.timerInterval);
    } else {
      this.days.set(Math.floor(distance / (1000 * 60 * 60 * 24)));
      this.hours.set(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      this.minutes.set(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      this.seconds.set(Math.floor((distance % (1000 * 60)) / 1000));
    }
  }

  ngOnDestroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}