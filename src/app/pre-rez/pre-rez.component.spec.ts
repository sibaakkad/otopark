import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreRezComponent } from './pre-rez.component';

describe('PreRezComponent', () => {
  let component: PreRezComponent;
  let fixture: ComponentFixture<PreRezComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreRezComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreRezComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
