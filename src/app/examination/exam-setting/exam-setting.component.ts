import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {CommonService} from "../../shared/common.service";
import {RESULT_CODE_LIST} from "../../shared/default-constant";

@Component({
  selector: 'app-exam-setting',
  templateUrl: './exam-setting.component.html',
  styleUrls: ['./exam-setting.component.css']
})
export class ExamSettingComponent implements OnInit {

  examId: string = '';
  exam: any = {};

  participantList:any[] = [];

  constructor(private route: ActivatedRoute,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.route.params.subscribe(res=>{
      this.examId = res['id'];
      this.getExamById();
    });
  }

  getExamById(){
    this.commonService.getExamById(this.examId).then(res=>{
      this.exam = res[0];
      if(this.exam.participantList){
        let map: Map<string,any> = new Map(Object.entries(this.exam.participantList));
        console.log('map:' , map)
        console.log('participantList:' , this.exam.participantList)
        for(let key of Array.from(map.keys())){
          this.commonService.getUserNameAndIdn(key).then(
            res=>{
              const obj = {
                firstname: res[0].firstname,
                lastname: res[0].lastname,
                idn: res[0].idn,
                data: this.exam.participantList[key]
              };
              console.log(obj)
              this.participantList.push(obj);
            }
          );
        }
      }
    });
  }

  activateUser(userId:string){
    this.setStatusToExamParticipant(userId,RESULT_CODE_LIST.ACTIVE.toString().toLowerCase());
  }

  disableUser(userId:string){
    this.setStatusToExamParticipant(userId,RESULT_CODE_LIST.DISABLED.toString().toLowerCase());
  }

  setStatusToExamParticipant(userId: string,status:string){
    this.exam.participantList[userId].status = status;
    this.commonService.updateExamParticipantList(this.examId, this.exam.participantList).then(res=>{
      console.log('updated : ', this.exam);
    });
  }
}
