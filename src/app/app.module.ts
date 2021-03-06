import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MaterialModule} from './material.module';
import {MenuComponent} from './menu/menu.component';
import {QuestionComponent} from './question/question.component';
import {CategoryComponent} from './question/category/category.component';
import {SectionComponent} from './question/section/section.component';
import {HeaderComponent} from './menu/header/header.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {environment} from '../environments/environment';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';
import {CategoryService} from './shared/category.service';
import {QuestionService} from './shared/question.service';
import {SectionService} from './shared/section.service';

import {ListQuestionsComponent} from './list-questions/list-questions.component';
import {TestComponent} from './test/test.component';
import {PhoneLoginComponent} from './phone-login/phone-login.component';
import * as firebase from 'firebase';
import {ProfileComponent} from './profile/profile.component';
import {QuestionModerationComponent} from './question-moderation/question-moderation.component';
import {TestResult} from 'tslint/lib/test';
import {TestResultComponent} from './test-result/test-result.component';
import {DemoComponent} from './demo/demo.component';
import {ListComponent} from './demo/list/list.component';
import {FirestoreSettingsToken} from '@angular/fire/firestore';
import {CommonService} from './shared/common.service';
import {RegistrationComponent} from './registration/registration.component';
import {CookieService} from 'ngx-cookie-service';
import {UserComponent} from './user/user.component';
import {CityComponent} from './city/city.component';
import {PositionComponent} from './position/position.component';
import {NewCompanyComponent} from './new-company/new-company.component';
import {CompanyListComponent} from './company-list/company-list.component';
import {CompanyEditComponent} from './company-list/company-edit/company-edit.component';
import {SubsidiaryComponent} from './subsidiary/subsidiary.component';
import {ExaminationComponent} from './examination/examination.component';
import {RaitingsComponent} from './ratings/raitings.component';
import {ExamListComponent} from './examination/exam-list/exam-list.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {ExamSettingComponent} from './examination/exam-setting/exam-setting.component';
import {SpecialityComponent} from './speciality/speciality.component';
import {StaffComponent} from './staff/staff.component';
import {CreatePasswordComponent} from './create-password/create-password.component';
import {ResultComponent} from './result/result.component';
import {CacheService} from './shared/cache.service';
import {DatePipe} from '@angular/common';
import {StudyCenterComponent} from './study-center/study-center.component';
import {ConditionTermsComponent} from './condition-terms/condition-terms.component';
import {PreliminaryStartComponent} from './preliminary-start/preliminary-start.component';
import {RatingV2Component} from './rating-v2/rating-v2.component';
import {StaffListComponent} from './staff/staff-list/staff-list.component';
import {AuthGuard} from './shared/auth.guard';
import {StudentAddComponent} from './student/student-add/student-add.component';
import {StudentListCompanyComponent} from './student-list-company/student-list-company.component';
import {DateSortPipe} from "./shared/pipe/date-sort.pipe";

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    QuestionComponent,
    CategoryComponent,
    SectionComponent,
    HeaderComponent,
    ListQuestionsComponent,
    TestComponent,
    PhoneLoginComponent,
    ProfileComponent,
    QuestionModerationComponent,
    TestResultComponent,
    DemoComponent,
    ListComponent, // For template list
    RegistrationComponent,
    UserComponent,
    CityComponent,
    PositionComponent,
    NewCompanyComponent,
    CompanyListComponent,
    CompanyEditComponent,
    SubsidiaryComponent,
    ExaminationComponent,
    RaitingsComponent,
    ExamListComponent,
    ExamSettingComponent,
    SpecialityComponent,
    StaffComponent,
    CreatePasswordComponent,
    ResultComponent,
    StudyCenterComponent,
    PreliminaryStartComponent,
    ConditionTermsComponent,
    RatingV2Component,
    StaffListComponent,
    StudentAddComponent,
    StudentListCompanyComponent,
    DateSortPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    NgxMaterialTimepickerModule,
  ],
  providers: [QuestionService,
    CookieService,
    SectionService,
    CacheService,
    DatePipe,
    CategoryService, {provide: FirestoreSettingsToken, useValue: {}}, CommonService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    AuthGuard,
    DateSortPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
