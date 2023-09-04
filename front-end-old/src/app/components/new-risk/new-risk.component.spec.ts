import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRiskComponent } from './new-risk.component';

describe('NewRiskComponent', () => {
  let component: NewRiskComponent;
  let fixture: ComponentFixture<NewRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRiskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
