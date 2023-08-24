import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionsControlsFormDialogComponent } from './actions-controls-form-dialog.component';

describe('ActionsControlsFormDialogComponent', () => {
  let component: ActionsControlsFormDialogComponent;
  let fixture: ComponentFixture<ActionsControlsFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionsControlsFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionsControlsFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
