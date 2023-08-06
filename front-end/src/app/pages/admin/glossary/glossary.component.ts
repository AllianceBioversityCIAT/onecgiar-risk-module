import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { ToastrService } from 'ngx-toastr';
import { GlossaryFormComponent } from './glossary-form/glossary-form.component';
import { GlossaryService } from 'src/app/services/glossary.service';
@Component({
  selector: 'app-glossary',
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent implements OnInit{
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
    const _popup = this.dialog.open(GlossaryFormComponent,{
      width:'400px',
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
    const _popup = this.dialog.open(ConfirmComponent ,{
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
        await this.GlossaryService.deleteGlossary(record.id)
        this.getData();
        this.toster.success(`Delete ${record.title} successfully`);
      }
    });
  }

}
