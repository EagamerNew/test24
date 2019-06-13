import {Component, OnInit} from '@angular/core';
import {QuestionService} from "../shared/question.service";
import {QuestionSection} from "../question/section/question-section.model";
import {QuestionList} from "../list-questions/question-list";
import {CommonService} from "../shared/common.service";

@Component({
  selector: 'app-raitings',
  templateUrl: './raitings.component.html',
  styleUrls: ['./raitings.component.css']
})
export class RaitingsComponent implements OnInit {

  constructor(private service: QuestionService,
              private _serviceCommon: CommonService) {
  }

  results: any[] = [];
  result: any;
  sortingResulsts: any[] = [];
  ratingResults: Rating[] = [];
  ratingResult: Rating = new Rating();


  ngOnInit(): void {
    this.getResultList();
  }


  getResultList(): void {
    this._serviceCommon.getResultList('ratings').then(res => {
      console.log(res, '--');
      this.results = res.map(result => {
        return {
          id: result.id,
          isTest: result.isTest,
          correct: result.correct,
          mistake: result.mistake,
          score: parseInt(result.score),
          category: result.category,
          section: result.section,
          title: result.title,
          userId: result.userId,
          username: result.username
        }
      });
      console.log('resuls', JSON.stringify(this.results));
      this.getRatingGroupByUser()
      this.getResultsGroupByUserAndSection()
    })
  }

  getResultsGroupByUserAndSection() {
    for (let i = 0; i < this.results.length; i++) {
      this.result = new Object();
      this.result.count = 0;
      this.result.score = 0;
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
      console.log('------------------------------++++++++++++++++++++++++++++++')
      for (let j = i; j < this.results.length; j++) {
        if (this.results[i].userId == this.results[j].userId && this.results[i].category == this.results[j].category) {
          console.log(JSON.stringify(this.results[j]))
          this.result.score += this.results[j].score;
          this.result.count += 1;
          console.log('====-----------=====')
          console.log(this.sortingResulsts)
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
    console.log('==========================================')
    console.log(this.sortingResulsts);
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
        console.log('=-=-=-=-=-=-================================')
        console.log(this.ratingResult)
        console.log('=-=-=-=-=-=-================================')

      } else {
        continue;
      }
      let check = false;
      for (let j = 0; j < this.ratingResults.length; j++) {

        if (this.ratingResults[j].userId === this.ratingResult.userId) {
          check = true;
          break;
        } else {

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
    console.log('-----------------------');
    console.log(JSON.stringify(this.ratingResults));
  }
}

class Rating {
  scoreTotal: number;
  scoreMust:number;
  count: number;
  userId: string;
  username: string;
}
