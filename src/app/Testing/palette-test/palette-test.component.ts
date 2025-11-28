import { Component } from '@angular/core';

@Component({
  selector: 'app-palette-test',
  imports: [],
  templateUrl: './palette-test.component.html',
  styleUrl: './palette-test.component.scss'
})
export class PaletteTestComponent {

  toggleTheme() {
    const theme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', theme);
  }

}
