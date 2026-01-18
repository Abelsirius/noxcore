import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal, OnInit, OnDestroy, Input } from '@angular/core';
import { HeroComponent } from '../hero/hero';

@Component({
    selector: 'app-countdown',
    templateUrl: './countdown.html',
    standalone: true,
    imports: [CommonModule, HeroComponent],
    styles: [`
    :host {
      display: block;
    }
    .animate-fade-in {
       animation: fadeIn 1s ease-in;
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
  `]
})
export class CountdownComponent implements OnInit, OnDestroy {
    // Countdown State
    @Input() showTimer = true;
    targetDate: Date = new Date('2026-01-18T00:00:00'); // Set a target date
    timeRemaining: WritableSignal<{ days: number, hours: number, minutes: number, seconds: number }> = signal({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    private intervalId: any;
    loading: WritableSignal<boolean> = signal(true);

    constructor() { }

    ngOnInit() {
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
}
