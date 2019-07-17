import {Component, OnInit} from '@angular/core';
import {QuestionService} from "../shared/question.service";
import {QuestionSection} from "../question/section/question-section.model";
import {QuestionList} from "../list-questions/question-list";
import {CommonService} from "../shared/common.service";
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-raitings',
  templateUrl: './raitings.component.html',
  styleUrls: ['./raitings.component.css']
})
export class RaitingsComponent implements OnInit {

  constructor(private service: QuestionService,
              private _serviceCommon: CommonService,
              private cookieService: CookieService) {
  }

  showList: boolean[] = [];
  results: any[] = [];
  result: any;
  sortingResulsts: any[] = [];
  ratingResults: Rating[] = [];
  ratingResultsNew: Rating[] = [];
  ratingResult: Rating = new Rating();


  ngOnInit(): void {
    this.cookieService.set('title', 'Рейтинг');
    this.getResultList();
  }


  getResultList(): void {
    this._serviceCommon.getResultList('ratings').then(res => {
      this.results = res.map(result => {
        return {
          id: result.id,
          isTest: result.isTest,
          correct: result.correct,
          mistake: result.mistake,
          scoreMust: parseInt(result.scoreMust),
          score: parseInt(result.score),
          category: result.category,
          section: result.section,
          title: result.title,
          userId: result.userId,
          username: result.username
        }
      });
      this.getResultsGroupByUserAndSection()
    })
  }

  getResultsGroupByUserAndSection() {
    for (let i = 0; i < this.results.length; i++) {
      this.result = new Object();
      this.result.count = 0;
      this.result.score = 0;
      this.result.scoreMust = 0;
      let check = false;
      for (let j = 0; j < this.sortingResulsts.length; j++) {
        if (this.results[i].userId == this.sortingResulsts[j].userId &&
          this.results[i].category == this.sortingResulsts[j].category) {
          check = true;
          break;
        }
      }
      if (check) {
        continue;
      }
      for (let j = i; j < this.results.length; j++) {
        if (this.results[i].userId == this.results[j].userId && this.results[i].category == this.results[j].category) {
          this.result.score += this.results[j].score;
          if (this.results[j].scoreMust) {
            this.result.scoreMust += this.results[j].scoreMust;
          }
          this.result.count += 1;
        }
      }
      this.result.id = this.results[i].id;
      this.result.isTest = this.results[i].isTest;
      this.result.correct = this.results[i].correct;
      this.result.mistake = this.results[i].mistake;
      this.result.category = this.results[i].category;
      this.result.section = this.results[i].section;
      this.result.title = this.results[i].title;
      this.result.userId = this.results[i].userId;
      this.result.username = this.results[i].username;
      this.sortingResulsts.push(this.result);
    }
    this.getRaitingNEW();
  }

  getRaitingNEW(): void {
    for (let i = 0; i < this.sortingResulsts.length; i++) {
      let check = false;
      for (let e = 0; e < this.ratingResultsNew.length; e++) {
        if (this.ratingResultsNew[e].userId === this.sortingResulsts[i].userId) {
          check = true;
          break;
        }
      }
      if (!check) {
        this.ratingResult = new Rating();
        for (let j = i; j < this.sortingResulsts.length; j++) {
          if (this.sortingResulsts[j].count >= 5 && this.sortingResulsts[i].userId === this.sortingResulsts[j].userId) {
            this.ratingResult.userId = this.sortingResulsts[j].userId;
            this.ratingResult.count += this.sortingResulsts[j].count;
            this.ratingResult.username = this.sortingResulsts[j].username;
            this.ratingResult.scoreTotal += this.sortingResulsts[j].score;
            this.ratingResult.scoreMust += this.sortingResulsts[j].scoreMust;
          }
        }
        if(this.ratingResult.userId){
          this.ratingResultsNew.push(this.ratingResult);
          this.showList.push(false);
        }
      }
    }
  }

  getRatingGroupByUser(): void {
    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i].isTest) {
        this.ratingResult = new Rating();
        this.ratingResult.count = 1;
        this.ratingResult.scoreTotal = this.results[i].score;
        this.ratingResult.scoreMust = this.results[i].scoreMust;
        this.ratingResult.userId = this.results[i].userId;
        this.ratingResult.username = this.results[i].username;

      } else {
        continue;
      }
      let check = false;
      for (let j = 0; j < this.ratingResults.length; j++) {

        if (this.ratingResults[j].userId === this.ratingResult.userId) {
          check = true;
          break;
        }
      }
      if (check) {
        continue;
      }
      for (let j = i + 1; j < this.results.length; j++) {
        if (this.results[j].isTest && this.ratingResult.userId === this.results[j].userId) {
          this.ratingResult.scoreTotal += this.results[j].score;
          this.ratingResult.scoreMust += this.results[j].scoreMust;
          this.ratingResult.count += 1;
        } else {
          continue;
        }
      }
      this.ratingResults.push(this.ratingResult);

    }

    for (let j = 0; j < this.ratingResults.length; j++) {
      for (let k = j; k < this.ratingResults.length; k++) {
        if (this.ratingResults[j].scoreTotal / this.ratingResults[j].count <
          this.ratingResults[k].scoreTotal / this.ratingResults[k].count) {
          this.ratingResult = new Rating();
          this.ratingResult = this.ratingResults[k];
          this.ratingResults[k] = this.ratingResults[j];
          this.ratingResults[j] = this.ratingResult;
        }
      }
    }
    this.getResultsGroupByUserAndSection();
  }

  show(i: number) {
    this.showList[i] = !this.showList[i];
  }
}

class Rating {
  scoreTotal: number;
  scoreMust: number;
  count: number;
  userId: string;
  username: string;

  constructor() {
    this.scoreTotal = 0;
    this.scoreMust = 0;
    this.count = 0;
  }
}
