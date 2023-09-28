import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'faqPipe',
})
export class FaqPipePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer){}
  transform(style:any): unknown {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<div class="faq-imgs">` + style + `</div>`
    );
  }
}
