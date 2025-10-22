import { Component, ElementRef, OnInit, HostListener, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, NgZone } from '@angular/core';

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  image: string;
  verified?: boolean;
  daysAgo?: number;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="relative overflow-hidden py-20 px-4" aria-labelledby="testimonials-title">
      <!-- Fondo -->
      <div
        class="pointer-events-none absolute inset-0 -z-10"
        [ngStyle]="{'background-image': backgroundGradient, 'background-attachment': 'fixed'}"
        style="opacity: 0.06; filter: blur(40px); transform: translateZ(0);">
      </div>

      <div class="max-w-6xl mx-auto text-center mb-12">
        <h2 id="testimonials-title" class="text-3xl md:text-4xl font-extrabold text-white tracking-wider">
          TESTIMONIOS DE NUESTROS CLIENTES
        </h2>
        <div class="w-24 h-1 bg-red-500 mx-auto mt-4 rounded-full"></div>
        <p class="mt-4 text-sm text-gray-300 max-w-2xl mx-auto">Opiniones reales, estilo real. Compra verificada y entrega impecable.</p>
      </div>

      <!-- 🖥️ Grid Desktop -->
      <div class="hidden md:grid max-w-6xl mx-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <article *ngFor="let t of testimonials" class="testimonial-card">
          <div class="card-inner bg-[#0b0b0b] rounded-2xl p-6 h-full border border-transparent hover:border-red-600 hover:shadow-[0_20px_50px_rgba(255,45,45,0.06)] transition-shadow duration-300">
            <ng-container *ngTemplateOutlet="testimonial; context: {$implicit: t}"></ng-container>
          </div>
        </article>
      </div>

      <!-- 📱 Carousel Mobile -->
      <div class="md:hidden relative max-w-full overflow-hidden pb-4">
        <div #carousel class="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide px-2">
          <div
            *ngFor="let t of testimonials"
            class="testimonial-card flex-shrink-0 snap-center w-[85vw] bg-[#0b0b0b] rounded-2xl p-6 border border-transparent hover:border-red-600 hover:shadow-[0_20px_50px_rgba(255,45,45,0.06)] transition-all duration-300"
          >
            <ng-container *ngTemplateOutlet="testimonial; context: {$implicit: t}"></ng-container>
          </div>
        </div>

        <!-- 🔘 Botones flotantes -->
        <button
          (click)="scrollLeft()"
          class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-red-600 transition md:hidden z-10"
        >‹</button>

        <button
          (click)="scrollRight()"
          class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-red-600 transition md:hidden z-10"
        >›</button>
      </div>

      <!-- Template -->
      <ng-template #testimonial let-t>
        <div class="flex items-center gap-4 mb-4">
          <div class="text-left">
            <div class="flex items-center gap-2">
              <h3 class="text-white font-bold text-sm">{{ t.name }}</h3>
              <span *ngIf="t.verified" class="ml-1 text-xs inline-flex items-center gap-1 text-gray-300">
                <svg class="w-3 h-3 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M9.3 16.3 4.9 11.9l1.4-1.4 3 3 7.4-7.4 1.4 1.4z"/></svg>
                <span>Cliente satisfecho</span>
              </span>
            </div>
            <div class="flex items-center mt-1">
              <ng-container *ngFor="let i of [1,2,3,4,5]; let idx = index">
<svg _ngcontent-ng-c4132605223="" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-red-500"><path _ngcontent-ng-c4132605223="" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 0 0 .95.69h4.154c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 0 0-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 0 0-1.176 0l-3.36 2.44c-.785.57-1.84-.197-1.54-1.118l1.286-3.95a1 1 0 0 0-.364-1.118L2.07 9.377c-.783-.57-.38-1.81.588-1.81h4.154a1 1 0 0 0 .95-.69l1.286-3.95z"></path></svg>
                <svg *ngIf="idx >= t.rating" class="w-4 h-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95..."/>
                </svg>
              </ng-container>
            </div>
          </div>
        </div>
        <div class="overflow-hidden rounded-lg">
            <img [src]="t.image" [alt]="t.name" class="w-full h-[250px] mb-3 rounded-lg object-cover border-2  border-gray-800 shadow-sm transform transition-transform duration-200 ease-out hover:scale-105"/>
        </div>
        <p class="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">“{{ t.text }}”</p>

        <div class="mt-auto flex items-center justify-between">
          <span class="text-xs text-gray-500">Hace {{ t.daysAgo }} días</span>
          <!-- <button class="text-xs px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-500 transition-colors">Ver perfil</button> -->
        </div>
      </ng-template>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .testimonial-card { opacity: 0; transform: translateY(18px) scale(0.99); }
    .testimonial-card.is-visible { opacity: 1; transform: translateY(0) scale(1); transition: all 420ms cubic-bezier(.2,.9,.3,1); }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class TestimonialsComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel') carousel!: ElementRef<HTMLDivElement>;

  testimonials: Testimonial[] = [
    { id: 't1', name: 'Carlos M.', text: 'La tela es brutal, ajuste perfecto...', rating: 5, image: '../../../../assets/temo1.jpeg', verified: true, daysAgo:2 },
  ];

  backgroundGradient = 'radial-gradient(circle at 10% 20%, #ff2b2b 0%, transparent 10%), radial-gradient(circle at 80% 70%, #ff2b2b 0%, transparent 8%)';

  constructor(private host: ElementRef<HTMLElement>, private cd: ChangeDetectorRef, private zone: NgZone) {}

  ngAfterViewInit() { this.cd.detectChanges(); }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.zone.run(() => {
          this.initObserver();
          this.cd.detectChanges();
        });
      });
    });
  }

  private initObserver() {
    const root = this.host.nativeElement;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) el.classList.add('is-visible');
      });
    }, { threshold: 0.12 });

    root.querySelectorAll('.testimonial-card').forEach((c) => io.observe(c));
  }

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
  }
}