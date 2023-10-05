import { Component, OnInit } from '@angular/core';
import { FAQService } from '../services/faq.service';
import { HeaderService } from '../header.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  panelOpenState = false;

  constructor(
    private FaqService: FAQService,
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

  async ngOnInit(): Promise<void> {
    await this.getData();
    this.title.setTitle('FAQ');
    this.meta.updateTag({ name: 'description', content: 'FAQ' });
  }
  data: any;
  async getData() {
    this.data = await this.FaqService.getData(null, null, null);
  }
}
