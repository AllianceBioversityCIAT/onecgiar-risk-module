import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDialogComponentTsComponent } from './project-dialog.component.ts.component';

describe('ProjectDialogComponentTsComponent', () => {
  let component: ProjectDialogComponentTsComponent;
  let fixture: ComponentFixture<ProjectDialogComponentTsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDialogComponentTsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDialogComponentTsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
