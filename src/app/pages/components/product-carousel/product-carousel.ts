import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';

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
    templateUrl: './product-carousel.html',
    styleUrls: ['./product-carousel.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCarouselComponent implements OnInit, AfterViewInit {
    @Input() products: Product[] = [];
    @Input() title: string = '';
    @Input() themeColor: string = '#ef4444';

    @Output() productSelected = new EventEmitter<Product>();

    @ViewChild('carouselWrapper') carouselWrapper!: ElementRef<HTMLDivElement>;

    displayProducts: Product[] = [];
    productParticles: Map<string, Particle[]> = new Map();
    private isJumping = false;

    ngOnInit() {
        if (this.products && this.products.length > 0) {
            // Triple the products for infinite effect
            this.displayProducts = [...this.products, ...this.products, ...this.products];
            this.generateAllParticles();
        }
    }

    generateAllParticles() {
        this.displayProducts.forEach((product, index) => {
            const particles: Particle[] = [];
            const particleCount = 6; // Drastically reduced for performance
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: Math.random() * 2 + 0.5, // Smaller particles
                    delay: Math.random() * 8,
                    duration: Math.random() * 4 + 4,
                    opacity: Math.random() * 0.4 + 0.1,
                    color: this.getAshColor(i)
                });
            }
            // Use index + name as key since products repeat
            this.productParticles.set(`${product.name}-${index}`, particles);
        });
    }

    getAshColor(seed: number): string {
        const colors = [
            '#ffffff', // White ash
            '#cccccc', // Light gray
            '#888888', // Dark gray
            '#ff4d4d', // Red ember
            '#ff8c00', // Orange ember
            this.themeColor // Brand color accent
        ];
        return colors[seed % colors.length];
    }

    ngAfterViewInit() {
        // Start in the middle section
        setTimeout(() => {
            this.centerInitialPosition();
        }, 100);
    }

    centerInitialPosition() {
        if (!this.carouselWrapper) return;
        const wrapper = this.carouselWrapper.nativeElement;
        const contentWidth = wrapper.scrollWidth / 3;
        wrapper.scrollLeft = contentWidth;
    }

    selectProduct(product: Product) {
        this.productSelected.emit(product);
    }

    scroll(direction: 'left' | 'right') {
        const wrapper = this.carouselWrapper.nativeElement;
        const scrollAmount = direction === 'left' ? -wrapper.offsetWidth * 0.8 : wrapper.offsetWidth * 0.8;

        wrapper.scrollTo({
            left: wrapper.scrollLeft + scrollAmount,
            behavior: 'smooth'
        });
    }

    onScroll() {
        if (this.isJumping) return;

        const wrapper = this.carouselWrapper.nativeElement;
        const scrollLeft = wrapper.scrollLeft;
        const scrollWidth = wrapper.scrollWidth;
        const contentWidth = scrollWidth / 3;

        // Optimized infinite loop logic
        if (scrollLeft >= contentWidth * 2) {
            this.isJumping = true;
            wrapper.scrollLeft = scrollLeft - contentWidth;
            setTimeout(() => this.isJumping = false, 50);
        } else if (scrollLeft <= 5) {
            this.isJumping = true;
            wrapper.scrollLeft = contentWidth + scrollLeft;
            setTimeout(() => this.isJumping = false, 50);
        }
    }
}
