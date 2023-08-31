import { Component } from '@angular/core';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private headerService: HeaderService) {
    this.headerService.background = 'green';
  }
}
