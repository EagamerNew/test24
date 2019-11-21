import {Component, OnInit} from '@angular/core';
import {CacheService} from '../shared/cache.service';
import {CommonService} from '../shared/common.service';
import {CookieService} from 'ngx-cookie-service';

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
  results: any = [];
  resultsOrigin: any;
  actionCode: string = 'cache'; // cache, db, notfound
  examUserIds: string[] = [];
  users: any = [];
  company: any;

  ngOnInit(): void {

    this.commonService.getUserByDocId(this.cookieService.get('userId')).then(res => {
      this.commonService.getCompanyById(res[0].companyId).then(res2 => {
        this.company = res2[0];
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
      });
    });
  }

  calculatePercent(data): string {
    if (data.scoreMust) {
      const result = ((data.score * 100) / (data.scoreMust)).toFixed();
      // console.log('score:', data.score, ', scoreMust:', data.scoreMust, ', result:', result);
      return result;
    }
    return '';
  }

  getExamHistory() {
    this.commonService.getExamHistoryList().then(res => {
      const result = res.sort((a, b) => {
        const day1 = a.date.split('-')[0];
        const month1 = a.date.split('-')[1];
        const year1 = a.date.split('-')[2];
        const hour1 = a.time.split(':')[0];
        const min1 = a.time.split(':')[1];

        const day2 = b.date.split('-')[0];
        const month2 = b.date.split('-')[1];
        const year2 = b.date.split('-')[2];
        const hour2 = b.time.split(':')[0];
        const min2 = b.time.split(':')[1];

        return year1 - year2 || month1 - month2 || day1 - day2 || hour1 - hour2 || min1 - min2;
      }).reverse();

      result.map(mapper => {
        if (mapper.examinatorUserId) {
          this.examUserIds.push(mapper.examinatorUserId);
        }
        if (mapper.date) {
          const date = mapper.date.split('-');
          mapper['realDate'] = date[0] + ' ' + this.monthInRus(parseInt(date[1])) + ' ' + date[2];
        }
        if (mapper.companyName === this.company.name) {
          this.results.push(mapper);
        }
      });
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
          return 'Компания не найдено';
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

  calculateRealDate(dateIn) {
    const date = dateIn.split('-');
    return date[0] + ' ' + this.monthInRus(parseInt(date[1])) + ' ' + date[2];
  }

  calculateRealTime(timeIn) {
    const time: string[] = timeIn.split(':');
    if (timeIn.length === 4) {
      time[1] = '0' + time[1];
    }
    return time.join(':');
  }
}
