import {Component, OnInit, ViewChild} from '@angular/core';
import {QuestionService} from "../shared/question.service";
import {QuestionList} from "../list-questions/question-list";
import {ActivatedRoute} from "@angular/router";
import {MatSnackBar, MatStepper} from "@angular/material";
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

  @ViewChild('stepper') stepper: MatStepper;
  templateId: string;
  template: any;
  currentStep = 0;
  time = 20;
  fiinishNew = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.templateId = params['id'];
      if (this.templateId) {
        this.questionService.getTemplateById(this.templateId).subscribe(res => {
          this.template = res.payload.data();
          console.log('template:', this.template.questionIdList);
          this.questionService.getQuestionListByIdIn(this.template.questionIdList).then(res => {
            this.questions = res;
            if (this.template.isExamTemplate) {
              this.nextQuestion();
            }
            console.log('questionList: ', this.questions);
            if (this.questions.length === 0 || !this.questions) {
              this.openSnackBar('Вопросы не найдены!', '');
            }
          });
        });
      }
    });

  }

  nextQuestion() {
    setTimeout(s => {
      if (this.fiinishNew) {
        return null;
      }
      this.time -= 1;
      if (this.time < 0) {
        this.time = 0;
        return null;
      }
      console.log(this.currentStep, "   ", this.time)
      if (this.time == 0) {
        this.next('new');
      } else {
        this.nextQuestion()
      }
    }, 1000)
  }

  next(type) {
    console.log(JSON.stringify(this.questions[this.currentStep]))
    this.answerSave(this.questions[this.currentStep].docId, this.currentStep, -1);
    this.currentStep += 1;
    if (this.questions.length - 1 !== this.currentStep && this.currentStep < this.questions.length) {
      if (type === 'new') {
        console.log('nextQuestion')
        this.time = 20;
        this.nextQuestion();
      }
      console.log(type === 'new', '=--=-=---==--=-=-=-=-=--=-=-=-')
    } else {
      console.log('finis---------------------')
      this.fiinishNew = true;
      this.time = 20;
      this.end();
    }
  }

  end() {
    console.log('finis========================--------------------')

    setTimeout(s => {
      this.time -= 1;
      if (this.time < 0) {
        this.time = 0;
        return null;
      }
      if (this.time <= 0) {
        console.log(JSON.stringify(this.questions[this.currentStep]))
        this.answerSave(this.questions[this.currentStep].docId, this.currentStep, -1);
        console.log('finish')
        // this.save()
      } else {
        this.end()

      }
    }, 1000)

  }

  newTme(event) {
    // console.log(event)
    let s = event.selectedIndex - this.currentStep;
    this.fiinishNew = true;

    for (let i = 0; i < s - 1; i++) {
      this.time = 0;
      console.log('new TIME')
      this.next("check")
    }
    // console.log(this.currentStep)
    setTimeout(s => {
      this.fiinishNew = false;
      this.next("new")
    },1000);
    // this.currentStep = event.selectedIndex;
  }

  answerSave(docId, i, answer) {
    let check = true;
    this.currentStep = i;
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
