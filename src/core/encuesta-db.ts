import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, updateDoc, doc, getDocs } from '@angular/fire/firestore';
import { Encuesta } from './interfaces/encuesta.model';

@Injectable({ providedIn: 'root' })
export class EncuestaDbService {
  private firestore = inject(Firestore);
  private colRef = collection(this.firestore, 'encuestas');

  async obtenerEncuestas(): Promise<Encuesta[]> {
    const snapshot = await getDocs(this.colRef);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Encuesta));
  }

  async guardarEncuesta(encuesta: Omit<Encuesta, 'id'>) {
    await addDoc(this.colRef, encuesta);
  }

  async toggleLike(id: string, userId: string) {
    const docs = await getDocs(this.colRef);
    const ref = docs.docs.find((d) => d.id === id);
    if (!ref) return;

    const encuesta = ref.data() as Encuesta;
    encuesta.likedUsers ??= [];

    const idx = encuesta.likedUsers.indexOf(userId);
    if (idx >= 0) encuesta.likedUsers.splice(idx, 1);
    else encuesta.likedUsers.push(userId);

    await updateDoc(doc(this.firestore, `encuestas/${id}`), {
      likedUsers: encuesta.likedUsers,
    });
  }

  async agregarComentario(id: string, comentario: string) {
    const docs = await getDocs(this.colRef);
    const ref = docs.docs.find((d) => d.id === id);
    if (!ref) return;

    const encuesta = ref.data() as Encuesta;
    encuesta.comentarios ??= [];
    encuesta.comentarios.push({
      texto: comentario,
      fecha: new Date().toISOString(),
    });

    await updateDoc(doc(this.firestore, `encuestas/${id}`), {
      comentarios: encuesta.comentarios,
    });
  }
}
