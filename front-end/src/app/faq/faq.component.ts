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
    this.headerService.background = '#0f212f';
    this.headerService.backgroundNavMain = '#436280';
    this.headerService.backgroundUserNavButton = '#436280';
  }

  async ngOnInit(): Promise<void> {
    await this.getData();
    this.title.setTitle('Faq');
    this.meta.updateTag({ name: 'description', content: 'Faq' });
  }
  data: any;
  async getData() {
    this.data = await this.FaqService.getData();
  }
}
