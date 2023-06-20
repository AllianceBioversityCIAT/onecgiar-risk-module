import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { ToastrService } from 'ngx-toastr';
import { MitigationStatusService } from 'src/app/services/mitigation-status.service';
import { MitigationFormComponent } from './mitigation-form/mitigation-form.component';

@Component({
  selector: 'app-mitigation-status',
  templateUrl: './mitigation-status.component.html',
  styleUrls: ['./mitigation-status.component.scss']
})
export class MitigationStatusComponent implements OnInit{

  constructor(
    private dialog: MatDialog,
    private toster: ToastrService,
    private mitigationService:MitigationStatusService
    ){}

    ngOnInit(): void {
      this.getData();
    }

    mitigations: any;

    displayedColumns: string[] = [
      'id',
      'title',
      'description',
      'actions'
    ];


   async getData() {
      this.mitigations = await  this.mitigationService.getMitigation();
    }


    openFormDialog(id:any, action: string){
      const _popup = this.dialog.open(MitigationFormComponent,{
        width:'400px',
        height: 'auto',
        data:{
          id:id,
          action: action
        }
      });
      _popup.afterClosed().subscribe(response => {
        this.getData();
      });
    }

    editMitigation(id: number, action: string) {
      this.openFormDialog(id, action);
    }
    
    deleteMitigation(record: any) {
      const _popup = this.dialog.open(ConfirmComponent ,{
        width:'auto',
        height: 'auto',
        data:{
          id:record.id,
          title:'Delete',
          message: `Are you sure you want to delete ${record.title}`
        }
      });
      _popup.afterClosed().subscribe(response => {
        if(response == true) {
          this.mitigationService.deleteMitigation(record.id).subscribe(res => {
            this.getData();
            this.toster.error(`Delete ${record.title} successfully`);
          });
        }
      });
    }

}
