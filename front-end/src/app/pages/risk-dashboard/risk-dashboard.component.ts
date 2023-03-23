import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-risk-dashboard',
  templateUrl: './risk-dashboard.component.html',
  styleUrls: ['./risk-dashboard.component.scss']
})
export class RiskDashboardComponent {

  constructor(public router: Router) {
    
  }
}
