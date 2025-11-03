import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
interface Reels {
  id: string;
  cliente: string;
  videoUrl: string;
  descripcion?: string;
  fecha?: string;
}


@Component({
selector: 'app-reel',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, FormsModule],
 template: `
    <section class="py-16 px-4 bg-black min-h-screen" id="reels-section">
      <div class="container mx-auto max-w-4xl">
        <!-- Título -->
        <div class="text-center mb-10">
          <h2 class="text-4xl font-bold text-white mb-2">✨ CLIENTES EN ACCIÓN</h2>
          <p class="text-gray-400">Mira cómo nuestros clientes lucen sus prendas favoritas</p>
          <div class="w-24 h-1 bg-accent-500 mx-auto mt-4"></div>
        </div>

        <!-- Subida de video -->
        <div class="bg-gray-900 p-6 rounded-2xl mb-12 shadow-lg text-center">
          <h3 class="text-xl text-white mb-4">Sube tu video 📸</h3>
          <input type="file" accept="video/*" (change)="onVideoUpload($event)"
                 class="text-gray-300 file:mr-4 file:py-2 file:px-4 
                        file:rounded-full file:border-0 
                        file:text-sm file:font-semibold 
                        file:bg-accent-500 file:text-white hover:file:bg-accent-600"/>
        </div>

        <!-- Grid de reels -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <mat-card *ngFor="let reel of reels"
                    class="bg-gray-950 text-white overflow-hidden rounded-2xl shadow-lg hover:scale-[1.02] transition-transform duration-300">
            <div class="relative">
              <video [src]="reel.videoUrl" controls playsinline muted loop
                     class="w-full h-[500px] object-cover rounded-t-2xl"></video>

              <div class="absolute bottom-4 left-4 bg-black/60 p-2 rounded">
                <h4 class="font-semibold text-accent-500">@{{ reel.cliente }}</h4>
                <p class="text-xs text-gray-300">{{ reel.descripcion || 'Sin descripción' }}</p>
              </div>
            </div>

            <mat-card-actions class="flex justify-between items-center p-4 bg-gray-900 rounded-b-2xl">
              <button mat-raised-button color="primary" class="bg-accent-500 hover:bg-accent-600 text-white">
                ❤️ Me gusta
              </button>
              <span class="text-gray-400 text-sm">{{ reel.fecha }}</span>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </section>
  `,
  styles: [`
    video::-webkit-media-controls-panel {
      background-color: rgba(0,0,0,0.5);
    }
  `]
})
export class Reel {
  reels: Reels[] = [
    {
      id: '1',
      cliente: 'sofia.m',
      videoUrl: 'assets/reels/demo1.mp4',
      descripcion: 'Conjunto BREATHE Divinity 💜',
      fecha: 'Hace 2 días'
    },
    {
      id: '2',
      cliente: 'andres_fit',
      videoUrl: 'assets/reels/demo2.mp4',
      descripcion: 'Nueva línea UrbanStyle 🖤',
      fecha: 'Hace 5 días'
    }
  ];

  onVideoUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const url = URL.createObjectURL(file);

    this.reels.unshift({
      id: crypto.randomUUID(),
      cliente: 'nuevo_cliente',
      videoUrl: url,
      fecha: 'Ahora mismo'
    });
  }
}
