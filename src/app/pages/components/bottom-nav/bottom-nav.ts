import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="mobile-nav">
      <div class="nav-container">
        <!-- Home Link -->
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span>Inicio</span>
        </a>

        <!-- Reels Link (Center) -->
        <div class="nav-center">
          <a routerLink="/reels" routerLinkActive="active" class="reel-btn">
            <svg viewBox="0 0 24 24" fill="none" class="reel-icon">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" stroke-width="2"/>
              <path d="M12 7v10" stroke="currentColor" stroke-width="2"/>
              <line x1="8" y1="2" x2="8" y2="22" stroke="currentColor" stroke-width="2"/>
              <line x1="16" y1="2" x2="16" y2="22" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
          </a>
        </div>

        <!-- Shop Link -->
        <a routerLink="/shop" routerLinkActive="active" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <span>Tienda</span>
        </a>

        <!-- Drops/Coming Soon Link -->
         <a routerLink="/drops" routerLinkActive="active" class="nav-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a9 9 0 0 1 9 9c0 4.97-4.03 9-9 9a9 9 0 0 1-9-9c1.65 0 3 .9 3 2 0-3.3 2.7-6 6-6 1.65 0 3 .9 3 2 0-3.3-2.7-6-6-6z"/>
            <path d="M12 22v-6"/>
            <path d="M12 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
          </svg>
          <span style="font-size: 9px;">Drops</span>
        </a>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
      /* Hide on desktop by default, consistent with "mobile menu" request */
      @media (min-width: 769px) {
        display: none;
      }
    }

    .mobile-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(10px);
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-bottom: env(safe-area-inset-bottom);
      z-index: 1000;
      height: 60px;
    }

    .nav-container {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 100%;
      position: relative;
    }

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #666;
      text-decoration: none;
      font-size: 10px;
      gap: 4px;
      width: 60px;
      transition: color 0.3s;
    }

    .nav-item.active {
      color: #ef4444; /* Accent color */
    }

    .nav-item svg {
      width: 24px;
      height: 24px;
    }

    /* Center Button Styles */
    .nav-center {
      position: relative;
      top: -15px; /* Lift it up */
      background: #000;
      border-radius: 50%;
      padding: 6px;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    .reel-btn {
      width: 50px;
      height: 50px;
      background: linear-gradient(45deg, #ef4444, #ec4899);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
      transition: transform 0.2s;
    }

    .reel-btn:active {
      transform: scale(0.9);
    }

    .reel-icon {
      width: 28px;
      height: 28px;
    }
  `]
})
export class BottomNavComponent {}
