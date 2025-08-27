import { Component } from '@angular/core';
import { ProductGridComponent } from "../components/product-grid/product-grid";
import { HeroComponent } from "../components/hero/hero";
import { HeaderComponent } from "../components/header/header";

@Component({
  selector: 'app-home',
  imports: [ProductGridComponent, HeroComponent, HeaderComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
