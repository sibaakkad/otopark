import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenGatesFormComponent } from './open-gates-form.component';

describe('OpenGatesFormComponent', () => {
  let component: OpenGatesFormComponent;
  let fixture: ComponentFixture<OpenGatesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenGatesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenGatesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
