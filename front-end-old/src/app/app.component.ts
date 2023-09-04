import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'risk';
  ngOnInit(): void {
    if(!localStorage.getItem("Publish")) {
      localStorage.setItem("Publish", JSON.stringify(true));
    }
  }
}
