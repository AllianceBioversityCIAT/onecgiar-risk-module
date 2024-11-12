import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncClarisaComponent } from './sync-clarisa.component';

describe('SyncClarisaComponent', () => {
  let component: SyncClarisaComponent;
  let fixture: ComponentFixture<SyncClarisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SyncClarisaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SyncClarisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
