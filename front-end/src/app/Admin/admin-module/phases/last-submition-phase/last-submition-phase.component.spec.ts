import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastSubmitionPhaseComponent } from './last-submition-phase.component';

describe('LastSubmitionPhaseComponent', () => {
  let component: LastSubmitionPhaseComponent;
  let fixture: ComponentFixture<LastSubmitionPhaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LastSubmitionPhaseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastSubmitionPhaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
