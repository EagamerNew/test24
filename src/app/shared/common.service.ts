import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import * as firebase from "firebase";
import {FireSQL} from "firesql";
import {Observable} from "rxjs";
import {Template} from './model/template';
import {User} from "./model/user";
import {USER_ROLE_LIST} from "./default-constant";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private fireDB;
  private fireSQL: FireSQL;

  constructor(private firestore: AngularFirestore) {
    this.fireDB = firebase.firestore();
    this.fireSQL = new FireSQL(this.fireDB);
  }

  getShortTemplateById(id:string){
    return this.fireSQL.query(`SELECT DISTINCT __name__ as id, name FROM template WHERE __name__ = '${id}'`)
  }

  getShortTemplateList(idList: string[]) {
    let temp = "";
    for (let str of idList) {
      temp = temp + '"' + str + '",';
    }
    temp = temp.substring(0, temp.length - 1);
    console.log('temp to search: ', temp)
    return this.fireSQL.query(`SELECT DISTINCT __name__ as id, name FROM template WHERE __name__ IN (${temp})`)
  }

  getResultById(id: string) {
    return this.fireSQL.query(`SELECT * FROM result WHERE __name__ = '${id}'`);
  }

  updateExamParticipantList(examId: string, participantList: any) {
    return this.firestore.collection('examination').doc(examId).update({
      'participantList': participantList
    })
  }

  getUserNameAndIdn(userId: string) {
    return this.fireSQL.query(`SELECT __name__ as id, lastname, firstname, idn 
    FROM user WHERE __name__ = '` + userId + `'`);
  }

  getExamTemplateList() {
    return this.fireSQL.query(`SELECT __name__ as id, name FROM template WHERE status = 'active' 
      AND isExamTemplate = TRUE`);
  }

  getExamList() {
    return this.fireSQL.query(`SELECT __name__ as id, categoryId, address, cityId, sectionId, startTime,
          date, examinatorUserId, companyId, templateId, participantList
      FROM examination`);
  }

  getExamById(id: string) {
    return this.fireSQL.query(`SELECT __name__ as id, categoryId, address, cityId, sectionId, startTime,
          date, examinatorUserId, companyId, templateId, participantList
          FROM examination WHERE __name__ ='` + id + `'`);
  }

  saveResult(result) {
    return this.firestore.collection('result').add(result);
  }

  getResultList() {
    return this.fireSQL.query(`SELECT __name__ as id, isTest,correct,mistake,score,category,section,title,userId FROM result`);
  }

  saveUser(user: any) {
    return this.firestore.collection('user').add(user);
  }

  saveExam(exam: any) {
    return this.firestore.collection('examination').add(exam);
  }

  updateUserId(user, userId: string) {
    return this.firestore.collection('user').doc(user.id).set({
      userId: userId,
      idn: user.idn,
      firstname: user.firstname,
      lastname: user.lastname,
      birthdate: user.birthdate,
      gender: user.gender,
      status: 'active',
      city: user.city,
      phoneNumber: user.phoneNumber,
      role: user.role,
      privilegeList: user.privilegeList
    });
  }

  updateUserByDocId(userDocId: string, user) {
    return this.firestore.collection('user').doc(userDocId).set({
      idn: user.idn,
      firstname: user.firstname,
      lastname: user.lastname,
      birthdate: user.birthdate,
      gender: user.gender,
      status: user.status,
      city: user.city,
      phoneNumber: user.phoneNumber,
      role: user.role,
      privilegeList: user.privilegeList
    });
  }

  deleteUserByUserDocId(userDocId) {
    return this.firestore.collection('user').doc(userDocId).delete();
  }

  addCity(city) {
    return this.firestore.collection('city').add(city);
  }

  deleteCity(city) {
    return this.firestore.collection('city').doc(city.id).delete();
  }

  getCityList() {
    return this.fireSQL.query(`SELECT __name__ as id, code, name FROM city`);
  }

  addSubsidiary(subsidiary) {
    return this.firestore.collection('subsidiary').add(subsidiary);
  }

  getSubsidiaryList() {
    return this.fireSQL.query(`SELECT __name__ as id, cityCode, name,address FROM subsidiary`);
  }

  updateSubsidiary(subsidiary) {
    return this.firestore.collection('subsidiary').doc(subsidiary.id).set({
      cityCode: subsidiary.cityCode,
      name: subsidiary.name,
      address: subsidiary.address,
    });
  }

  updateUserPassword(docId: string, password: string) {
    return this.firestore.doc('user/' + docId).update({'password': password});
  }

  checkPhoneAndPassword(phone, password) {
    return this.fireSQL.query(`SELECT __name__ as id, idn,role ,privilegeList,lastname,firstname, birthdate, 
          gender, city, phoneNumber, status
          FROM user  
          WHERE phoneNumber = '` + phone + `' 
          AND password = '` + password + `'`);
  }

  getExaminatorList() {
    return this.fireSQL.query(`SELECT __name__ as id, firstname, lastname FROM user WHERE role = 'staff'`);
  }

  deleteSubsidiary(subsidiary) {
    return this.firestore.collection('subsidiary').doc(subsidiary.id).delete();
  }

  addPostion(position) {
    return this.firestore.collection('position').add(position);
  }

  deletePostion(position) {
    return this.firestore.collection('position').doc(position.id).delete();
  }

  getPostionList() {
    return this.fireSQL.query(`SELECT __name__ as id, bin, name,phoneNumber FROM company`);
  }

  addCompany(company) {
    return this.firestore.collection('company').add(company);
  }

  updateCompany(company) {
    return this.firestore.collection('company').doc(company.id).set({
      bin: company.bin,
      name: company.name,
      phoneNumber: company.phoneNumber,
    });
  }

  getCompanyById(id) {
    return this.fireSQL.query(`SELECT __name__ as id, bin, name,phoneNumber FROM company where __name__ ='` + id + `'`);
  }

  deleteCompany(id) {
    return this.firestore.collection('company').doc(id).delete();
  }

  getCompanyList() {
    return this.fireSQL.query(`SELECT __name__ as id, bin, name,phoneNumber FROM company`);
  }

  getUserList() {
    return this.fireSQL.query(`SELECT __name__ as id, idn,role ,privilegeList,lastname,firstname, birthdate, 
          gender, city, phoneNumber, status
        FROM user`);
  }

  getUserByPhone(phone: string) {
    return this.fireSQL.query(`SELECT __name__ as id,role, idn,privilegeList, lastname,firstname, birthdate, 
          gender, city,phoneNumber, status
        FROM user WHERE phoneNumber= '` + phone + `'`).then(res => {
      return res;
    });
  }

  getUserByDocId(docId: string) {
    return this.fireSQL.query(`SELECT __name__ as id, idn,role,privilegeList, lastname,firstname, birthdate, 
          gender, city,phoneNumber, status
        FROM user WHERE __name__ = '` + docId + `'`).then(res => {
      return res;
    });
  }

  checkUserByPhone(phone: string) {
    return this.fireSQL.query(`SELECT __name__ 
        FROM user WHERE phoneNumber= '` + phone + `'`).then(res => {
      return res;
    });
  }

  getSectionNameById(id) {
    return this.fireSQL.query(`SELECT name FROM section WHERE __name__ = '` + id + `'`).then(res => {
      return res;
    });
  }

  getSectionList() {
    return this.fireSQL.query(`SELECT __name__ as id, name, categoryId FROM section`).then(res => {
      return res;
    })
  }

  getCategoryList() {
    return this.fireSQL.query(`SELECT __name__ as id, name FROM category`).then(res => {
      return res;
    })
  }

  getCategoryNameById(id) {
    return this.fireSQL.query(`SELECT name FROM category WHERE __name__ = '` + id + `'`).then(res => {
      return res;
    });
  }

  getActiveTemplateList() {
    return this.fireSQL.query(`SELECT __name__ as id, name, categoryId, sectionId, questionIdList, status 
      FROM template WHERE status ='0'`)
      .then(res => {
        return res;
      });
  }

  deleteTemplateById(id: string) {
    return this.firestore.collection("template").doc(id).delete();
  }

  getUserPrivilegeListByDocId(userDocId: string) {
    return this.fireSQL.query(`SELECT __name__ as id, privilegeList
      FROM user WHERE __name__ ='` + userDocId + `'`)
      .then(res => {
        return res;
      });
  }
}
