import { Component, OnInit } from '@angular/core';
import { HeaderService } from 'src/app/header.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
})
export class AnnouncementsComponent implements OnInit {
  constructor(
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  ngOnInit(): void {
    this.title.setTitle('Announcements |Posted');
    this.meta.updateTag({
      name: 'description',
      content: 'Announcements |Posted',
    });
  }
}
