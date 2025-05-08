import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsService } from 'src/app/services/projects.service';
import { ProjectDialogComponentTsComponent } from './project-dialog.component.ts/project-dialog.component.ts.component';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { HeaderService } from 'src/app/header.service';
import { MatTableDataSource } from '@angular/material/table';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  displayedColumns = ['official_code', 'name', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    private svc: ProjectsService,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private title: Title,
    private meta: Meta
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  ngOnInit() {
    this.load();

    this.title.setTitle('Projects');
    this.meta.updateTag({ name: 'description', content: 'Projects' });
  }

  async load() {
    const programs = await this.svc.getAll();
    this.dataSource.data = programs;
  }

  openDialog(program?: any) {
    const ref = this.dialog.open(ProjectDialogComponentTsComponent, {
      width: '400px',
      data: { program },
    });
    ref.afterClosed().subscribe((ok) => {
      if (ok) this.load();
    });
  }

  edit(row: any) {
    this.openDialog(row);
  }
  delete(row: any) {
    if (confirm(`Delete "${row.official_code}"?`)) {
      this.svc.delete(row.id).then(() => this.load());
    }
  }
}
