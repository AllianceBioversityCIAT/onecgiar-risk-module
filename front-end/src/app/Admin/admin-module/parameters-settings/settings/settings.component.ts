import { Component } from '@angular/core';
import { HeaderService } from 'src/app/header.service';
import { VariableService } from 'src/app/services/variable.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  canPublish!: boolean;
  publishValue: any;
  constructor(
    private variableService: VariableService,
    private headerService: HeaderService
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  ngOnInit(): void {
    this.getPublishStatus();
  }

  async getPublishStatus() {
    this.publishValue = await this.variableService.getPublishStatus();
    if (this.publishValue.value == '0') {
      this.canPublish = false;
    } else {
      this.canPublish = true;
    }
  }

  async toggle() {
    this.canPublish = !this.canPublish;
    this.variableService.updatePublishStatus(this.canPublish);
  }
}
