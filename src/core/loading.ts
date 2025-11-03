import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // BehaviorSubject para el estado de carga (true = cargando, false = inactivo)
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  // Observable público para que los componentes se suscriban
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  constructor() {}

  /** Muestra el loading. */
  show() {
    this.loadingSubject.next(true);
  }

  /** Oculta el loading. */
  hide() {
    this.loadingSubject.next(false);
  }
}
