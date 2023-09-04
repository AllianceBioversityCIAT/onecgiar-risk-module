import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossaryFormDialogComponent } from './glossary-form-dialog.component';

describe('GlossaryFormDialogComponent', () => {
  let component: GlossaryFormDialogComponent;
  let fixture: ComponentFixture<GlossaryFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlossaryFormDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlossaryFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
