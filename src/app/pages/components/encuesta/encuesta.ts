import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal, OnInit, OnDestroy } from '@angular/core';
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
export class EncuestasComponent implements OnInit, OnDestroy {
  encuestas: Encuesta[] = [];
  userId!: string;
  public loadingService = inject(LoadingService);
  loading: WritableSignal<boolean> = signal(true);

  // Countdown State
  targetDate: Date = new Date('2026-01-20T00:00:00'); // Set a target date
  timeRemaining: WritableSignal<{ days: number, hours: number, minutes: number, seconds: number }> = signal({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  private intervalId: any;

  constructor(private encuestaDb: EncuestaDbService) {

  }

  async ngOnInit() {
    this.userId = this.getUserId();

    // Start Countdown
    this.startTimer();

    this.loading.set(false);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startTimer() {
    this.updateTime();
    this.intervalId = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  updateTime() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      this.timeRemaining.set({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      clearInterval(this.intervalId);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.timeRemaining.set({ days, hours, minutes, seconds });
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
