import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignOrganizationsComponent } from './assign-organizations.component';

describe('AssignOrganizationsComponent', () => {
  let component: AssignOrganizationsComponent;
  let fixture: ComponentFixture<AssignOrganizationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignOrganizationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignOrganizationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
