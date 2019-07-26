import {Component, OnInit} from '@angular/core';
import {QuestionService} from "../shared/question.service";
import {CommonService} from "../shared/common.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-rating-v2',
  templateUrl: './rating-v2.component.html',
  styleUrls: ['./rating-v2.component.css']
})
export class RatingV2Component implements OnInit {

  constructor(private service: QuestionService,
              private _serviceCommon: CommonService,
              private cookieService: CookieService) {
  }

  results: any[] = [];
  result: any;
  searchText = '';
  category: Category;
  categories: Category[] = [];
  section: Section;
  originResultList = [];

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
          username: result.username,
          status: false
        };
      });
      this.originResultList = this.results;
      this.sortingCategoriesByUserAndSection();
    });
  }

  sortingCategoriesByUserAndSection() {

    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i].status === true) {
        continue;
      }
      this.category = new Category();
      this.category.name = this.results[i].category;
      this.category.userId = this.results[i].userId;
      this.category.username = this.results[i].username;
      this.section = new Section();
      this.section.count += 1;
      this.section.scoreMust += this.results[i].scoreMust;
      this.section.scoreTotal += this.results[i].score;
      this.section.name = this.results[i].section;
      this.results[i].status = true;
      this.category.sections.push(this.section);
      for (let j = i + 1; j < this.results.length; j++) {
        if (this.results[j].status === true) {
          continue;
        } else if (this.results[j].category === this.results[i].category &&
          this.results[j].userId === this.results[i].userId) {
          let check = true;
          for (let k = 0; k < this.category.sections.length; k++) {
            if (this.category.sections[k].name === this.results[j].section) {
              this.category.sections[k].count += 1;
              this.category.sections[k].scoreMust += this.results[j].scoreMust;
              this.category.sections[k].scoreTotal += this.results[j].score;
              this.results[j].status = true;
              check = false;
              break;
            }
          }
          if (check) {
            this.section = new Section();
            this.section.count += 1;
            this.section.scoreMust += this.results[j].scoreMust;
            this.section.scoreTotal += this.results[j].score;
            this.section.name = this.results[j].section;
            this.results[j].status = true;
            this.category.sections.push(this.section);
          }
        }
      }
      this.categories.push(this.category);
    }
    this.getRatings()
  }

  getRatings() {
    for (let i = 0; i < this.categories.length; i++) {
      for (let j = 0; j < this.categories[i].sections.length; j++) {
        if (this.categories[i].sections[j].count >= 5) {
          this.categories[i].scoreTotal += this.categories[i].sections[j].scoreTotal;
          this.categories[i].scoreMust += this.categories[i].sections[j].scoreMust;
          this.categories[i].count += 1;
          this.categories[i].sections[j].show = this.categories[i].sections[j].scoreTotal /
            this.categories[i].sections[j].scoreMust * 100;
          this.categories[i].sections[j].show = parseFloat(this.categories[i].sections[j].show.toFixed(2))
        } else {
          this.categories[i].sections[j].show = '*';
        }
      }
      if (this.categories[i].count !== 0) {

        this.categories[i].show = this.categories[i].scoreTotal / this.categories[i].scoreMust * 100;
        this.categories[i].show = parseFloat(this.categories[i].show.toFixed(2))

      } else {
        this.categories[i].show = '*';

      }
    }
  }

  show(i: number) {
    this.categories[i].display = !this.categories[i].display;
  }
}

class Category {
  name: any;
  scoreTotal: number;
  scoreMust: number;
  count: number;
  userId: string;
  username: string;
  sections: Section[] = [];
  show: any;
  display = false;

  constructor() {
    this.scoreTotal = 0;
    this.scoreMust = 0;
    this.count = 0;
  }


}

class Section {
  name: any;
  scoreTotal: number;
  scoreMust: number;
  count: number;
  show: any;

  constructor() {
    this.scoreTotal = 0;
    this.scoreMust = 0;
    this.count = 0;
  }
}
