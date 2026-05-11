import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. ADD NAVBAR TO THIS ARRAY
  imports: [RouterOutlet, Navbar, Footer], 
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = 't3d-ui';
}