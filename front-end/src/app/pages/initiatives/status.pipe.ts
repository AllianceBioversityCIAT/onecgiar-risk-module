import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(official_code: any, allInitVersion: any, iniLastUpdated: any): any {

    for(let version of allInitVersion) {
      if(version.official_code == official_code) {
        if(version.submit_date == iniLastUpdated) {
          return 'published';
        }
        else if(version.submit_date != iniLastUpdated) {
          return 'draft';
        }
      }
    }
    return 'draft';
  }

}
