import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationStatusFormDialogComponent } from './mitigation-status-form-dialog.component';

describe('MitigationStatusFormDialogComponent', () => {
  let component: MitigationStatusFormDialogComponent;
  let fixture: ComponentFixture<MitigationStatusFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MitigationStatusFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MitigationStatusFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
