import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativesComponent } from './initiatives.component';

describe('InitiativesComponent', () => {
  let component: InitiativesComponent;
  let fixture: ComponentFixture<InitiativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiativesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
