import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedVersionsComponent } from './archived-versions.component';

describe('ArchivedVersionsComponent', () => {
  let component: ArchivedVersionsComponent;
  let fixture: ComponentFixture<ArchivedVersionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchivedVersionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivedVersionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
