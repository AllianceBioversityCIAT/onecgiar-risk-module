import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionsDashboardComponent } from './versions-dashboard.component';

describe('VersionsDashboardComponent', () => {
  let component: VersionsDashboardComponent;
  let fixture: ComponentFixture<VersionsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionsDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
