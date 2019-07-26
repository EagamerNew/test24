import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingV2Component } from './rating-v2.component';

describe('RatingV2Component', () => {
  let component: RatingV2Component;
  let fixture: ComponentFixture<RatingV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
