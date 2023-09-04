import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqFormDialogComponent } from './faq-form-dialog.component';

describe('FaqFormDialogComponent', () => {
  let component: FaqFormDialogComponent;
  let fixture: ComponentFixture<FaqFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
