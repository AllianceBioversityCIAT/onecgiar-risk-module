import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedVersionComponent } from './archived-version.component';

describe('ArchivedVersionComponent', () => {
  let component: ArchivedVersionComponent;
  let fixture: ComponentFixture<ArchivedVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedVersionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivedVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
