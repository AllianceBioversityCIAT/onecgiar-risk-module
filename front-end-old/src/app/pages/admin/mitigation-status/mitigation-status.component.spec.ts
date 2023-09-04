import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MitigationStatusComponent } from './mitigation-status.component';

describe('MitigationStatusComponent', () => {
  let component: MitigationStatusComponent;
  let fixture: ComponentFixture<MitigationStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MitigationStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MitigationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
