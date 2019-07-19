import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonService} from '../shared/common.service';
import {CookieService} from 'ngx-cookie-service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-preliminary-start',
  templateUrl: './preliminary-start.component.html',
  styleUrls: ['./preliminary-start.component.css']
})
export class PreliminaryStartComponent implements OnInit {

  code: string;
  id: string;
  userRole: string;
  userId: string;
  data: any;
  main = true;

  constructor(private route: ActivatedRoute,
              private commonService: CommonService,
              private cookieService: CookieService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.code = params['code'];
      this.id = params['id'];
      this.userRole = this.cookieService.get('role');
      this.userId = this.cookieService.get('userId');
      if (this.code === 'exam') {
        this.cookieService.set('title', 'Экзамен');
        this.commonService.getPreparedExamTemplateById(this.id).then(res => {
          console.log('res: ', res);
          this.data = res;
        });
      } else {
        this.cookieService.set('title', 'Тест');
        this.commonService.getPreparedTemplateById(this.id).then(res => {
          console.log('res: ', res);
          this.data = res;
        });
      }

    });
  }

  getStatus(exam) {
    if (exam.participantList !== undefined) {
      try {
        return exam.participantList[this.userId].status;
      } catch (e) {
        console.log('IHAVE AN ERROR1');
        return '';
      }
    }
  }

  getSize(obj) {
    return Object.keys(obj).length;
  }

  existInExam(exam): boolean {
    if (exam.participantList !== undefined) {
      if (exam.participantList[this.userId] !== undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getFormattedDate(date: any) {
    try {
      const datePipe = new DatePipe('en-US');
      return datePipe.transform(new Date(date), 'dd/MM/yyyy');
    } catch (e) {
      console.log('error with formatting date');
      return '';
    }
  }

  restartExam(exam) {
    if (exam.participantList !== undefined) {
      try {
        if (exam.participantList[this.userId].status === 'done') {
          return true;
        }
      } catch (e) {
        console.log('IHAVE AN ERROR2');
        return false;
      }
    }
  }

  participate(examId: string, participantList: any) {
    this.main = false;
    if (this.userId) {
      // this.matSnackBar.open('Вы не вошли', '', {
      //   duration: 1000
      // });
      // this.router.navigateByUrl('login-phone');

      if (!participantList) {
        participantList = {};

      }
      participantList[this.userId] = {
        status: 'pending',
        resultId: ''
      };
      this.commonService.updateExamParticipantList(examId, participantList).then(res => {
        // this.getExamTemplateList();
        console.log('succes');
      });
    }
  }

}
