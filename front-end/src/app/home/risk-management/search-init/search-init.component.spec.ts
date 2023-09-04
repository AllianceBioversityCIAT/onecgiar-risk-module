import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInitComponent } from './search-init.component';

describe('SearchInitComponent', () => {
  let component: SearchInitComponent;
  let fixture: ComponentFixture<SearchInitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchInitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
