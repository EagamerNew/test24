import {Component, OnInit} from '@angular/core';
import {QuestionService} from '../shared/question.service';
import {QuestionSection} from '../question/section/question-section.model';
import {QuestionList} from '../list-questions/question-list';
import {CookieService} from 'ngx-cookie-service';
import {CommonService} from '../shared/common.service';

@Component({
  selector: 'app-question-moderation',
  templateUrl: './question-moderation.component.html',
  styleUrls: ['./question-moderation.component.css']
})
export class QuestionModerationComponent implements OnInit {

  constructor(private service: QuestionService,
              private cookieService: CookieService,
              private commonService: CommonService) {
  }

  allQuestionList: QuestionList[] = [];
  questionList: QuestionList[] = [];
  searchText: string = '';
  loading: boolean = true;
  companyList: any[] = [];
  categoryList: any[] = [];
  sectionList: any[] = [];

  /*
  * Status of questions:
  * 1 - in_moderation
  * 2 - accepted
  * 3 - rejected
  * 4 - in_archive
  * */

  ngOnInit(): void {
    this.cookieService.set('title', 'Модерация вопросов');
    this.getAllQuestions();
    this.getCategoryList();
    this.getCompanyList();
    this.getSectionList();
  }

  parseCustomInt(num: string) {
    return parseInt(num);
  }

  getAllQuestions(): void {
    this.loading = true;
    console.log(this.cookieService.get('userId'));
    if (this.cookieService.get('role') === 'admin') {
      this.service.getAllQuestions().subscribe(res => {
        this.allQuestionList = res.map(item => {
          return {
            docId: item.payload.doc.id,
            ...item.payload.doc.data()
          };
        });
        console.log('questionList: ', this.allQuestionList);
        this.questionList = this.allQuestionList;
        this.loading = false;
      });
    } else {
      this.commonService.getQuestionListByAuthorId(this.cookieService.get('userId')).then(res => {
        this.allQuestionList = res;
        console.log('questionList by userId : ', this.allQuestionList);
        this.questionList = this.allQuestionList;
        this.loading = false;
      });
    }
  }

  getCompanyNameById(id: string): any {
    this.companyList.forEach(value => {
      if (value.id === id) {
        return value.name;
      }
    });
  }

  getSectionNameById(id: string): any {
    this.sectionList.forEach(value => {
      if (value.id === id) {
        return value.name;
      }
    });
  }

  getCategoryNameById(id: string): any {
    this.categoryList.forEach(value => {
      if (value.id === id) {
        return value.name;
      }
    });
  }

  getCompanyList() {
    this.commonService.getCompanyList().then(res => {
      this.companyList = res;
    });
  }

  getCategoryList() {
    this.commonService.getCategoryList().then(res => {
      this.categoryList = res;
    });
  }

  getSectionList() {
    this.commonService.getCategoryList().then(res => {
      this.sectionList = res;
    });
  }

  activateQuestion(question): void {
    question.status = 'accepted';
    this.save(question);
  }

  archieveQuestion(question): void {
    question.status = 'in_archive ';
    console.log('archived!');
    this.save(question);
  }

  rejectQuestion(question): void {
    question.status = 'rejected';
    this.save(question);
  }

  trackByFn(index, item) {
    return index; // or item.id
  }

  save(question): void {
    this.service.updateQuestion(question).then(
      res => {
        this.getAllQuestions();
        console.log('success', JSON.stringify(res));
      }
    );
  }

  displayQuestion(hell: string): void {
    if (hell === 'all') {
      this.questionList = this.allQuestionList;
    } else {
      this.questionList = [];
      this.allQuestionList.forEach(value => {
        if (value.status === hell) {
          this.questionList.push(value);
        }
      });
    }
  }

  handleSearchString() {
    this.searchText = '';
  }

  countQuestionList(type: string): number {
    if (type === 'all') {
      return this.allQuestionList.length;
    } else {
      return this.allQuestionList.filter(value => value.status === type).length;
    }
  }

  searchQuestion(): void {
    if (this.searchText === '' || this.searchText === null || this.searchText.length === 0) {
      this.questionList = this.allQuestionList;
    } else {
      console.log(this.searchText);
      this.questionList = [];
      this.allQuestionList.forEach(value => {
        if (value.docId.toLowerCase().includes(this.searchText.toLowerCase())
          || value.description.toLowerCase().includes(this.searchText.toLowerCase())) {
          this.questionList.push(value);
        }
      });
    }
  }
}
