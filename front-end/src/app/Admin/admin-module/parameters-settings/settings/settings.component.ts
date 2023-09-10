import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from 'src/app/header.service';
import { VariableService } from 'src/app/services/variable.service';
import { ToastrService } from 'ngx-toastr';
import { EditConstantFormComponent } from './edit-constant-form/edit-constant-form.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  canPublish!: boolean;
  publishValue: any;
  constants:any;
  constructor(
    private variableService: VariableService,
    private headerService: HeaderService,
    private dialog: MatDialog,
    private toster: ToastrService,
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  displayedColumns: string[] = [
    'id',
    'lable',
    'value',
    'action',
  ];

  async ngOnInit() {
    await this.getPublishStatus();
    await this.getContatns();
    console.log(this.constants)
  }

  async getContatns() {
    this.constants = await this.variableService.getConstantsVariable();
  }

  async getPublishStatus() {
    this.publishValue = await this.variableService.getPublishStatus();
    if (this.publishValue.value == '0') {
      this.canPublish = false;
    } else {
      this.canPublish = true;
    }
  }


  editConstant(record: any) {
    const _popup = this.dialog.open(EditConstantFormComponent, {
      width: 'auto',
      maxHeight: 'auto',
      data: {
        element: record,
      },
    });
    _popup.afterClosed().subscribe(async (response) => {
        await this.getContatns();
    });
  }

  async toggle() {
    this.canPublish = !this.canPublish;
    this.variableService.updatePublishStatus(this.canPublish);
  }
}
