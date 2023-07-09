import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterActions'
})
export class FilterActionsPipe implements PipeTransform {

  transform(actions: any, element: any): any {
    if(element.disabled == false) {
      actions = [
        { title: 'Update', action: 'edit', icon: 'edit' },
        { title: 'Delete', action: 'delete', icon: 'delete' },
        { title: 'Enabled catigory', action: 'enableCatigory', icon: 'visibility' }
      ];
      return actions;
    }
    else if(element.disabled == true) {
      actions = [
        { title: 'Update', action: 'edit', icon: 'edit' },
        { title: 'Delete', action: 'delete', icon: 'delete' },
        { title: 'Disabled catigory', action: 'disabledCatigory', icon: 'disabled_visible' },
      ];
      return actions;
    }
    return actions;
  }

}
