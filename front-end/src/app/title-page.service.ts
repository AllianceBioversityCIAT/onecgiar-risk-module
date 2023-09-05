import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class TitlePageService {
  a: any;

  constructor(private title: Title, private meta: Meta) {
    this.a = this.title.setTitle('Accelerated breeding version - 226');
  }
}
