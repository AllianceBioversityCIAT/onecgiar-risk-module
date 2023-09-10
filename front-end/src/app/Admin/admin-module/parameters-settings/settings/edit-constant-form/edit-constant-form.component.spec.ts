import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConstantFormComponent } from './edit-constant-form.component';

describe('EditConstantFormComponent', () => {
  let component: EditConstantFormComponent;
  let fixture: ComponentFixture<EditConstantFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditConstantFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditConstantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
