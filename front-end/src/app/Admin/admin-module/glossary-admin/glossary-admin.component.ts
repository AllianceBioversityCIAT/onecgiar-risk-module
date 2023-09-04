import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlossaryFormDialogComponent } from './glossary-form-dialog/glossary-form-dialog.component';
import { GlossaryService } from 'src/app/services/glossary.service';
import { ToastrService } from 'ngx-toastr';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
@Component({
  selector: 'app-glossary-admin',
  templateUrl: './glossary-admin.component.html',
  styleUrls: ['./glossary-admin.component.scss'],
})
export class GlossaryAdminComponent implements OnInit{
  constructor(    
    private dialog: MatDialog,
    private toster: ToastrService,
    private GlossaryService: GlossaryService
  ) {}

  data: any;

  displayedColumns: string[] = [
    'id',
    'title',
    'description',
    'actions'
  ];

  async ngOnInit() {
    await this.getData();

  }
  async getData() {
    this.data = await this.GlossaryService.getGlossary();
  }



  openFormDialog(id:any, action: string){
    const _popup = this.dialog.open(GlossaryFormDialogComponent,{
      width: '68rem',
      height: 'auto',
      data:{
        id:id,
        action: action
      }
    });
    _popup.afterClosed().subscribe(async response => {
      await this.getData();
    });
  }

  editGlossary(id: number, action: string) {
    this.openFormDialog(id, action);
  }


  deleteGlossary(record: any) {
    const _popup = this.dialog.open(DeleteConfirmDialogComponent ,{
      width:'auto',
      height: 'auto',
      data:{
        title:'Delete',
        message: `Are you sure you want to delete ${record.title}`
      }
    });
    _popup.afterClosed().subscribe(async response => {
      if(response == true) {
        await this.GlossaryService.deleteGlossary(record.id)
        this.getData();
        this.toster.success(`Delete ${record.title} successfully`);
      }
    });
  }
}
