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
    this.headerService.background = '#0f212f';
    this.headerService.backgroundNavMain = '#436280';
    this.headerService.backgroundUserNavButton = '#436280';
  }

  ngOnInit() {
    this.title.setTitle('About risk');
    this.meta.updateTag({ name: 'description', content: 'About risk' });
  }
}
