import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmDialogComponent } from 'src/app/delete-confirm-dialog/delete-confirm-dialog.component';
import { FAQ } from 'src/app/shared-model/faq-data/faq.modle';

@Injectable({
  providedIn: 'root',
})
export class ApiFaqService {
  faqData: FAQ[] = [
    new FAQ(
      1,
      'why gfgf gfgfg does dsds redrtt redrt? >>>>>>>edited',
      `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`
    ),
    new FAQ(
      2,
      'why gfgf gfgfg does dsds redrtt redrt? >>>>>>>edited',
      `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`
    ),
    new FAQ(
      3,
      'why gfgf gfgfg does dsds redrtt redrt? >>>>>>>edited',
      `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum`
    ),
  ];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  openDialogDeleteFaq(msg: any) {
    return this.dialog.open(DeleteConfirmDialogComponent, {
      // width: '68rem',
      disableClose: true,
      data: {
        message: msg,
      },
    });
  }
}
