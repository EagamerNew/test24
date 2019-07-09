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
  searchText = '';
  disableReset = true;

  constructor(private cacheService: CacheService,
              private cookieService: CookieService,
              private commonService: CommonService) {
  }

  // data: any;
  results: any;
  resultsOrigin: any;
  actionCode: string = 'cache' // cache, db, notfound
  examUserIds: string[] = [];
  users: any = [];

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
    this.commonService.getExamHistoryList().then(res => {
      console.log('result : ', res);
      this.results = res.map(mapper => {
        if (mapper.examinatorUserId) {
          console.log('mapper success: ', mapper.companyName)
          this.examUserIds.push(mapper.examinatorUserId);
        }
        if (mapper.date) {
          const date = mapper.date.split('-');
          mapper['realDate'] = date[0] + ' ' + this.monthInRus(parseInt(date[1])) + ' ' + date[2];
        }
        return mapper;
      });
      this.resultsOrigin = this.results;
      console.log('userIds: ', this.examUserIds);
      this.getExaminatorUsernameById();
    });
  }

  handleSearchString() {
    this.searchText = '';
    this.results = this.resultsOrigin;
    this.disableReset = true;
  }

  monthInRus(month: number) {
    switch (month) {
      case 1:
        return 'янв';
        break;
      case 2:
        return 'фев';
        break;
      case 3:
        return 'март';
        break;
      case 4:
        return 'апр';
        break;
      case 5:
        return 'май';
        break;
      case 6:
        return 'июнь';
        break;
      case 7:
          return 'июль';
        break;
      case 8:
        return 'авг';
        break;
      case 9:
        return 'сен';
        break;
      case 10:
        return 'окт';
        break;
      case 11:
        return 'ноя';
        break;
      case 12:
        return 'дек';
        break;
    }
  }



  getExaminatorUsernameById() {
    this.commonService.getUserFioByIds(this.examUserIds).then(res => {
      console.log('users found: ', this.users);
      this.users = res;
    });
  }


  searchQuestion(): void {
    if (this.searchText === '' || this.searchText === null || this.searchText.length === 0) {
      this.handleSearchString();
    } else {
      this.disableReset = false;
      console.log(this.searchText);
      this.results = [];
      this.resultsOrigin.forEach(value => {
        if (value.username.toLowerCase().includes(this.searchText.toLowerCase())) {
          this.results.push(value);
        }
      });
    }
  }


  trackByFn(index, item) {
    return index;
  }

  getCompanyName(id: string) {
    this.commonService.getCompanyById(id).then(res => {
        if (res) {
          return res[0].name;
        } else {
          return 'Компания не найдено'
        }
      }
    );
  }

  getExamUserFio(id: string, index) {
    if (this.users) {
      for (let i = 0; i < this.users.length; i++) {
        if (this.users[i].id === id) {
          return this.users[i].lastname + ' ' + this.users[i].firstname;
        }
      }
    }
  }

  calculateRealDate(dateIn){
    const date = dateIn.split('-');
    return date[0] + ' ' + this.monthInRus(parseInt(date[1])) + ' ' + date[2];
  }
}
