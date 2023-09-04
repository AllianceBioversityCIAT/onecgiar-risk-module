import { Pipe } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({name: 'safeHtml'})
export class Safe {
  constructor(private sanitizer:DomSanitizer){}

  transform(style:any, title: string) {

    if(title == 'safeHtml for mitigation') {
      return this.sanitizer.bypassSecurityTrustHtml(style);

    }
    else {
      return style.replace(/<.*?>/g, '');
    }


    // return this.sanitizer.bypassSecurityTrustHtml(style);
    //return this.sanitizer.bypassSecurityTrustStyle(style);
    // return this.sanitizer.bypassSecurityTrustXxx(style); - see docs
  }
}