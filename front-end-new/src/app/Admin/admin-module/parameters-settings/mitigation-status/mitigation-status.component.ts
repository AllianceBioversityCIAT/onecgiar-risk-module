import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MitigationStatusFormDialogComponent } from './mitigation-status-form-dialog/mitigation-status-form-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { MitigationStatusService } from 'src/app/services/mitigation-status.service';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';

@Component({
  selector: 'app-mitigation-status',
  templateUrl: './mitigation-status.component.html',
  styleUrls: ['./mitigation-status.component.scss'],
})
export class MitigationStatusComponent implements OnInit {


  displayedColumns: string[] = [
    'color',
    'id',
    'title',
    'description',
    'actions',
  ];
  dataSource: any;


  constructor(
    private toster: ToastrService,
    private mitigationService:MitigationStatusService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getData();
  }


  async getData() {
    this.dataSource = await  this.mitigationService.getMitigationStatus();
  }






  openFormDialog(element:any, action: string){
    const _popup = this.dialog.open(MitigationStatusFormDialogComponent,{
      width:'400px',
      height: 'auto',
      data:{
        element: element,
        action: action
      }
    });
    _popup.afterClosed().subscribe(response => {
      this.getData();
    });
  }

  editMitigation(element: any, action: string) {
    this.openFormDialog(element, action);
  }
  
  deleteMitigation(record: any) {
    const _popup = this.dialog.open(DeleteConfirmDialogComponent ,{
      width:'auto',
      height: 'auto',
      data:{
        id:record.id,
        title:'Delete',
        message: `Are you sure you want to delete ${record.title}`
      }
    });
    _popup.afterClosed().subscribe(async response => {
      if(response == true) {
        await this.mitigationService.deleteMitigationStatus(record.id)
        await this.getData();
        this.toster.success(`Delete ${record.title} successfully`);
      }
    });
  }
}
