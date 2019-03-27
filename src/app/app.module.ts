import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FlexLayoutModule } from '@angular/flex-layout'
import { MaterialModule } from './material.module';
import { MenuComponent } from './menu/menu.component';
import { QuestionComponent } from './question/question.component';
import { CategoryComponent } from './question/category/category.component';
import { SectionComponent } from './question/section/section.component';
import { HeaderComponent } from './menu/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { environment } from "../environments/environment";

import { CategoryService } from "./shared/category.service";
import { QuestionService } from "./shared/question.service";
import { SectionService } from "./shared/section.service";

import { ListQuestionsComponent } from './list-questions/list-questions.component';
import { TestComponent } from './test/test.component';
import {PhoneLoginComponent} from "./phone-login/phone-login.component";
import * as firebase from 'firebase';
import { ProfileComponent } from './profile/profile.component';
import {QuestionModerationComponent} from "./question-moderation/question-moderation.component";
import {TestResult} from "tslint/lib/test";
import {TestResultComponent} from "./test-result/test-result.component";
import {DemoComponent} from "./demo/demo.component";
import {ListComponent} from "./demo/list/list.component";
import { FirestoreSettingsToken } from '@angular/fire/firestore';
import {CommonService} from "./shared/common.service";
import {RegistrationComponent} from "./registration/registration.component";
import {CookieService} from "ngx-cookie-service";

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
    RegistrationComponent
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

  ],
  providers: [QuestionService,
    CookieService,
    SectionService,
    CategoryService,{ provide: FirestoreSettingsToken, useValue: {} },CommonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
