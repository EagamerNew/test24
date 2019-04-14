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
  ratingResults: Rating[] = [];
  ratingResult: Rating = new Rating();


  ngOnInit(): void {
    this.getResultList();
  }


  getResultList(): void {
    this._serviceCommon.getResultList().then(res => {
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
          userId: result.userId
        }
      });
      for (let i = 0; i < this.results.length; i++) {
        this.results[i].userId = (Math.floor(Math.random() * 4) + 1) + '';
      }
      console.log('resuls', JSON.stringify(this.results));
      this.getRatingGroupByUser();
    })
  }

  getRatingGroupByUser(): void {
    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i].isTest) {
        this.ratingResult = new Rating();
        this.ratingResult.count = 1;
        this.ratingResult.scoreTotal = this.results[i].score;
        if (!this.results[i].userId) {
          this._serviceCommon.getUserByDocId(this.results[i].userId).then(res => {
            this.ratingResult.userId = this.results[i].userId;
            this.ratingResult.userName = res[0].lastname + ' ' + res[0].firstname;
          })
        } else {
          this.ratingResult.userId = this.results[i].userId;
          this.ratingResult.userName = "Муратов Кайрат" + this.results[i].userId;
        }
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
          this.ratingResult.count += 1;
        } else {
          continue;
        }
      }
      this.ratingResults.push(this.ratingResult);

    }
    console.log('-----------------------');
    console.log(JSON.stringify(this.ratingResults));
  }
}

class Rating {
  scoreTotal: number;
  count: number;
  userId: string;
  userName: string;

}
