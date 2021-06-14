import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakeResComponent } from './make-res.component';

describe('MakeResComponent', () => {
  let component: MakeResComponent;
  let fixture: ComponentFixture<MakeResComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakeResComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakeResComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
