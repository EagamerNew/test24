import {Component, OnInit, ViewChild} from '@angular/core';
import {QuestionService} from '../shared/question.service';
import {QuestionList} from '../list-questions/question-list';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar, MatStepper} from '@angular/material';
import {CommonService} from '../shared/common.service';
import {CookieService} from 'ngx-cookie-service';
import {RESULT_CODE_LIST} from '../shared/default-constant';
import {CacheService} from '../shared/cache.service';
import {DatePipe} from '@angular/common';

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
  nextQes = true;
  finish = false;
  questions: QuestionList[];
  dataForResult = {
    isTest: true,
    correct: '',
    mistake: '',
    score: '',
    scoreMust: '',
    category: '',
    section: '',
    title: '',
    userId: '',
    templateId: '',
    status: '',
    username: '',
    date: '',
    time: '',
    companyName: '',
    examinatorUserId: ''
  };
  companyInfo: any;

  selectedAnswer: number = -1;

  constructor(private questionService: QuestionService,
              private route: ActivatedRoute,
              public snackBar: MatSnackBar,
              private commonService: CommonService,
              private cacheService: CacheService,
              private datePipe: DatePipe,
              private cookieService: CookieService) {
  }

  @ViewChild('stepper') stepper: MatStepper;
  templateId: string;
  template: any;
  currentStep = 0;
  time = 20;
  fiinishNew = false;
  saved = false;
  examId: string = '';
  userId: string = '';

  ngOnInit() {
    this.userId = this.cookieService.get('userId');
    this.route.params.subscribe(params => {
      this.templateId = params['id'];
      this.examId = params['examId'];
      if (this.examId) {
        this.cookieService.set('title', 'Экзамен');
      } else {
        this.cookieService.set('title', 'Тест');
      }
      if (this.templateId) {
        this.questionService.getTemplateById(this.templateId).subscribe(res => {
          this.template = res.payload.data();
          console.log('template:', this.template);
          this.questionService.getAvailableQuetionIdList(this.template).then(qst => {
            const questionAvailableIdList = qst.map(res => {
              return res.docId;
            });
            console.log('questionAvailableIdList: ', questionAvailableIdList);
            let idList = [];
            let randomList = [];
            for (let i = 0; i < questionAvailableIdList.length; i++) {
              randomList.push(i);
            }

            randomList = this.shuffle(randomList);
            for (let i = 0; i < this.template.questionIdList.length; i++) {
              idList.push(questionAvailableIdList[randomList[i]]);
            }
            console.log('idList: ', idList);
            this.questionService.getQuestionListByIdIn(idList).then(res => {
              this.questions = res;
              if (this.template.isExamTemplate) {
                this.examId = params['examId'];
                this.nextQuestion();
              }
              console.log('questionList: ', this.questions);
              if (this.questions.length === 0 || !this.questions) {
                this.openSnackBar('Вопросы не найдены!', '');
              }
            });
          });
          // examinator fio
          console.log('exmId before: ', this.examId);
          if (this.examId) {
            this.commonService.findExaminatorUseridByExamId(this.examId).then(result => {
              console.log('findExaminatorUseridByExamId: ', result);
              if (result[0]) {
                this.dataForResult.examinatorUserId = result[0].examinatorUserId;
                console.log('findExaminatorUseridByExamId(after): ', this.dataForResult.examinatorUserId);
              }
            });
          }
        });
      }
    });

  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  shuffle(arr) {
    return arr.map(function (val, i) {
      return [Math.random(), i];
    }).sort().map(function (val) {
      return val[1];
    });
  }

  //.mat-stepper-label-position-bottom .mat-horizontal-stepper-header-container

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
      console.log(this.currentStep, '   ', this.time);
      if (this.time == 0) {
        this.next();
      } else {
        this.nextQuestion();
      }
    }, 1000);
  }

  next() {
    this.check();
    if (this.questions.length - 1 !== this.currentStep && this.currentStep < this.questions.length) {
      this.currentStep += 1;
      this.time = 20;
      this.nextQuestion();
    } else {
      console.log('finis---------------------');
      this.fiinishNew = true;
      this.time = 20;
      this.end();
    }
  }

  nextQ() {
    this.selectedAnswer = -1;
    this.time = 1;
  }

  check() {
    let check = true;
    for (let i = 0; i < this.answers.length; i++) {
      if (this.answers[i].docId === this.questions[this.currentStep].docId) {
        check = false;
        break;
      }
    }
    if (check) {
      this.answerSave(this.questions[this.currentStep].docId, this.currentStep, -1);
    }
  }

  end() {
    console.log('finis========================--------------------');
    this.save();
  }

  nextQESTIONNEW() {
    if (!this.template.isExamTemplate && !this.nextQes) {
      if (this.questions.length - 1 !== this.currentStep && this.currentStep < this.questions.length) {
        this.currentStep += 1;
        this.selectedAnswer = -1;
        this.nextQes = true;
      } else {
        this.save();
      }

    }
  }

  answerSave(docId, i, answer) {
    this.selectedAnswer = answer;
    let check = true;
    this.nextQes = false;
    // if (!this.template.isExamTemplate) {
    //   if (this.questions.length - 1 !== this.currentStep && this.currentStep < this.questions.length) {
    //     this.currentStep += 1;
    //     this.selectedAnswer = -1;
    //   }
    //
    // }
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
        point: this.questions[i].point,
        questionIndex: parseInt(i)
      });
    }
    if (this.answers.length == this.questions.length) {
      this.saveAns = false;
    }
    // if (this.template.isExamTemplate) {
    //   this.nextQ();
    // }
  }


  save() {
    if (!this.saved) {
      this.saved = true;
      this.time = 1;
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
        }
        console.log('-------------------------------------');
        console.log('this.questions[this.answers[i].questionIndex]: ', this.questions[this.answers[i].questionIndex]);
        console.log(this.questions[this.answers[i].questionIndex].answersCount);
        console.log(this.questions[this.answers[i].questionIndex].answersCountTotal);
        console.log('++++++++++++++++++++++++++++++++++++');

        if (this.questions[this.answers[i].questionIndex].answersCountTotal !== undefined) {
          this.questions[this.answers[i].questionIndex].answersCount[this.answers[i].answer] += 1;
          this.questions[this.answers[i].questionIndex].answersCountTotal += 1;
          console.log('---------------------+++++---------------');
          console.log('this.questions[this.answers[i].questionIndex]: ', this.questions[this.answers[i].questionIndex]['answersCount']);
        } else {
          this.questions[this.answers[i].questionIndex]['answersCountTotal'] = 1;
          this.questions[this.answers[i].questionIndex]['answersCount'] = this.questions[this.answers[i].questionIndex].answers.map(res => {
            return 0;
          });
          this.questions[this.answers[i].questionIndex].answersCount[this.answers[i].answer] = 1;
        }

        console.log('for res:');

        console.log(this.questions[this.answers[i].questionIndex].answersCount);
        console.log(this.questions[this.answers[i].questionIndex].answersCountTotal);

        this.questionService.updateQuestionIndex(this.questions[this.answers[i].questionIndex].docId,
          this.questions[this.answers[i].questionIndex].answersCount,
          this.questions[this.answers[i].questionIndex].answersCountTotal).then(res => {
          console.log('res:', res);
          console.log('question:', this.questions[this.answers[i].questionIndex]);
        });
      }
      const startDate = new Date();
      const startMinutes = startDate.getMinutes().toString().length === 1 ? '0' + startDate.getMinutes().toString() : startDate.getMinutes().toString();
      const startHours = startDate.getHours().toString().length === 1 ? '0' + startDate.getHours().toString() : startDate.getHours().toString();
      this.dataForResult.score = this.pointTotal + '';
      this.dataForResult.scoreMust = this.pointMust + '';
      this.dataForResult.mistake = misCount + '';
      this.dataForResult.correct = correctCount + '';
      this.dataForResult.isTest = !this.template.isExamTemplate;
      this.dataForResult.title = this.template.name;
      this.dataForResult.userId = 'anonymous';
      this.dataForResult.templateId = this.templateId;
      this.dataForResult.date = this.datePipe.transform(startDate, 'dd-MM-yyyy');
      this.dataForResult.time = startHours + ':' + startMinutes;
      this.dataForResult.status = RESULT_CODE_LIST.DONE.toString().toLowerCase();
      this.commonService.getCompanyById(this.template.companyId).then(com => {
        this.dataForResult.companyName = 'Компания не найдена';
        let coms: any = com[0];
        if (coms) {
          this.companyInfo = coms;
          this.dataForResult.companyName = coms.name;
        }
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
            console.log('trust: ', this.cookieService.get('userId'));

            if (this.cookieService.get('userId')) {
              this.dataForResult.userId = this.cookieService.get('userId');
              this.commonService.getUserByDocId(this.dataForResult.userId).then(res => {
                this.dataForResult.username = res[0].lastname + ' ' + res[0].firstname;
                this.saveResult(this.dataForResult);
              });
            } else {
              let results: any = this.cacheService.get('results');
              if (!results) {
                results = [];
              }
              results.push(this.dataForResult);
              this.cacheService.set('results', results);
              console.log('results: ', results);
            }
            this.finish = true;
          });
        });
      });
    }
  }

  saveResult(data): void {
    this.commonService.saveResult(data).then(res => {
      console.log('saveResult is success: ', res.id);
      if (this.examId) {
        this.commonService.saveExamParticipant(res.id, this.userId, this.examId);
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}

class answer {
  docId?: string;
  questionIndex?: number;
  answer?: string;
  point?: string;
  correctAnswer?: string;
}
