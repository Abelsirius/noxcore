import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product';
import { Product } from '../../models/product';
import { ProductModalComponent } from '../product-grid/product-model/product-model';

interface ReelItem {
  id: string;
  cliente: string;
  videoUrl: string;
  descripcion?: string;
  likes: number;
  isLiked: boolean;
  comments?: number;
  productId?: string;
}

@Component({
  selector: 'app-reel',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductModalComponent],
  styleUrls: ['./reel-overlay.css'],
  template: `
    <section class="reel-container flex flex-col  w-full p-4 gap-4 min-w-[300px] max-w-screen-md m-auto   bg-black">
      <!-- Reel Items -->
      <div class="reel-wrapper" #reelWrapper>
        @for (reel of reels; track reel.id) {
          <div class="reel-item" [attr.data-reel-id]="reel.id">
            <!-- Video -->
            <video 
              #videoElement
              [src]="reel.videoUrl" 
              [muted]="isMuted"
              [loop]="true"
              playsinline
              class="reel-video"
              (click)="togglePlayPause($event)">
            </video>

            <!-- Mute/Unmute Button -->
            <button class="mute-btn" (click)="toggleMute()" aria-label="Silenciar">
              @if (isMuted) {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <line x1="23" y1="9" x2="17" y2="15"/>
                  <line x1="17" y1="9" x2="23" y2="15"/>
                </svg>
              } @else {
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
                </svg>
              }
            </button>

            <!-- Overlay Gradient -->
            <div class="reel-overlay"></div>

            <!-- Right Actions -->
            <div class="reel-actions">
              <!-- Like Button -->
              <button 
                class="action-btn"
                (click)="toggleLike(reel)"
                [class.liked]="reel.isLiked"
                aria-label="Me gusta">
                <svg class="action-icon" viewBox="0 0 24 24" [attr.fill]="reel.isLiked ? 'currentColor' : 'none'" [attr.stroke]="reel.isLiked ? 'none' : 'currentColor'" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span class="action-count">{{ formatCount(reel.likes) }}</span>
              </button>

              <!-- Comment Button -->
              <button class="action-btn" (click)="openComments(reel)" aria-label="Comentarios">
                <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
                <span class="action-count">{{ reel.comments || 0 }}</span>
              </button>

              <!-- Shop/Product Button -->
              <button class="action-btn" (click)="goToProduct(reel)" aria-label="Ver producto">
                <svg class="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 0 1-8 0"/>
                </svg>
                <span class="action-label">Shop</span>
              </button>


            </div>

            <!-- Bottom Info -->
            <div class="reel-info">
              <div class="user-info">
                <span class="username">@{{ reel.cliente }}</span>
              </div>
              @if (reel.descripcion) {
                <p class="description">{{ reel.descripcion }}</p>
              }
            </div>

            <!-- Comments Overlay -->
            @if (activeCommentsReelId === reel.id) {
              <div class="comments-overlay" (click)="closeComments($event)">
                <div class="comments-panel" (click)="$event.stopPropagation()">
                  <!-- Header -->
                  <div class="comments-header">
                    <h3>Comentarios</h3>
                    <button class="close-btn" (click)="closeComments($event)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Comments List -->
                  <div class="comments-list">
                    @if (reel.comments && reel.comments > 0) {
                      <!-- Sample comments -->
                      <div class="comment-item">
                        <div class="comment-avatar">👤</div>
                        <div class="comment-content">
                          <span class="comment-user">usuario_1</span>
                          <p class="comment-text">¡Me encanta este producto! 🔥</p>
                          <span class="comment-time">Hace 2h</span>
                        </div>
                      </div>
                      <div class="comment-item">
                        <div class="comment-avatar">👤</div>
                        <div class="comment-content">
                          <span class="comment-user">fitness_lover</span>
                          <p class="comment-text">¿Cuándo vuelve el stock?</p>
                          <span class="comment-time">Hace 5h</span>
                        </div>
                      </div>
                    } @else {
                      <div class="no-comments">
                        <p>Sé el primero en comentar</p>
                      </div>
                    }
                  </div>

                  <!-- Comment Input -->
                  <div class="comment-input-wrapper">
                    <input 
                      type="text" 
                      class="comment-input" 
                      placeholder="Agrega un comentario..."
                      [(ngModel)]="newComment"
                      (keyup.enter)="addComment(reel)">
                    <button 
                      class="send-btn" 
                      (click)="addComment(reel)"
                      [disabled]="!newComment.trim()">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Scroll Indicators -->
      <div class="scroll-indicators">
        @for (reel of reels; track reel.id; let i = $index) {
          <div 
            class="indicator" 
            [class.active]="currentReelIndex === i">
          </div>
        }
      </div>
      <!-- Product Modal -->
      <app-product-modal
        *ngIf="selectedProduct"
        [product]="selectedProduct"
        [isOpen]="isModalOpen"
        (close)="closeProductModal()"
      ></app-product-modal>
    </section>
  `,
  styles: [`
    .reel-container {
      position: relative;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      background: #000;
    }

    .reel-wrapper {
      height: 100%;
      overflow-y: scroll;
      scroll-snap-type: y mandatory;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    .reel-wrapper::-webkit-scrollbar {
      display: none;
    }

    .reel-item {
      position: relative;
      width: 100%;
      height: 100vh;
      scroll-snap-align: start;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000;
    }

    .reel-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      cursor: pointer;
    }

    .reel-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 40%;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      pointer-events: none;
    }

    /* Right Actions */
    .reel-actions {
      position: absolute;
      right: 12px;
      bottom: 100px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      z-index: 10;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: white;
      padding: 0;
    }

    .action-btn:hover {
      transform: scale(1.1);
      background: rgba(0, 0, 0, 0.5);
    }

    .action-btn:active {
      transform: scale(0.9);
    }

    .action-btn.liked {
      color: #ef4444;
    }

    .action-btn.liked .action-icon {
      animation: likeAnimation 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes likeAnimation {
      0% { transform: scale(1); }
      50% { transform: scale(1.3); }
      100% { transform: scale(1); }
    }

    .action-icon {
      width: 26px;
      height: 26px;
      filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));
    }

    .action-count {
      font-size: 11px;
      font-weight: 700;
      text-shadow: 0 1px 3px rgba(0,0,0,0.8);
      margin-top: 2px;
      letter-spacing: -0.3px;
    }

    .action-label {
      font-size: 10px;
      font-weight: 600;
      text-shadow: 0 1px 3px rgba(0,0,0,0.8);
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Bottom Info */
    .reel-info {
      position: absolute;
      bottom: 24px;
      left: 16px;
      right: 80px;
      z-index: 10;
      color: white;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .username {
      font-size: 14px;
      font-weight: 600;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
      color: #fff;
    }

    .description {
      font-size: 14px;
      line-height: 1.4;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Scroll Indicators */
    .scroll-indicators {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: 5;
    }

    .indicator {
      width: 3px;
      height: 24px;
      background: rgba(255,255,255,0.3);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .indicator.active {
      background: #ef4444;
      height: 32px;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .reel-actions {
        right: 8px;
        bottom: 150px; /* Moved up to avoid intersection with bottom nav + padding */
        gap: 16px;
      }

      .action-btn {
        width: 44px;
        height: 44px;
      }

      .action-icon {
        width: 24px;
        height: 24px;
      }

      .action-count,
      .action-label {
        font-size: 10px;
      }

      .reel-info {
        bottom: 80px; /* Moved up above the 60px bottom nav */
        left: 12px;
        right: 70px;
      }
    }
  `]
})
export class Reel implements AfterViewInit {
  @ViewChild('reelWrapper') reelWrapper!: ElementRef<HTMLDivElement>;

  currentReelIndex = 0;
  private videoElements: HTMLVideoElement[] = [];

  // Audio and Comments State
  // Intentamos iniciar con sonido (isMuted = false)
  // Nota: Los navegadores pueden bloquear esto si no hay interacción previa.
  isMuted = false;
  activeCommentsReelId: string | null = null;
  newComment = '';
  private intersectionObserver: IntersectionObserver | null = null;

  // Product Logic
  allProducts: Product[] = [];
  selectedProduct: Product | null = null;
  isModalOpen = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private productService: ProductService
  ) { }

  // 🎬 AQUÍ PUEDES AGREGAR TUS VIDEOS
  // Solo agrega la ruta del video en assets/reels/
  reels: ReelItem[] = [
    //  AGREGA TUS VIDEOS AQUÍ:
    {
      id: '1',
      cliente: 'Dark Fantasy compression Heavenly Red',
      videoUrl: '../../../../assets/reels/reel_!.mp4',
      descripcion: 'Compresores de alta elasticidad, diseño infernal y ajuste perfecto. Ideales para entrenar con intensidad y estilo. 🔥 Oscuros, cómodos y hechos para dominar. 🔥',
      likes: 34,
      isLiked: false
    },
    {
      id: '2',
      cliente: 'Evangelion Compression Void Black',
      videoUrl: '../../../../assets/reels/reel_2.mp4',
      descripcion: 'Compresores de alta elasticidad, diseño infernal y ajuste perfecto. Ideales para entrenar con intensidad y estilo. 🔥 Oscuros, cómodos y hechos para dominar. 🔥',
      likes: 45,
      isLiked: false
    },
    {
      id: '3',
      cliente: 'Nighfall Compression',
      videoUrl: '../../../../assets/reels/reel_3.mp4',
      descripcion: 'Compresores de alta elasticidad, diseño infernal y ajuste perfecto. Ideales para entrenar con intensidad y estilo. 🔥 Oscuros, cómodos y hechos para dominar. 🔥',
      likes: 72,
      isLiked: false
    }
  ];

  ngAfterViewInit() {
    this.setupVideoElements();
    this.setupScrollListener();
    this.setupVisibilityObserver();

    // Cargar productos
    this.loadProducts();
  }

  private loadProducts() {
    // Suscribirse a ambos observables de productos para tener el catálogo completo
    this.productService.getProducts().subscribe(products => {
      this.allProducts = [...this.allProducts, ...products];
    });

    this.productService.getProductsSoon().subscribe(productsSoon => {
      this.allProducts = [...this.allProducts, ...productsSoon];
    });
  }

  ngOnDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  }

  private setupVisibilityObserver() {
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Si el componente entra en pantalla, reproducir
          this.playCurrentVideo();
        } else {
          // Si sale de pantalla, pausar todo
          this.pauseAllVideos();
        }
      });
    }, {
      threshold: 0.5 // Reproducir cuando el 50% del componente sea visible
    });

    this.intersectionObserver.observe(this.elementRef.nativeElement);
  }

  private setupVideoElements() {
    const wrapper = this.reelWrapper.nativeElement;
    this.videoElements = Array.from(wrapper.querySelectorAll('video'));
  }

  private setupScrollListener() {
    const wrapper = this.reelWrapper.nativeElement;

    wrapper.addEventListener('scroll', () => {
      const scrollTop = wrapper.scrollTop;
      const itemHeight = wrapper.clientHeight;
      const newIndex = Math.round(scrollTop / itemHeight);

      if (newIndex !== this.currentReelIndex) {
        this.pauseAllVideos();
        this.currentReelIndex = newIndex;
        this.cdr.detectChanges();
        this.playCurrentVideo();
      }
    });
  }

  private playCurrentVideo() {
    const currentVideo = this.videoElements[this.currentReelIndex];
    if (currentVideo) {
      const playPromise = currentVideo.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Autoplay prevented by browser policy:', error);
          // Si falla el autoplay (probablemente por audio), intentamos mutear
          if (error.name === 'NotAllowedError' && !this.isMuted) {
            console.log('Falling back to muted autoplay');
            this.isMuted = true;
            currentVideo.muted = true;
            currentVideo.play().catch(e => console.error('Muted autoplay failed:', e));
            this.cdr.detectChanges(); // Actualizar UI de botón mute
          }
        });
      }
    }
  }

  private pauseAllVideos() {
    this.videoElements.forEach(video => video.pause());
  }

  togglePlayPause(event: Event) {
    const video = event.target as HTMLVideoElement;
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  toggleLike(reel: ReelItem) {
    reel.isLiked = !reel.isLiked;
    reel.likes += reel.isLiked ? 1 : -1;
  }

  openComments(reel: ReelItem) {
    this.activeCommentsReelId = reel.id;
    // Pausar el video cuando se abren los comentarios
    const currentVideo = this.videoElements[this.currentReelIndex];
    if (currentVideo) {
      currentVideo.pause();
    }
  }

  closeComments(event: Event) {
    event.stopPropagation();
    this.activeCommentsReelId = null;
    this.newComment = '';
    // Reanudar el video cuando se cierran los comentarios
    const currentVideo = this.videoElements[this.currentReelIndex];
    if (currentVideo) {
      currentVideo.play();
    }
  }

  addComment(reel: ReelItem) {
    if (!this.newComment.trim()) return;

    // TODO: Enviar comentario al backend
    console.log('Nuevo comentario:', this.newComment, 'para:', reel.cliente);

    // Incrementar contador de comentarios
    if (!reel.comments) {
      reel.comments = 0;
    }
    reel.comments++;

    // Limpiar input
    this.newComment = '';
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    // Aplicar a todos los videos
    this.videoElements.forEach(video => {
      video.muted = this.isMuted;
    });
  }

  goToProduct(reel: ReelItem) {
    if (!reel.cliente) {
      console.warn('Reel has no client name', reel);
      return;
    }

    console.log('🔍 Searching product for:', reel.cliente);
    console.log('📦 Total products available:', this.allProducts.length);

    // Buscar coincidencia exacta por nombre
    const product = this.allProducts.find(p => p.name === reel.cliente);

    if (product) {
      console.log('✅ Exact match found:', product.name);
      this.selectedProduct = product;
      this.isModalOpen = true;

      // Pausar video actual
      const currentVideo = this.videoElements[this.currentReelIndex];
      if (currentVideo) {
        currentVideo.pause();
      }
    } else {
      console.warn('❌ Direct match failed for:', reel.cliente);
      // Fallback: Si no encuentra por nombre exacto, intentar búsqueda parcial
      // Normalizamos strings para comparar mejor
      const reelName = reel.cliente.toLowerCase();

      const partialMatch = this.allProducts.find(p => {
        const prodName = p.name.toLowerCase();
        return prodName.includes(reelName) || reelName.includes(prodName);
      });

      if (partialMatch) {
        console.log('✅ Partial match found:', partialMatch.name);
        this.selectedProduct = partialMatch;
        this.isModalOpen = true;
        const currentVideo = this.videoElements[this.currentReelIndex];
        if (currentVideo) {
          currentVideo.pause();
        }
      } else {
        console.error('🚫 No product found (exact or partial) for:', reel.cliente);
      }
    }
  }

  closeProductModal() {
    this.isModalOpen = false;
    this.selectedProduct = null;

    // Reanudar video
    const currentVideo = this.videoElements[this.currentReelIndex];
    if (currentVideo) {
      currentVideo.play().catch(e => console.log('Resume failed:', e));
    }
  }

  formatCount(count: number): string {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }

  @HostListener('window:resize')
  onResize() {
    this.setupVideoElements();
  }
}
