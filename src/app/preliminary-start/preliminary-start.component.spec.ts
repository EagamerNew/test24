import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreliminaryStartComponent } from './preliminary-start.component';

describe('PreliminaryStartComponent', () => {
  let component: PreliminaryStartComponent;
  let fixture: ComponentFixture<PreliminaryStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreliminaryStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreliminaryStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
