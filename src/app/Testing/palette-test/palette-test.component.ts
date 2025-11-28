import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-palette-test',
  imports: [],
  templateUrl: './palette-test.component.html',
  styleUrl: './palette-test.component.scss'
})
export class PaletteTestComponent {

  constructor(private theme: ThemeService) {

  }

  toggleTheme() {
    this.theme.toggleTheme();
  }

}
