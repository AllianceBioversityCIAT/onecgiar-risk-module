import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-initiatives',
  templateUrl: './initiatives.component.html',
  styleUrls: ['./initiatives.component.scss']
})
export class InitiativesComponent {
  constructor(public router: Router) {
    
  }
  displayedColumns: string[] = ['INIT-ID', 'Initiative Name', 'Risk Category', 'Num of Risk', 'My Role', 'Actions'];
  dataSource = new MatTableDataSource<any>([
    {"INIT-ID": "INIT-1", "Initiative Name": "Accelerated Breeding: Meeting..", "Risk Category": "Partners and partnerships", "Num of Risk": "43", "My Role": "Co-leader"},
    {"INIT-ID": "INIT-1", "Initiative Name": "Accelerated Breeding: Meeting..", "Risk Category": "Partners and partnerships", "Num of Risk": "43", "My Role": "Co-leader"},
    {"INIT-ID": "INIT-1", "Initiative Name": "Accelerated Breeding: Meeting..", "Risk Category": "Partners and partnerships", "Num of Risk": "43", "My Role": "Co-leader"},
    {"INIT-ID": "INIT-1", "Initiative Name": "Accelerated Breeding: Meeting..", "Risk Category": "Partners and partnerships", "Num of Risk": "43", "My Role": "Co-leader"},
    {"INIT-ID": "INIT-1", "Initiative Name": "Accelerated Breeding: Meeting..", "Risk Category": "Partners and partnerships", "Num of Risk": "43", "My Role": "Co-leader"},
    {"INIT-ID": "INIT-1", "Initiative Name": "Accelerated Breeding: Meeting..", "Risk Category": "Partners and partnerships", "Num of Risk": "43", "My Role": "Co-leader"},
    {"INIT-ID": "INIT-1", "Initiative Name": "Accelerated Breeding: Meeting..", "Risk Category": "Partners and partnerships", "Num of Risk": "43", "My Role": "Co-leader"}
  ]);

  @ViewChild(MatPaginator) paginator: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
