import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveFiltersComponent } from './archive-filters.component';

describe('ArchiveFiltersComponent', () => {
  let component: ArchiveFiltersComponent;
  let fixture: ComponentFixture<ArchiveFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchiveFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
