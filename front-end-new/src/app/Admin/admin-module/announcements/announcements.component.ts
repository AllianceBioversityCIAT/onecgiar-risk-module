import { Component, OnInit, ViewChild } from '@angular/core';

import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
})
export class AnnouncementsComponent implements OnInit {
  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor() {}

  ngOnInit(): void {}
}
