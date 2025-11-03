import { Component } from '@angular/core';
import { ProductGridComponent } from "../components/product-grid/product-grid";
import { HeroComponent } from "../components/hero/hero";
import { HeaderComponent } from "../components/header/header";
import { TestimonialsComponent } from "../components/testimonials/testimonials";
import { EncuestasComponent } from "../components/encuesta/encuesta";
import { Reel } from "../components/reel/reel";

@Component({
  selector: 'app-home',
  imports: [ProductGridComponent, HeroComponent, HeaderComponent, TestimonialsComponent, EncuestasComponent, Reel],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
