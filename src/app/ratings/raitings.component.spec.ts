import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RaitingsComponent } from './raitings.component';

describe('RaitingsComponent', () => {
  let component: RaitingsComponent;
  let fixture: ComponentFixture<RaitingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaitingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RaitingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
