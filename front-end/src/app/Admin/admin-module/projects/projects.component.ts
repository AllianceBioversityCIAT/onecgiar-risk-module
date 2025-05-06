import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsService } from 'src/app/services/projects.service';
import { ProjectDialogComponentTsComponent } from './project-dialog.component.ts/project-dialog.component.ts.component';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { HeaderService } from 'src/app/header.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  dataSource: any[] = [];

  displayedColumns = ['name', 'official_code', 'actions'];

  constructor(
    private readonly service: ProjectsService,
    private headerService: HeaderService,
    private readonly dialog: MatDialog
  ) {
    this.headerService.background = '#04030f';
    this.headerService.backgroundNavMain = '#0f212f';
    this.headerService.backgroundUserNavButton = '#0f212f';
  }

  async ngOnInit(): Promise<void> {
    await this.reload();
  }

  async reload(): Promise<void> {
    this.dataSource = await this.service.findAll();
  }

  /** open create / edit dialog */
  openDialog(project?: any): void {
    const ref = this.dialog.open(ProjectDialogComponentTsComponent, {
      width: '600px',
      data: project ?? null,
      autoFocus: false,
      disableClose: true,
    });

    ref.afterClosed().subscribe(async (changed) => {
      if (changed) {
        await this.reload();
      }
    });
  }

  /** open confirmation dialog before delete */
  confirmDelete(project: any): void {
    const ref = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Delete Project',
        message: `Are you sure you want to delete “${project.name}”?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
      autoFocus: false,
    });

    ref.afterClosed().subscribe(async (confirmed) => {
      if (confirmed) {
        await this.service.remove(project.id);
        await this.reload();
      }
    });
  }
}
