import { CommonModule } from '@angular/common';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { EncuestaDbService } from '../../../../core/encuesta-db';
import { Encuesta } from '../../../../core/interfaces/encuesta.model';
import { LoadingService } from '../../../../core/loading';

interface Producto {
  id: number;
  name: string;
  descripcion: string;
  image: string;
  likes: number;
  liked?: boolean;
  comentario?: string;
  showComment?: boolean;
}

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuesta.html',
  imports: [FormsModule,CommonModule,MatIcon,ReactiveFormsModule],
  styleUrls: ['./encuesta.scss'],
})
export class EncuestasComponent {
     encuestas: Encuesta[] = [];
  form!: FormGroup;
  userId!: string;
 public loadingService = inject(LoadingService);
  constructor(private encuestaDb: EncuestaDbService, private fb: FormBuilder) {}
loading: WritableSignal<boolean> = signal(true);
  async ngOnInit() {
    this.userId = this.getUserId();
    this.form = this.fb.group({ comentario: [''] });

    // 🔥 Carga encuestas desde Firebase
    this.encuestas = await this.encuestaDb.obtenerEncuestas();
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

  /** 🔥 Dar like (solo uno por usuario/dispositivo) */
async like(encuesta: Encuesta) {
    // 1. **Optimista: Aplicar el cambio de UI inmediatamente (Antes de la llamada a Firebase)**
    this.loadingService.show()
    // 1.1. Buscar la encuesta específica en tu arreglo local 'this.encuestas'
    const index = this.encuestas.findIndex(item => item.id === encuesta.id);
    
    if (index !== -1) {
        // 1.2. Obtener una referencia a la encuesta (para mutarla)
        const encuestaLocal = this.encuestas[index];
        
        // 1.3. Determinar si el usuario ya le dio like
        const yaTieneLike = encuestaLocal.likedUsers?.includes(this.userId);
        
        // 1.4. Aplicar el cambio localmente
        if (yaTieneLike) {
            // Si ya tenía like, lo quitamos
            encuestaLocal.likedUsers = encuestaLocal.likedUsers.filter(id => id !== this.userId);
        } else {
            // Si no tenía like, lo agregamos
            if (!encuestaLocal.likedUsers) {
                encuestaLocal.likedUsers = [];
            }
            encuestaLocal.likedUsers.push(this.userId);
        }

        // El componente detectará el cambio y el botón cambiará inmediatamente a '💙 Me gusta' o '🤍 Like'.
    }


    // 2. **Llamar al servicio de base de datos (Operación Asíncrona)**
    try {
        await this.encuestaDb.toggleLike(encuesta.id!, this.userId);
         this.loadingService.hide(); 
        // Opcional, solo si quieres sincronizar otros datos:
        // this.encuestas = await this.encuestaDb.obtenerEncuestas();
        
    } catch (error) {
        // 3. **Manejo de Errores: Revertir la UI si la llamada a Firebase falla**
        console.error("Error al actualizar el like en Firebase:", error);
        
        // Para una reversión real, deberías implementar una lógica para deshacer el cambio local
        // que hiciste en el paso 1, o simplemente recargar la lista de encuestas.
        this.encuestas = await this.encuestaDb.obtenerEncuestas(); 
    }
    
    // **Importante:** Elimina esta línea si no necesitas recargar toda la lista:
    // this.encuestas = await this.encuestaDb.obtenerEncuestas();
}

  /** 💬 Agregar comentario */
  async comentar(encuesta: Encuesta) {
    const texto = this.form.value.comentario?.trim();
    if (!texto) return;
        this.loadingService.show(); // MOSTRAR LOADING

    await this.encuestaDb.agregarComentario(encuesta.id!, texto);
    this.form.reset();
    this.encuestas = await this.encuestaDb.obtenerEncuestas();


        this.loadingService.hide();
  }
}