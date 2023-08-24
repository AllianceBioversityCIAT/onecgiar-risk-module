import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceleratedBreedingVersionComponent } from './accelerated-breeding-version.component';

describe('AcceleratedBreedingVersionComponent', () => {
  let component: AcceleratedBreedingVersionComponent;
  let fixture: ComponentFixture<AcceleratedBreedingVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceleratedBreedingVersionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceleratedBreedingVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
