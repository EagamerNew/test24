import {Component, OnInit} from '@angular/core';
import {CacheService} from "../shared/cache.service";
import {CommonService} from "../shared/common.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {

  constructor(private cacheService: CacheService,
              private cookieService: CookieService,
              private commonService: CommonService) {
  }

  // data: any;
  results: any;
  actionCode: string = 'cache' // cache, db, notfound

  ngOnInit(): void {
    this.cookieService.set('title', 'Результаты');
    if (this.cookieService.get('userId')) {
      this.actionCode = 'db';
      this.getExamHistory();

    } else {
      this.results = this.cacheService.get('results');
      if (this.results && this.results.length > 0) {
        this.actionCode = 'cache';
      } else {
        this.actionCode = 'notfound';
      }
    }
    console.log('actionCode: ', this.actionCode)
    console.log('results: ', this.cacheService.get('results'));
    // this.data = {
    //   isTest: true,
    //   correct: 18,
    //   mistake: 2,
    //   score: 8.0,
    //   category: 'Категория',
    //   section: 'Раздел',
    //   title: 'Название',
    //   userDocId: 'User ID',
    //   templateId: '',
    //   username: 'Username',
    //   companyName: 'Компания',
    //   percent: '25',
    // }
  }

  calculatePercent(correct, mistake) {
    const all: number = parseInt(correct) + parseInt(mistake);
    return ((correct * 100) / (all)).toFixed();
  }

  getExamHistory() {
    this.commonService.getExamHistoryByUserId(this.cookieService.get('userId')).then(res => {
      this.results = res;
    })
  }

  getCompanyName(id: string) {
    this.commonService.getCompanyById(id).then(res => {
        if (res) {
          return res[0].name;
        }else{
          return 'Компания не найдено'
        }
      }
    );
  }
}
