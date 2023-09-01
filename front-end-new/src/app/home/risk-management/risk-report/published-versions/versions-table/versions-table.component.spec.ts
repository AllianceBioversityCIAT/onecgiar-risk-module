import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionsTableComponent } from './versions-table.component';

describe('VersionsTableComponent', () => {
  let component: VersionsTableComponent;
  let fixture: ComponentFixture<VersionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VersionsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
