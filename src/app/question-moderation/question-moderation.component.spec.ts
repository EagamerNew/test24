import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionModerationComponent } from './question-moderation.component';

describe('QuestionModerationComponent', () => {
  let component: QuestionModerationComponent;
  let fixture: ComponentFixture<QuestionModerationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionModerationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionModerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
