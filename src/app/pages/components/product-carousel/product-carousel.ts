import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { register } from 'swiper/element/bundle';

// Register Swiper custom elements
register();

interface Particle {
    x: number;
    y: number;
    size: number;
    delay: number;
    duration: number;
    opacity: number;
    color: string;
}

@Component({
    selector: 'app-product-carousel',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: './product-carousel.html',
    styleUrls: ['./product-carousel.scss']
})
export class ProductCarouselComponent implements OnInit, AfterViewInit {
    @Input() products: Product[] = [];
    @Input() title: string = '';
    @Input() themeColor: string = '#ef4444';

    @Output() productSelected = new EventEmitter<Product>();

    @ViewChild('carouselWrapper') carouselWrapper!: ElementRef<any>;

    displayProducts: Product[] = [];
    productParticles: Map<string, Particle[]> = new Map();

    ngOnInit() {
        if (this.products && this.products.length > 0) {
            // Swiper handles looping natively, so we only need the original products
            this.displayProducts = [...this.products];
            this.generateAllParticles();
        }
    }

    generateAllParticles() {
        this.displayProducts.forEach((product, index) => {
            const particles: Particle[] = [];
            const particleCount = 25;
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2 + 0.5,
                    delay: Math.random() * 8,
                    duration: Math.random() * 4 + 4,
                    opacity: Math.random() * 0.4 + 0.1,
                    color: this.getAshColor(i)
                });
            }
            this.productParticles.set(`${product.name}-${index}`, particles);
        });
    }

    getAshColor(seed: number): string {
        const colors = [
            '#ffffff',
            '#cccccc',
            '#888888',
            '#ff4d4d',
            '#ff8c00',
            this.themeColor
        ];
        return colors[seed % colors.length];
    }

    ngAfterViewInit() {
        // Swiper initialization parameters can be set here if needed
        // but it's easier to set them via attributes in HTML
    }

    selectProduct(product: Product) {
        this.productSelected.emit(product);
    }

    scroll(direction: 'left' | 'right') {
        const swiperEl = this.carouselWrapper.nativeElement;
        if (direction === 'left') {
            swiperEl.swiper.slidePrev();
        } else {
            swiperEl.swiper.slideNext();
        }
    }
}
