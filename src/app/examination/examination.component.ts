import { Component, OnInit } from '@angular/core';
import {QuestionCategory} from "../question/category/question-category.model";
import {QuestionSection} from "../question/section/question-section.model";
import {FireSQL} from "firesql";
import * as firebase from 'firebase';
import {MatSnackBar} from "@angular/material";
import {Router} from "@angular/router";
import {CommonService} from "../shared/common.service";
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-examination',
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.css']
})
export class ExaminationComponent implements OnInit {

  exam: any = {
    companyId: "",
    examinatorUserId: "",
    cityId: "",
    address: "",
    categoryId: "",
    sectionId: "",
    date:new Date(),
    status: 'active'
  };
  fireSQL;
  sections: QuestionSection[] = [];
  categories: QuestionCategory[] = [];
  sectionSelectDisable = true;
  companyList: any[];
  cityList: any[];
  examinatorList: any[];
  examTemplateList: any[];

  constructor(public snackBar: MatSnackBar,
              private router: Router,
              private commonService: CommonService,
              private cookieService: CookieService) { }

  ngOnInit(): void {
    this.cookieService.set('title', 'Экзамены');
    this.fireSQL = new FireSQL(firebase.firestore());
    this.getCompanyList();
    this.getCategories();
    this.getCityList();
    // this.getExaminatorList();
    // this.getExamTemplateList();
  }

  getCategories() {
    this.fireSQL.query(`SELECT __name__ as docId, name FROM category`).then(result => {
      this.categories = result.map(res => {
        return new QuestionCategory(res.docId, res.name);
      })
    })
  }

  getCompanyList(){
    this.commonService.getCompanyList().then(res=>{
      this.companyList = res;
    });
  }
  getExamTemplateList(){
    this.commonService.getExamTemplateList().then(res=>{
      this.examTemplateList = res;
    });
  }
  getExaminatorList(){
    this.commonService.getExamTemplateListByCompany(this.exam.companyId).then(res=>{
      this.examTemplateList = res;
    console.log(res,'222222222222222')
    });

    this.commonService.getExaminatorList(this.exam.companyId).subscribe(res=>{
      console.log('examinatorList:',res);
      if(res.length > 0){
        this.examinatorList = [];
        res.map(value => {
          this.examinatorList.push(
            {
              id: value.payload.doc.id,
              firstname: value.payload.doc.get("firstname"),
              lastname: value.payload.doc.get("lastname")
            }
          );
        });
      }else{
        this.openSnackBar('В данной компании отсутствуют экзаменаторы');
      }

    });
  }

  openSnackBar(message: string, action: string = '') {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getCityList(){
    this.commonService.getCityList().then(res=>{
      this.cityList = res;
    })
  }


  getSectionsByCategory(event) {
    // get data from DB by category ID
    this.exam.categoryId = event.value;
    console.log('categoryId: ', event.value);
    this.fireSQL.query(`SELECT __name__ as docId, name, categoryId FROM section WHERE categoryId = "` + event.value + `"`).then(result => {
        this.sections = result.map(res => {
          return new QuestionSection(res.docId, res.name, res.categoryId);
        })
      }
    )
    this.sectionSelectDisable = false;
  }

  save() {
    this.commonService.saveExam(this.exam).then(res=>{
      this.snackBar.open('Экзамен успешно создан','',{duration: 1000});
      this.router.navigateByUrl('');
    });
  }
}
