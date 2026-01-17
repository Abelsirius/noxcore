import { Component, ElementRef, ViewChild, AfterViewInit, inject, ChangeDetectorRef, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss'],
})
export class HeroComponent implements AfterViewInit {
  hasEntered = input<boolean>(false);
  @ViewChild('heroVideo') videoRef!: ElementRef<HTMLVideoElement>;
  showGlitchText = false;

  private cdr = inject(ChangeDetectorRef);

  ngAfterViewInit() {
    if (this.videoRef?.nativeElement) {
      const video = this.videoRef.nativeElement;
      video.play().catch(console.warn);
    }
    this.triggerGlitch();
  }

  onVideoEnded() {
    if (this.videoRef?.nativeElement) {
      this.videoRef.nativeElement.currentTime = 0;
      this.videoRef.nativeElement.play();
    }

    this.triggerGlitch();
  }

  triggerGlitch() {
    this.showGlitchText = true;
    this.cdr.detectChanges(); // Force Check to fix NG0100

    setTimeout(() => {
      this.showGlitchText = false;
      this.cdr.detectChanges(); // Check again when hiding
    }, 1500);
  }

  scrollToCollection() {
    const collectionSection = document.getElementById('collection-shadow');
    if (collectionSection) {
      collectionSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}