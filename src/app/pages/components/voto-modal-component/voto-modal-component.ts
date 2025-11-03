import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-voto-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
  <div class="bg-gray-950 p-6  shadow shadow-red-900/10 text-white " id="encuesta">
      
      <!-- Título Minimalista: Letras más finas y acento sutil -->
      <h2 class="text-2xl font-light text-red-500 mb-2 pb-2 tracking-widest uppercase">
        NOXCORE 
      </h2>
      
      <!-- Mensaje Profesional -->
      <p class="text-md font-normal mb-6 text-gray-400">
        Bienvenido. Su participación para el lanzamiento  de la **próxima Drop**. Vote a continuación.
      </p>

      <div mat-dialog-actions class="flex justify-end pt-4 border-t border-gray-800">
        <!-- Botón Minimalista: Sin sombra excesiva y con estilo hover suave -->
         <div class="flex items-center justify-center gap-3">
                  <button 
          (click)="scrollToCollection()"
          class="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-3 rounded-md 
                 transition-colors duration-200 shadow-md shadow-red-900/30
                 uppercase tracking-wide text-sm w-full"
        >
          Acceder a la Votación
        </button>
                <button 
          (click)="dialogRef.close()"
          class="bg-white text-black font-semibold py-2 px-5 rounded-md 
                 transition-colors duration-200 shadow-md shadow-red-900/30
                 uppercase tracking-wide text-sm w-fit"
        >
          No
        </button>
         </div>
      </div>
    </div>
  `,
  // Estilos básicos para el diálogo, aunque se usa mat-dialog-container para estilos de Angular Material
  styles: [
    `
      /* Se usan estilos de Tailwind en el template, pero este se mantiene por convención */
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotoModalComponent {
  // Inyectar MatDialogRef para poder cerrar el modal desde dentro del componente
  public dialogRef = inject(MatDialogRef<VotoModalComponent>);

    scrollToCollection() {
    this.dialogRef.close(true)
  }
}
