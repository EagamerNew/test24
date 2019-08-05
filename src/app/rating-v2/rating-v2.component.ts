import {Component, OnInit} from '@angular/core';
import {QuestionService} from '../shared/question.service';
import {CommonService} from '../shared/common.service';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-rating-v2',
  templateUrl: './rating-v2.component.html',
  styleUrls: ['./rating-v2.component.css']
})
export class RatingV2Component implements OnInit {

  results: any[] = [];
  result: any;
  searchText = '';
  category: Category;
  categories: Category[] = [];
  section: Section;
  originResultList = [];
  loading = false;

  // For filtering
  isFiltering = false;
  showFilterResult = false;
  disableReset = true;
  searching = false;
  sectionSelectDisable = true;
  filterTemplate: any = new Object();
  categoryList: any[] = [];
  companyList: any[] = [];

  constructor(private service: QuestionService,
              private _serviceCommon: CommonService,
              private cookieService: CookieService) {
  }

  ngOnInit(): void {
    this.cookieService.set('title', 'Рейтинг');
    this.restoreFilterTemplate();
    this.getCompanyList();
    this.getCategoryList();
    this.getResultList();
  }

  getFilteredRatingList() {
    this.loading = true;
    this._serviceCommon.filterRatingList(this.filterTemplate, 'ratings').then(res => {
      this.loading = false;
      this.result = res.map(result => {
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
      this.isFiltering = false;
      this.showFilterResult = true;
      this.disableReset = false;
      this.loading = false;
      this.originResultList = this.results;
      this.sortingCategoriesByUserAndSection();
      console.log('results:', this.results);
    });
  }


  restoreFilterTemplate(): void {
    this.filterTemplate = new Object();
    this.filterTemplate['companyId'] = '';
    this.filterTemplate['categoryId'] = '';
  }

  search(): void {
    if (this.searchText === '' || this.searchText === null || this.searchText.length === 0) {
      this.results = this.originResultList;
    } else {
      console.log(this.searchText);
      this.results = [];
      this.originResultList.forEach(value => {
        if (value.username.toLowerCase().includes(this.searchText.toLowerCase())) {
          this.results.push(value);
        }
      });
    }
  }

  showFilter() {
    this.handleSearchString();
    this.isFiltering = true;
    this.showFilterResult = false;
  }

  handleSearchString() {
    this.disableReset = true;
    this.searchText = '';
    this.searching = false;
    // this.examList = this.originExamList;
    this.filterTemplate = new Object();
    this.isFiltering = false;
    this.showFilterResult = false;
  }

  handleRestoreFilter() {
    this.sectionSelectDisable = true;
    this.restoreFilterTemplate();
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
    this.getRatings();
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
          this.categories[i].sections[j].show = parseFloat(this.categories[i].sections[j].show.toFixed(2));
        } else {
          this.categories[i].sections[j].show = 0;
        }
      }
      if (this.categories[i].count !== 0) {

        this.categories[i].show = this.categories[i].scoreTotal / this.categories[i].scoreMust * 100;
        this.categories[i].show = parseFloat(this.categories[i].show.toFixed(2));

      } else {
        this.categories[i].show = 0;

      }
    }
    this.sorting();
  }

  sorting() {
    for (let i = 0; i < this.categories.length; i++) {
      for (let j = 0; j < this.categories[i].sections.length; j++) {
        for (let k = 0; k < this.categories[i].sections.length; k++) {
          if (this.categories[i].sections[j].show > this.categories[i].sections[k].show) {
            this.section = new Section();
            this.section = this.categories[i].sections[j];
            this.categories[i].sections[j] = this.categories[i].sections[k];
            this.categories[i].sections[k] = this.section;
          }
        }
      }
      for (let j = 0; j < this.categories.length; j++) {
        if (this.categories[i].show > this.categories[j].show) {
          this.category = new Category();
          this.category = this.categories[i];
          this.categories[i] = this.categories[j];
          this.categories[j] = this.category;
        }
      }

    }
    this.loading = false;
  }

  show(i: number) {
    this.categories[i].display = !this.categories[i].display;
  }

  getCategoryList() {
    this._serviceCommon.getCategoryList().then(res => {
      this.categoryList = res;
    });
  }

  getCompanyList(): void {
    this._serviceCommon.getActiveCompanyList().then(res => {
      this.companyList = res;
    });
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
