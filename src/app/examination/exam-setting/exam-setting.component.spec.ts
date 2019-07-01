import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSettingComponent } from './exam-setting.component';

describe('ExamSettingComponent', () => {
  let component: ExamSettingComponent;
  let fixture: ComponentFixture<ExamSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
