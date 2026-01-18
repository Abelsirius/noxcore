import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';

@Component({
    selector: 'app-product-carousel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-carousel.html',
    styleUrls: ['./product-carousel.scss']
})
export class ProductCarouselComponent implements OnInit, AfterViewInit {
    @Input() products: Product[] = [];
    @Input() title: string = '';
    @Input() themeColor: string = '#ef4444';

    @Output() productSelected = new EventEmitter<Product>();

    @ViewChild('carouselWrapper') carouselWrapper!: ElementRef<HTMLDivElement>;

    displayProducts: Product[] = [];
    private isJumping = false;

    ngOnInit() {
        if (this.products && this.products.length > 0) {
            // Triple the products for infinite effect
            this.displayProducts = [...this.products, ...this.products, ...this.products];
        }
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

        // Infinite loop logic: jump when reaching extremes
        if (scrollLeft >= contentWidth * 2) {
            this.isJumping = true;
            wrapper.scrollTo({ left: scrollLeft - contentWidth, behavior: 'auto' });
            // Use a tiny timeout to reset state to avoid recursive scroll events
            setTimeout(() => { this.isJumping = false; }, 10);
        } else if (scrollLeft <= 5) { // Small buffer for zero
            this.isJumping = true;
            wrapper.scrollTo({ left: scrollLeft + contentWidth, behavior: 'auto' });
            setTimeout(() => { this.isJumping = false; }, 10);
        }
    }
}
