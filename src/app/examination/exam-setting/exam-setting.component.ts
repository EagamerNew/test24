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
  code = "pending";

  sectionList: any[]= [];
  shortTemplate: any = {};

  pendingCount = 0;
  activeCount = 0;
  doneCount = 0;

  constructor(private route: ActivatedRoute,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.route.params.subscribe(res=>{
      this.examId = res['id'];
      this.getExamById();
      this.getSectionList();
    });
  }

  changeSelectedRequest(code:string){
    this.code = code;
  }

  getSectionList(){
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

  getShortTemplateById(){
    this.commonService.getShortTemplateById(this.exam.templateId).then(res=>{
      this.shortTemplate = res[0];
    });
  }

  getExamById(){
    this.commonService.getExamById(this.examId).then(res=>{
      this.exam = res[0];
      this.getShortTemplateById();
      if(this.exam.participantList){
        let map: Map<string,any> = new Map(Object.entries(this.exam.participantList));
        console.log('map:' , map)
        console.log('participantList:' , this.exam.participantList)
        for(let key of Array.from(map.keys())){
          this.commonService.getUserNameAndIdn(key).then(
            res=>{
              const obj = {
                userId: key,
                firstname: res[0].firstname,
                lastname: res[0].lastname,
                idn: res[0].idn,
                data: this.exam.participantList[key]
              };
              console.log(obj);
              if(obj.data.status === RESULT_CODE_LIST.ACTIVE.toString().toLowerCase()){
                this.activeCount ++;
              }else if(obj.data.status === RESULT_CODE_LIST.DONE.toString().toLowerCase()){
                this.doneCount ++;
                this.commonService.getResultById(obj.data.resultId).then(res=>{
                  const result:any  = res[0];
                  obj.data['result'] = result.score;

                  console.log('result: ',result);
                });
                // HELLO MTHFCKR
              }else if(obj.data.status === RESULT_CODE_LIST.PENDING.toString().toLowerCase()){
                this.pendingCount ++;
              }
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
      this.participantList = [];
      this.getExamById();
    });
  }
}
