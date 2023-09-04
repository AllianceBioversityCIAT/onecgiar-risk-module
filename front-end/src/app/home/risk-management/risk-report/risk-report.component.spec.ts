import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskReportComponent } from './risk-report.component';

describe('RiskReportComponent', () => {
  let component: RiskReportComponent;
  let fixture: ComponentFixture<RiskReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
