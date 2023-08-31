import { Component } from '@angular/core';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-about-risk',
  templateUrl: './about-risk.component.html',
  styleUrls: ['./about-risk.component.scss'],
})
export class AboutRiskComponent {
  constructor(private headerService: HeaderService) {
    this.headerService.background = 'orange';
  }
}
