import {Component, OnInit} from '@angular/core';
import {CommonService} from '../../shared/common.service';
import {CookieService} from 'ngx-cookie-service';
import {DatePipe} from '@angular/common';
import {Template} from '../../shared/model/template';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements OnInit {

  template: any = {};
  userId = '';
  userRole = '';

  examList: any[] = [];
  originExamList: any[] = [];
  categoryList: any[] = [];
  sectionList: any[] = [];

  templateIdList: string[] = [];
  companyIdList: string[] = [];
  shortTemplateList: any[];

  sectionSelectDisable = true;
  filterTemplate: any = new Object();
  categorySectionList = [];
  companyList: any = [];
  cityList: any = [];
  loading = true;
  main = true;
  searchText = '';
  searching = false;
  isFiltering = false;
  showFilterResult = false;
  disableReset = true;

  constructor(public cookieService: CookieService,
              private router: Router,
              private matSnackBar: MatSnackBar,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.cookieService.set('title', 'Экзамены');
    this.userId = this.cookieService.get('userId');
    this.userRole = this.cookieService.get('role');
    this.getCategoryAndSectionList();
    this.getCityList();
    this.getCompanyList();
    this.getExamTemplateList();
  }

  search(): void {
    if (this.searchText === ''
      || this.searchText === null
      || this.searchText.trim() === ''
      || this.searchText.trim().length === 0
      || this.searchText.length === 0) {
      this.handleSearchString();
    } else {
      this.loading = true;
      this.searching = true;
      this.disableReset = false;
      this.examList = [];
      this.commonService.searchExamTemplate(this.searchText).then(res => {
        if (res && res.length > 0) {
          this.examList = res;
          this.templateIdList = this.examList.map((res, index) => {
            const now = new Date();
            if (now > new Date(res.date)) {
              this.archiveExam(res.id, index);
            } else {
              return res.templateId;
            }
            return res.templateId;
          });
          this.loading = false;
          console.log('examList:', this.examList);
          console.log('templateIdlist:', this.templateIdList);
          this.getShortTemplateList();
        }
        this.loading = false;
      });
      // this.allTemplateList.forEach(value => {
      //   if (value.name.toLowerCase().includes(this.searchText.toLowerCase())) {
      //     this.templateList.push(value);
      //   }
      // });
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
    this.examList = this.originExamList;
    this.filterTemplate = new Object();
    this.isFiltering = false;
    this.showFilterResult = false;
  }


  getCompanyNameById(id) {
    for (let i = 0; i < this.companyList.length; i++) {
      if (id === this.companyList[i].id) {
        return this.companyList[i].name;
      }
    }
    return 'Компания не найдена';
  }

  getSectionsByCategory(event) {
    const categoryId: string = event.value;
    this.categorySectionList = [];
    this.sectionList.forEach(value => {
      if (value.categoryId === categoryId) {
        this.categorySectionList.push(value);
      }
    });
    this.sectionSelectDisable = false;
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

  trackByFn(index, item) {
    return index;
  }

  getShortTemplateList() {
    this.commonService.getShortTemplateList(this.templateIdList).then(res => {
      this.shortTemplateList = res;
      console.log('shortTemplateList:', res);
    });
  }

  getTemplateNameById(id: string): string {
    let name = 'Шаблон не найден';
    for (let i = 0; i < this.templateIdList.length; i++) {
      if (this.shortTemplateList[i].id === id) {
        name = this.shortTemplateList[i].name;
        break;
      }
    }
    return name;
  }

  getTemplateQuestionLengthById(id: string): string {
    let name = 'Шаблон не найден';
    for (let i = 0; i < this.templateIdList.length; i++) {
      if (this.shortTemplateList[i].id === id) {
        name = this.shortTemplateList[i].questionIdList.length;
        break;
      }
    }
    return name;
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

  archiveExamById(examId) {

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

  getFilteredExamTemplateList() {
    this.loading = true;
    this.commonService.filterExamination(this.filterTemplate).then(res => {
      this.loading = false;
      this.examList = res;
      this.isFiltering = false;
      this.showFilterResult = true;
      this.disableReset = false;
      console.log(this.examList);
      this.templateIdList = this.examList.map((res, index) => {
        const now = new Date();
        if (now > new Date(res.date)) {
          this.archiveExam(res.id, index);
        } else {
          return res.templateId;
        }
        return res.templateId;
      });
      this.loading = false;
      console.log('examList:', this.examList);
      console.log('templateIdlist:', this.templateIdList);
      if (this.examList && this.examList.length > 0) {
        this.getShortTemplateList();
      }
    });
  }

  getSize(obj) {
    return Object.keys(obj).length;
  }

  handleRestoreFilter() {
    this.examList = this.originExamList;
    this.categorySectionList = [];
    this.sectionSelectDisable = true;
    this.filterTemplate = new Object();
  }

  getExamTemplateList() {

    this.commonService.getExamList().then(res => {
      this.examList = res;
      this.originExamList = res;
      this.templateIdList = this.examList.map((res, index) => {
        const now = new Date();
        if (now > new Date(res.date)) {
          this.archiveExam(res.id, index);
        } else {
          return res.templateId;
        }
        return res.templateId;
      });
      this.loading = false;
      console.log('examList:', this.examList);
      console.log('templateIdlist:', this.templateIdList);
      if (this.examList && this.examList.length > 0) {
        this.getShortTemplateList();
      }
    });
  }

  getCompanyList() {
    this.commonService.getActiveCompanyList().then(res => {
      this.companyList = res;
    });
  }

  archiveExam(examId: string, index) {
    this.commonService.archiveExam(examId).then(res => {
      this.examList.splice(index, 1);
    });
  }

  getCategoryAndSectionList() {
    this.commonService.getCategoryList().then(res => {
      this.categoryList = res;
    });
    this.commonService.getSectionList().then(res => {
      this.sectionList = res;
    });
  }

  getNameFromSection(id): string {
    let res;
    if (res = this.sectionList.find(value => value.id === id)) {
      return res.name;
    } else {
      return 'Раздел не найден';
    }
  }

  getNameFromCategory(id): string {
    let res;
    if (res = this.categoryList.find(value => value.id === id)) {
      return res.name;
    } else {
      return 'Категория не найдена';
    }
  }

  getNameFromCity(id): string {
    let res;
    if (res = this.cityList.find(value => value.id === id)) {
      return res.name;
    } else {
      return 'Город не найден';
    }
  }

  private getCityList() {
    this.commonService.getCityList().then(res => {
        this.cityList = res;
      }
    );
  }

}
