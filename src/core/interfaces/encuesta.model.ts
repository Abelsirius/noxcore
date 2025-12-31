export interface Encuesta {
  id?: string;
  productoId: number;
  nombre: string;
  voto: number;
  edad: number;
  opinion: string;
  userId: string;
  imagen: string;
  videoPreview?: string;
  comentarios: { texto: string; fecha: string }[];
  likedUsers: string[];
}