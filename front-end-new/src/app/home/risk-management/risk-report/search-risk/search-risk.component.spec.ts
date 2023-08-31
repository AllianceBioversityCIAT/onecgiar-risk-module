import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchRiskComponent } from './search-risk.component';

describe('SearchRiskComponent', () => {
  let component: SearchRiskComponent;
  let fixture: ComponentFixture<SearchRiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRiskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
