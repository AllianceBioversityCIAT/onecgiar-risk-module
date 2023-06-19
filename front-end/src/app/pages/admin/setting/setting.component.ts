import { Component, OnInit } from '@angular/core';
import { VariableService } from 'src/app/services/variable.service';
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit{
  canPublish!: boolean;
  constructor(private variableService: VariableService){
  }
  ngOnInit(): void {
    this.getPublishStatus()
  }

  getPublishStatus() {
    this.variableService.getPublishStatus().subscribe(res => {
      if(res.value == '0') {
        this.canPublish = false;
      }
      else {
        this.canPublish = true;
      }
    })
  }

  toggle() {
    this.canPublish = !this.canPublish;
    this.variableService.updatePublishStatus(this.canPublish).subscribe(val => {
    });
  }
}
