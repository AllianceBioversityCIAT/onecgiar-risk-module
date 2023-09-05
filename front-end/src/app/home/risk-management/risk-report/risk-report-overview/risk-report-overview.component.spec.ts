import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskReportOverviewComponent } from './risk-report-overview.component';

describe('RiskReportOverviewComponent', () => {
  let component: RiskReportOverviewComponent;
  let fixture: ComponentFixture<RiskReportOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskReportOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskReportOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
