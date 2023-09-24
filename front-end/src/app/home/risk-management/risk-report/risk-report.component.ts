import {Component, OnInit} from '@angular/core';
import { AppSocket } from 'src/app/services/socket.service';

@Component({
  selector: 'app-risk-report',
  templateUrl: './risk-report.component.html',
  styleUrls: ['./risk-report.component.scss'],
})
export class RiskReportComponent implements OnInit{
constructor (private socket: AppSocket) {}

ngOnInit(): void {
  this.socket.connect();
}
}
