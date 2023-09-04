import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedVersionsComponent } from './published-versions.component';

describe('PublishedVersionsComponent', () => {
  let component: PublishedVersionsComponent;
  let fixture: ComponentFixture<PublishedVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishedVersionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishedVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
