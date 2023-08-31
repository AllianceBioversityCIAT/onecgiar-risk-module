import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossaryAdminComponent } from './glossary-admin.component';

describe('GlossaryAdminComponent', () => {
  let component: GlossaryAdminComponent;
  let fixture: ComponentFixture<GlossaryAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlossaryAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlossaryAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
