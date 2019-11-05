export class User {
  id:string;
  idn:string;
  lastname:string;
  firstname:string;
  birthdate:Date;
  gender:string;
  city:string;
  phoneNumber:string;
  password: string;
  companyId: string;
  subsidiaryId: string;
  role: string;
  privilegeList: string[];
  participants: Participant[];
  status: string;
}
export class Participant {
  managerId: string;
  companyId: string;
}
