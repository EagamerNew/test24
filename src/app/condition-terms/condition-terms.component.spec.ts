import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionTermsComponent } from './condition-terms.component';

describe('ConditionTermsComponent', () => {
  let component: ConditionTermsComponent;
  let fixture: ComponentFixture<ConditionTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConditionTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConditionTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
