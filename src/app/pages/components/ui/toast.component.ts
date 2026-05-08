import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div *ngFor="let n of service.notifications()" 
           class="pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-sm border shadow-2xl animate-slide-in"
           [ngClass]="{
             'bg-black border-green-500/50 text-green-500': n.type === 'success',
             'bg-black border-red-500/50 text-red-500': n.type === 'error',
             'bg-black border-blue-500/50 text-blue-500': n.type === 'info',
             'bg-black border-yellow-500/50 text-yellow-500': n.type === 'warning'
           }">
        <i class="ti" [ngClass]="{
          'ti-check': n.type === 'success',
          'ti-alert-circle': n.type === 'error',
          'ti-info-circle': n.type === 'info',
          'ti-alert-triangle': n.type === 'warning'
        }"></i>
        <span class="text-[11px] font-black uppercase tracking-widest">{{n.message}}</span>
        <button (click)="service.remove(n.id)" class="ml-4 hover:opacity-50 transition-opacity">
          <i class="ti ti-x"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in {
      animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
  `]
})
export class ToastComponent {
  service = inject(NotificationService);
}
