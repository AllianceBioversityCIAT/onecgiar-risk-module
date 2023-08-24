import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutRiskComponent } from './about-risk.component';

describe('AboutRiskComponent', () => {
  let component: AboutRiskComponent;
  let fixture: ComponentFixture<AboutRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutRiskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
