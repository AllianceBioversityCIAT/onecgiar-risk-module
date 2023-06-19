import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit{
  canPublish!: any;
  constructor(){
  }
  ngOnInit(): void {
    const curentPublishValue = localStorage.getItem('Publish');
    this.canPublish = curentPublishValue;
  }

  toggle() {
    this.canPublish = !this.canPublish;
    localStorage.setItem("Publish", JSON.stringify(this.canPublish));
  }
}
