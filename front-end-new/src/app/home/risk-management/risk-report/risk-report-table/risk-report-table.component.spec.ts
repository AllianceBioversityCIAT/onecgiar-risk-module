import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskReportTableComponent } from './risk-report-table.component';

describe('RiskReportTableComponent', () => {
  let component: RiskReportTableComponent;
  let fixture: ComponentFixture<RiskReportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskReportTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RiskReportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
