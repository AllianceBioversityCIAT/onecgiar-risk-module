import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQUserComponent } from './faq-user.component';

describe('FAQUserComponent', () => {
  let component: FAQUserComponent;
  let fixture: ComponentFixture<FAQUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FAQUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FAQUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
