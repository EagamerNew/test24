import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import * as firebase from "firebase";
import {FireSQL} from "firesql";
import {Observable} from "rxjs";
import {Template} from './model/template';
import {User} from "./model/user";
import {USER_ROLE_LIST} from "./default-constant";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private fireDB;
  private fireSQL: FireSQL;

  constructor(private firestore: AngularFirestore,private cookieService: CookieService) {
    this.fireDB = firebase.firestore();
    this.fireSQL = new FireSQL(this.fireDB);
  }

  setCompanyIdForUser(docId, companyId){
    return this.firestore.collection('user').doc(docId).update({companyId: companyId, role:'staff'});
  }

  getUserByIdn(idn){
    return this.fireSQL.query(`SELECT __name__ as id, companyId from user WHERE idn = '${idn}'`);
  }

  archiveExam(examId:string){
    return this.firestore.collection('examination').doc(examId).update({status: 'archived'});
  }

  getExamHistoryByUserId(userId:string){
    return this.fireSQL.query(`SELECT __name__ as id, category,title,score,mistake,correct,section FROM result 
      WHERE status='done' AND userId='${userId}'`);
  }

  deleteSpeciality(id:string){
    return this.firestore.collection('speciality').doc(id).delete();
  }

  updateSpeciality(speciality) {
    return this.firestore.collection('speciality').doc(speciality.id).update({'name': speciality.name});
  }

  getSpecialityList() {
    return this.fireSQL.query(`SELECT __name__ as id, name FROM speciality`);
  }

  saveQuestionSpeciality(speciality) {
    return this.firestore.collection('speciality').add(speciality);
  }

  getQuestionListByAuthorId(authorId: string) {
    // TODO USING DOCID
    return this.fireSQL.query(`SELECT __name__ as docId, answers,author, category,correctAnswer, description, point, 
    questionType, section, company, status FROM question WHERE author='${authorId}'`);
  }

  saveExamParticipant(resultId: string, userId: string, examId: string) {
    this.getExamParticipantList(examId).then(res => {
      let pList = res[0].participantList;
      console.log('pList: ', res[0].participantList);
      pList[userId].resultId = resultId;
      pList[userId].status = 'done';
      this.updateExamParticipantList(examId, pList).then(res => {
        console.log('exam is updated : ', res);
        console.log('participantListbyUser: ', pList[userId]);
      });
    });
  }

  getExamParticipantList(examId: string) {
    return this.fireSQL.query(`SELECT participantList from examination WHERE __name__ = '${examId}'`);
  }

  getShortTemplateById(id: string) {
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

  getSubsidiaryListByListIdn(idList: string[]) {
    let temp = "";
    for (let str of idList) {
      temp = temp + '"' + str + '",';
    }
    temp = temp.substring(0, temp.length - 1);
    console.log('temp to search: ', temp)
    return this.fireSQL.query(`SELECT DISTINCT __name__ as id, name FROM subsidiary WHERE __name__ IN (${temp})`)
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
      FROM examination WHERE status = 'active'`);
  }

  getExamById(id: string) {
    return this.fireSQL.query(`SELECT __name__ as id, categoryId, address, cityId, sectionId, startTime,
          date, examinatorUserId, companyId, templateId, participantList
          FROM examination WHERE __name__ ='` + id + `'`);
  }

  saveResult(result) {
    return this.firestore.collection('result').add(result);
  }

  getResultList(cased?:string) {
    let query = `SELECT __name__ as id, isTest,correct,mistake,score,category,section,title,userId,username 
      FROM result `;
    if(cased && cased==='ratings'){
      if(this.cookieService.get('role') !== 'admin'){
        query += ` WHERE userId = '${this.cookieService.get('userId')}'`;
      }
    }
    return this.fireSQL.query(query);
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
      password: user.password,
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
      password: user.password,
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
          gender, city, phoneNumber, status, companyId
          FROM user  
          WHERE phoneNumber = '` + phone + `' 
          AND password = '` + password + `'`);
  }

  getExaminatorList() {
    return this.firestore.collection('user', ref => ref.where('privilegeList', 'array-contains',
      'examination').where('role', '==', 'staff')).snapshotChanges();
    // return this.fireSQL.query(`SELECT __name__ as id, firstname, lastname FROM user WHERE role = 'staff'
    //   and privilegeList is 'examination'`);
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
    console.log('===================================')
    console.log(JSON.stringify(company))
    return this.firestore.collection('company').doc(company.id).set({
      bin: company.bin,
      name: company.name,
      phoneNumber: company.phoneNumber,
      subsidiary:company.subsidiary
    });
  }

  getCompanyById(id) {
    return this.fireSQL.query(`SELECT __name__ as id, bin, name,phoneNumber,subsidiary FROM company where __name__ ='` + id + `'`);
  }

  deleteCompany(id) {
    return this.firestore.collection('company').doc(id).delete();
  }

  getCompanyList() {
    return this.fireSQL.query(`SELECT __name__ as id, bin,subsidiary, name,phoneNumber FROM company`);
  }

  getUserList() {
    return this.fireSQL.query(`SELECT __name__ as id, idn,role ,privilegeList,lastname,firstname, birthdate, 
          gender, city, phoneNumber, status
        FROM user`);
  }

  getUserByPhone(phone: string) {
    return this.fireSQL.query(`SELECT __name__ as id,role, idn,privilegeList, lastname,firstname, birthdate, 
          gender, city,phoneNumber, status, companyId
        FROM user WHERE phoneNumber= '` + phone + `'`).then(res => {
      return res;
    });
  }

  getUserByDocId(docId: string) {
    return this.fireSQL.query(`SELECT __name__ as id, idn,role,privilegeList, lastname,firstname, birthdate, 
          gender, city,phoneNumber, status, companyId
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
      FROM template WHERE status ='active'`)
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
