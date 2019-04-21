import {Component, OnInit} from '@angular/core';
import {CommonService} from "../../shared/common.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements OnInit {

  template: any = {};
  userId: string = '';
  userRole: string ='';

  examList: any[] = [];
  categoryList: any[] = [];
  sectionList: any[] = [];

  templateIdList: string[] = [];
  shortTemplateList: any[] = [];

  constructor(public cookieService: CookieService,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.userId = this.cookieService.get('userId');
    this.userRole = this.cookieService.get('role');
    this.getCategoryAndSectionList();
    this.getExamTemplateList();
  }

  participate(examId:string, participantList: any){
    if(!participantList){
      participantList = {};

    }
    participantList[this.userId] = {
      status: 'pending',
      resultId: ''
    };
    this.commonService.updateExamParticipantList(examId, participantList).then(res=>{
      this.getExamTemplateList();
    });
  }

  existInExam(exam){
    if(exam.participantList){
      return !exam.participantList[this.userId] !== undefined;
    }
    else{
      return true;
    }
  }

  getShortTemplateList(){
    this.commonService.getShortTemplateList(this.templateIdList).then(res=>{
      this.shortTemplateList = res;
      console.log('shortTemplateList:', res);
    });
  }

  getTemplateNameById(id:string):string{
    let name ="";
    for (let i = 0; i < this.templateIdList.length; i++) {
      if(this.shortTemplateList[i].id === id){
        name = this.shortTemplateList[i].name;
        break;
      }
    }
    return name;
  }

  timestampToDate(date): Date{
    return new Date(date);
  }

  getStatus(exam){
    if(exam.participantList){
      return exam.participantList[this.userId].status;
    }
  }

  getExamTemplateList() {
    this.commonService.getExamList().then(res => {
      this.examList = res;
      this.templateIdList = this.examList.map(res=>{
        return res.templateId;
      });
      console.log('templateIdlist:', this.templateIdList);
      this.getShortTemplateList();
    })
  }

  getCategoryAndSectionList(){
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
      return "Раздел не найден";
    }
  }

  getNameFromCategory(id): string {
    let res;
    if (res = this.categoryList.find(value => value.id === id)) {
      return res.name;
    } else {
      return "Категория не найдена";
    }
  }

}
