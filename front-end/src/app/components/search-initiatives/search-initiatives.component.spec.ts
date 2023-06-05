import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInitiativesComponent } from './search-initiatives.component';

describe('SearchInitiativesComponent', () => {
  let component: SearchInitiativesComponent;
  let fixture: ComponentFixture<SearchInitiativesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchInitiativesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchInitiativesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
