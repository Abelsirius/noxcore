import { CommonModule } from '@angular/common';
import { Component, inject, input, signal, WritableSignal, Input, ChangeDetectionStrategy } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EncuestasComponent {
  hasEntered = input<boolean>(false);

  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() video: string = '';
  @Input() showcaseImages: string[] = [];
  @Input() accentColor: string = 'red-600';
  @Input() forceMuted: boolean = false;
  @Input() backgroundImage: string = '';

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

    // If no manual inputs provided, use defaults (compatibility)
    if (!this.title) this.title = 'NIGHTFALL COMPRESSION LONGSLEEVE';
    if (!this.subtitle) this.subtitle = 'BLACK FRIDAY COLLECTION';
    if (!this.video) this.video = 'assets/nuevo_banner.mp4';
    if (!this.showcaseImages || this.showcaseImages.length === 0) {
      this.showcaseImages = [
        '../../../assets/nightfall_model_1.png',
        '../../../assets/nightfall_model_2.png',
        '../../../assets/nightfall_model_3.png',
        '../../../assets/nightfall_model_4.png',
        '../../../assets/nightfall_model_5.png',
        '../../../assets/nightfall_model_6.png',
        '../../../assets/nightfall_model_7.png',
      ];
    }

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
