export class Template{
  id: string;
  name: string;
  categoryId: string;
  sectionId: string;
  companyId: string;
  questionIdList: string[];
  /*
    0 - active
    5 - deactive
   */
  status: string;

  constructor(id:string,name:string,categoryId:string,sectionId:string,questionIdList:string[], companyId,status){
    this.id = id;
    this.name = name;
    this.categoryId = categoryId;
    this.sectionId = sectionId;
    this.questionIdList = questionIdList;
    this.companyId = companyId;
    this.status = status;
  }
}
