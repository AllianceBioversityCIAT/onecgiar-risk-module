import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProposedComponent } from './new-proposed.component';

describe('NewProposedComponent', () => {
  let component: NewProposedComponent;
  let fixture: ComponentFixture<NewProposedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewProposedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProposedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
