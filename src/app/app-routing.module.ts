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

const routes: Routes = [
  {path: '', component: MenuComponent},
  {path: 'question-category', component: CategoryComponent},
  {path: 'question-section', component: SectionComponent},
  {path: 'question', component: QuestionComponent},
  {path: 'questions-list-section', component: ListQuestionsComponent},
  {path: 'questions-list-section/:docId', component: ListQuestionsComponent},
  {path: 'test/:id', component: TestComponent},
  {path: 'login-phone', component: PhoneLoginComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'question-moderation', component: QuestionModerationComponent},
  {path: 'demo', component: DemoComponent},
  {path: 'demo-list', component: ListComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'city', component: CityComponent},
  {path: 'position', component: PositionComponent},
  {path: 'users', component: UserComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
