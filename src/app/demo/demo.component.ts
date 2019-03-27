import {Component, OnInit} from '@angular/core';
import {FireSQL} from 'firesql'
import {AngularFireModule} from "@angular/fire";
import {QuestionCategory} from "../question/category/question-category.model";
import {QuestionSection} from "../question/section/question-section.model";
import {CategoryService} from "../shared/category.service";
import {SectionService} from "../shared/section.service";
import {QuestionService} from "../shared/question.service";
import {MatSnackBar} from "@angular/material";
import {AngularFirestore} from "@angular/fire/firestore";
import {Template} from "../shared/model/template";
import {ActivatedRoute, Route, Router} from "@angular/router";
import * as firebase from 'firebase';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  constructor(public snackBar: MatSnackBar,
              private router: Router) {

  }

  fireSQL;

  categories: QuestionCategory[] = [];
  categoryId: string;
  sections: QuestionSection[] = [];
  sectionId: string;
  sectionSelectDisable = true;
  countQuestion: number = 0;
  countAvailable: number = -1;
  templateName: string = "";

  questionIdList: string[] = [];

  ngOnInit() {
    this.fireSQL = new FireSQL(firebase.firestore());

    this.getCategories();
  }

  getCategories() {
    this.fireSQL.query(`SELECT __name__ as docId, name FROM category`).then(result => {
      this.categories = result.map(res => {
        return new QuestionCategory(res.docId, res.name);
      })
    })
  }


  getSectionsByCategory(event) {
    // get data from DB by category ID
    this.categoryId = event.value;
    console.log('categoryId: ', event.value);
    this.fireSQL.query(`SELECT __name__ as docId, name, categoryId FROM section WHERE categoryId = "` + event.value + `"`).then(result => {
        this.sections = result.map(res => {
          return new QuestionSection(res.docId, res.name, res.categoryId);
        })
      }
    )
    this.sectionSelectDisable = false;
  }

  getQuestionIdListBySectionId(event) {
    this.sectionId = event.value;
    console.log('sectionId: ', event.value);
    this.fireSQL.query(`SELECT __name__ as docId FROM question WHERE section = "` + event.value + `" AND status='accepted'`).then(result => {
      this.countAvailable = result.length;
      console.log('questionIdList: ', result);
      console.log('available: ', this.countAvailable);
      this.questionIdList = result.map(res => {
        return res.docId;
      })
    });
  }

  createTemplate() {
    if (this.countQuestion <= this.countAvailable && this.countQuestion > 0) {
      let idList = [];
      let randomList = [];
      for (let i = 0; i < this.countAvailable; i++) {
        randomList.push(i);
      }
      randomList = this.shuffle(randomList);

      for (let i = 0; i < this.countQuestion; i++) {
        idList.push(this.questionIdList[randomList[i]])
      }

      console.log('To push id: ', idList);

      let template: any = {
        name:"",
        categoryId:"",
        sectionId:"",
        questionIdList:[],
        status:"0"
      };
      template.questionIdList = idList;
      template.categoryId = this.categoryId;
      template.sectionId = this.sectionId;
      template.name = this.templateName;
      template.status = "0";

      console.log('template to create: ', template);

      var db = firebase.firestore();
      db.collection('template').add(template).then(res=>{
        this.openSnackBar('Шаблон успешно создан', '');
        setTimeout(new function(){
          // TODO navigate to demo - list
          // this.router.navigateByUrl('/demo-list');
        },300);

      });
    } else {
      this.openSnackBar('Ошибка! Количество вопросов не должно превышать доступных вопросов', '');
    }
  }

  shuffle(arr) {
    return arr.map(function (val, i) {
      return [Math.random(), i];
    }).sort().map(function (val) {
      return val[1];
    });
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
