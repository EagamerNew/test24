import {Component, OnInit} from '@angular/core';
import {QuestionService} from "../shared/question.service";
import {QuestionList} from "../list-questions/question-list";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar} from "@angular/material";
import {CommonService} from "../shared/common.service";
import {CookieService} from "ngx-cookie-service";
import {RESULT_CODE_LIST} from "../shared/default-constant";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  answers: answer[] = [];
  pointTotal = 0;
  pointMust = 0;
  answer = new answer();
  saveAns = true;
  finish = false;
  questions: QuestionList[];
  dataForResult = {
    isTest: true,
    correct: '',
    mistake: '',
    score: '',
    category: "",
    section: "",
    title: "",
    userId: "",
    templateId: "",
    status: ''
  };

  constructor(private questionService: QuestionService,
              private route: ActivatedRoute,
              public snackBar: MatSnackBar,
              private commonService: CommonService,
              private cookieService: CookieService) {
  }

  templateId: string;
  template: any;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.templateId = params['id'];
      if (this.templateId) {
        this.questionService.getTemplateById(this.templateId).subscribe(res => {
          this.template = res.payload.data();
          console.log('template:', this.template.questionIdList);
          this.questionService.getQuestionListByIdIn(this.template.questionIdList).then(res => {
            this.questions = res;
            console.log('questionList: ', this.questions);
            if (this.questions.length === 0 || !this.questions) {
              this.openSnackBar('Вопросы не найдены!', '');
            }
          });
        });
      }
    });
  }

  answerSave(docId, i, answer) {
    let check = true;
    for (let j = 0; j < this.answers.length; j++) {
      if (this.answers[j].docId == docId) {
        this.answers[j].answer = answer;
        check = false;
        break;
      }
    }
    if (check) {
      this.answers.push({
        answer: answer,
        correctAnswer: this.questions[i].correctAnswer,
        docId: docId,
        point: this.questions[i].point
      });
    }
    if (this.answers.length == this.questions.length) {
      this.saveAns = false;
    }
  }

  save() {
    let correctCount = 0;
    let misCount = 0;
    for (let i = 0; i < this.answers.length; i++) {
      if (parseInt(this.answers[i].correctAnswer) === parseInt(this.answers[i].answer)) {
        // console.log("correct",i+1);
        correctCount += 1;
        this.pointTotal += parseInt(this.answers[i].point);
        this.pointMust += parseInt(this.answers[i].point);
      } else {
        misCount += 1;
        this.pointMust += parseInt(this.answers[i].point);
        // console.log("in correct",i+1)
      }
    }
    this.dataForResult.score = this.pointTotal + '';
    this.dataForResult.mistake = misCount + '';
    this.dataForResult.correct = correctCount + '';
    this.dataForResult.isTest = !this.template.isExamTemplate;
    this.dataForResult.title = this.template.name;
    this.dataForResult.userId = 'anonymous';
    this.dataForResult.templateId = this.templateId;
    this.dataForResult.status = RESULT_CODE_LIST.DONE.toString().toLowerCase();

    this.questionService.getCategoryNameById(this.template.categoryId).subscribe(res => {
      let result: any = res.payload.data();
      this.dataForResult.category = 'Категория не найдена';
      if (result) {
        this.dataForResult.category = result.name + '';
      }
      this.questionService.getSectionNameById(this.template.sectionId).subscribe(res => {
        let result: any = res.payload.data();
        this.dataForResult.section = 'Раздел не найден';
        if (result) {
          this.dataForResult.section = result.name + '';
        }
        console.log('data for result ', this.dataForResult);

        if (this.cookieService.get("userId")) {
          this.dataForResult.userId = this.cookieService.get("userId");
          this.saveResult(this.dataForResult);
        }
        this.finish = true;
      });
    });


  }


  saveResult(data): void {
    this.commonService.saveResult(data).then(res => {
      console.log('saveResult is success: ', res);
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}

class answer {
  docId?: string;
  answer?: string;
  point?: string;
  correctAnswer?: string;
}
