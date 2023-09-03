import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskDashboardComponent } from './risk-dashboard.component';

describe('RiskDashboardComponent', () => {
  let component: RiskDashboardComponent;
  let fixture: ComponentFixture<RiskDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
