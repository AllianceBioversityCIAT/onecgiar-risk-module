import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ProjectsService } from 'src/app/services/projects.service';
import { ProjectDialogComponentTsComponent } from './project-dialog.component.ts/project-dialog.component.ts.component';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
})
export class ProjectsComponent implements OnInit {
  displayedColumns = ['official_code', 'name', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(private svc: ProjectsService, private dialog: MatDialog) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc.getProjects().then((data) => (this.dataSource.data = data));
  }

  openDialog(editData: any = null) {
    const ref = this.dialog.open(ProjectDialogComponentTsComponent, {
      width: '400px',
      data: editData,
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      // create or update
      if (editData) {
        this.svc.updateProject(editData.id, result).then(() => this.load());
      } else {
        this.svc.createProject(result).then(() => this.load());
      }
    });
  }

  delete(id: number) {
    this.dialog
      .open(DeleteConfirmDialogComponent, {
        data: { message: 'Delete this project?' },
      })
      .afterClosed()
      .subscribe((ok) => {
        if (ok) this.svc.deleteProject(id).then(() => this.load());
      });
  }
}
