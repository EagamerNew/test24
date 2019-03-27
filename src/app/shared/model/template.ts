export class Template{
  id: string;
  name: string;
  categoryId: string;
  sectionId: string;
  questionIdList: string[];
  /*
    0 - active
    5 - deactive
   */
  status: string;

  constructor(id:string,name:string,categoryId:string,sectionId:string,questionIdList:string[], status){
    this.id = id;
    this.name = name;
    this.categoryId = categoryId;
    this.sectionId = sectionId;
    this.questionIdList = questionIdList;
    this.status = status;
  }
}
