import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralTabelComponent } from './general-tabel.component';

describe('GeneralTabelComponent', () => {
  let component: GeneralTabelComponent;
  let fixture: ComponentFixture<GeneralTabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralTabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralTabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
