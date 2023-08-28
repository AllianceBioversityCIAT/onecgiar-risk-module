import { Component, OnInit } from '@angular/core';
import { FAQService } from '../services/faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit{
  panelOpenState = false;

  constructor(private FaqService: FAQService) {}

  async ngOnInit(): Promise<void> {
    await this.getData()
  }
  data: any;
  async getData() {
    this.data = await this.FaqService.getData();
  }


}
