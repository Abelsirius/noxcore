import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const adminGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notify = inject(NotificationService);

  // Si ya tenemos el estado cargado
  if (authService.isAdmin()) {
    return true;
  }

  // Si no está logueado o no es admin, redirigir
  notify.error('Acceso denegado. Se requieren permisos de administrador.');
  router.navigate(['/auth/login']);
  return false;
};
