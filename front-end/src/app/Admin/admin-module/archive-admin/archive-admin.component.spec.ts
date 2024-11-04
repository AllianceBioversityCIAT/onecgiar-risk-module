import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveAdminComponent } from './archive-admin.component';

describe('ArchiveAdminComponent', () => {
  let component: ArchiveAdminComponent;
  let fixture: ComponentFixture<ArchiveAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
