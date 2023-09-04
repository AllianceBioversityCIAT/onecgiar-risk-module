import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchRisksComponent } from './search-risks.component';



describe('SearchInitiativesComponent', () => {
  let component: SearchRisksComponent;
  let fixture: ComponentFixture<SearchRisksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRisksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchRisksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
