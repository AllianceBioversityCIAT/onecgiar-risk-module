import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametersSettingsComponent } from './parameters-settings.component';

describe('ParametersSettingsComponent', () => {
  let component: ParametersSettingsComponent;
  let fixture: ComponentFixture<ParametersSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParametersSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParametersSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
