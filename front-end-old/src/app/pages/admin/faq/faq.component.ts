import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FaqFormComponent } from './faq-form/faq-form.component';
import { ConfirmComponent } from 'src/app/components/confirm/confirm.component';
import { FAQService } from 'src/app/services/faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FAQComponent implements OnInit{

  constructor(    
    private dialog: MatDialog,
    private toster: ToastrService,
    private FaqService: FAQService,
  ) {}


  data: any;

  displayedColumns: string[] = [
    'id',
    'question',
    'answer',
    'actions'
  ];

  async ngOnInit() {
    await this.getData();

  }


  async getData() {
    this.data = await this.FaqService.getData();
  }

  openFormDialog(id:any, action: string){
    const _popup = this.dialog.open(FaqFormComponent,{
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

  editFAQ(id: number, action: string) {
    this.openFormDialog(id, action);
  }


  deleteFAQ(record: any) {
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
        await this.FaqService.deleteFaq(record.id)
        this.getData();
        this.toster.success(`Delete ${record.title} successfully`);
      }
    });
  }
}
