import { Component } from '@angular/core';
import { HeaderService } from '../header.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about-risk',
  templateUrl: './about-risk.component.html',
  styleUrls: ['./about-risk.component.scss'],
})
export class AboutRiskComponent {
  constructor(
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background =
      'linear-gradient(to right, #0F212F, #0E1E2B)';
    this.headerService.backgroundNavMain =
      'linear-gradient(to right, #436280, #30455B)';
    this.headerService.backgroundUserNavButton =
      'linear-gradient(to right, #436280, #30455B)';
  }

  ngOnInit() {
    this.title.setTitle('About risk');
    this.meta.updateTag({ name: 'description', content: 'About risk' });
  }
}
