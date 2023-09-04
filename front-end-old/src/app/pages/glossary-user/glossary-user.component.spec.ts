import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossaryUserComponent } from './glossary-user.component';

describe('GlossaryUserComponent', () => {
  let component: GlossaryUserComponent;
  let fixture: ComponentFixture<GlossaryUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlossaryUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlossaryUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
