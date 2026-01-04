import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Loading } from "./pages/components/loading/loading";
import { BottomNavComponent } from './pages/components/bottom-nav/bottom-nav';
import { HeaderComponent } from "./pages/components/header/header";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loading, BottomNavComponent, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('noxcore_proyect');
}
