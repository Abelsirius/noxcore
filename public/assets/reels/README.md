# 🎬 Carpeta de Reels

## Cómo agregar videos:

1. **Coloca tus videos aquí** en esta carpeta `public/assets/reels/`
2. **Formatos recomendados**: MP4, WebM
3. **Resolución recomendada**: 1080x1920 (vertical, formato 9:16)
4. **Tamaño recomendado**: Menos de 10MB por video

## Agregar videos al componente:

Abre el archivo `src/app/pages/components/reel/reel.ts` y agrega tus videos en el array `reels`:

```typescript
{
  id: '4',
  cliente: 'nombre_usuario',
  videoUrl: 'assets/reels/tu-video.mp4',
  descripcion: 'Tu descripción aquí 🔥',
  likes: 0,
  isLiked: false
}
```

## Ejemplo de nombres de archivo:
- `cliente1-outfit.mp4`
- `gym-session.mp4`
- `producto-showcase.mp4`
