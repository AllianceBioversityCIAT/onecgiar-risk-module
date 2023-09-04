import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossaryFormComponent } from './glossary-form.component';

describe('GlossaryFormComponent', () => {
  let component: GlossaryFormComponent;
  let fixture: ComponentFixture<GlossaryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlossaryFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GlossaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
