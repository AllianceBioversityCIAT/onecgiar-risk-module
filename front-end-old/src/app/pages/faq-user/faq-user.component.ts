import { Component, OnInit } from '@angular/core';
import { FAQService } from 'src/app/services/faq.service';
@Component({
  selector: 'app-faq-user',
  templateUrl: './faq-user.component.html',
  styleUrls: ['./faq-user.component.scss'],
})
export class FAQUserComponent implements OnInit{
  constructor(private FaqService: FAQService) {}

  async ngOnInit(): Promise<void> {
    await this.getData()
  }
  data: any;
  async getData() {
    this.data = await this.FaqService.getData();
  }
}
