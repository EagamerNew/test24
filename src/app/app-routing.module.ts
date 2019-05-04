import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MenuComponent} from './menu/menu.component';
import {QuestionComponent} from './question/question.component';
import {SectionComponent} from './question/section/section.component';
import {CategoryComponent} from './question/category/category.component';
import {ListQuestionsComponent} from './list-questions/list-questions.component';
import {TestComponent} from "./test/test.component";
import {PhoneLoginComponent} from "./phone-login/phone-login.component";
import {ProfileComponent} from "./profile/profile.component";
import {QuestionModerationComponent} from "./question-moderation/question-moderation.component";
import {DemoComponent} from "./demo/demo.component";
import {ListComponent} from "./demo/list/list.component";
import {RegistrationComponent} from "./registration/registration.component";
import {UserComponent} from "./user/user.component";
import {CityComponent} from './city/city.component';
import {PositionComponent} from './position/position.component';
import {NewCompanyComponent} from './new-company/new-company.component';
import {CompanyListComponent} from './company-list/company-list.component';
import {CompanyEditComponent} from './company-list/company-edit/company-edit.component';
import {SubsidiaryComponent} from "./subsidiary/subsidiary.component";
import {ExaminationComponent} from "./examination/examination.component";
import {RaitingsComponent} from "./ratings/raitings.component";
import {ExamListComponent} from "./examination/exam-list/exam-list.component";
import {ExamSettingComponent} from "./examination/exam-setting/exam-setting.component";
import {SpecialityComponent} from "./speciality/speciality.component";

const routes: Routes = [
  {path: '', component: MenuComponent},
  {path: 'question-category', component: CategoryComponent},
  {path: 'question-section', component: SectionComponent},
  {path: 'question', component: QuestionComponent},
  {path: 'questions-list-section', component: ListQuestionsComponent},
  {path: 'questions-list-section/:docId', component: ListQuestionsComponent},
  {path: 'test/:id', component: TestComponent},
  {path: 'test/:id/:examId', component: TestComponent},
  {path: 'login-phone', component: PhoneLoginComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'question-moderation', component: QuestionModerationComponent},
  {path: 'demo', component: DemoComponent},
  {path: 'demo-list', component: ListComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'city', component: CityComponent},
  {path: 'position', component: PositionComponent},
  {path: 'new-company', component: NewCompanyComponent},
  {path: 'company-list', component: CompanyListComponent},
  {path: 'company-list/:id', component: CompanyEditComponent},
  {path: 'subsidiary', component: SubsidiaryComponent},
  {path: 'users', component: UserComponent},
  {path: 'ratings', component: RaitingsComponent},
  {path: 'exam', component: ExaminationComponent},
  {path: 'exam-list', component: ExamListComponent},
  {path: 'exam-setting/:id', component: ExamSettingComponent},
  {path: 'speciality', component: SpecialityComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
