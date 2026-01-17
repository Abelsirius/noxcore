import { Component, inject, OnInit } from '@angular/core';
import { ProductGridComponent } from "../components/product-grid/product-grid";
import { HeroComponent } from "../components/hero/hero";
import { HeaderComponent } from "../components/header/header";
import { EncuestasComponent } from "../components/encuesta/encuesta";
import { Reel } from "../components/reel/reel";
import { MatDialog } from '@angular/material/dialog';
import { VotoModalComponent } from '../components/voto-modal-component/voto-modal-component';

@Component({
  selector: 'app-home',
  imports: [ProductGridComponent, HeroComponent, HeaderComponent, EncuestasComponent, Reel],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  hasEntered = false;

  constructor() {
    // Check if user already entered in this session
    const entered = sessionStorage.getItem('hasEntered');
    if (entered === 'true') {
      this.hasEntered = true;
    }
  }

  ngOnInit(): void {
    //  this.openVotoModal(); 
  }

  onEnter() {
    this.hasEntered = true;
    sessionStorage.setItem('hasEntered', 'true');
  }

  openVotoModal() {
    const dialogRef = this.dialog.open(VotoModalComponent, {
      // Configuración del modal
      panelClass: 'custom-dialog-container',
      backdropClass: 'custom-dialog-backdrop',
      disableClose: true, // Forzar a usar el botón "INICIAR VOTACIÓN"
      width: '90%',
    });


    dialogRef.afterClosed().subscribe((e) => {
      if (e) {
        const collectionSection = document.getElementById('encuesta');
        if (collectionSection) {
          collectionSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    })
  }
  public dialog = inject(MatDialog);
}
