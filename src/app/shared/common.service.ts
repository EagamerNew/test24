import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import * as firebase from "firebase";
import {FireSQL} from "firesql";
import {Observable} from "rxjs";
import {Template} from './model/template';
import {User} from "./model/user";
import {USER_ROLE_LIST} from "./default-constant";
import {CookieService} from "ngx-cookie-service";
import {FirebaseListObservable} from "@angular/fire/database-deprecated";
import {AngularFireDatabase} from "@angular/fire/database";
import CollectionReference = firebase.firestore.CollectionReference;
import {DocumentData} from 'firesql/types/utils';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private fireDB;
  private fireSQL: FireSQL;

  constructor(private firestore: AngularFirestore, private cookieService: CookieService) {
    this.fireDB = firebase.firestore();
    this.fireSQL = new FireSQL(this.fireDB);
  }

  filterExamination(filterTemplate: any): Promise<DocumentData[]>{

    let globalQuery = `SELECT categoryId, address, cityId, sectionId, startTime,
          date, examinatorUserId, companyId, templateId, participantList FROM examination WHERE status ='active' `;
    let haved = false;

    if(filterTemplate.companyId){
      globalQuery += ` AND companyId = '${filterTemplate.companyId}'`
      haved = true;
    }
    if(filterTemplate.categoryId){
      if(!haved){
        globalQuery += ' AND ';
      }else{
        globalQuery += ' OR ';
      }
      globalQuery += ` categoryId = '${filterTemplate.categoryId}'`
    }
    if(filterTemplate.sectionId){

      if(!haved){
        globalQuery += ' AND ';
      }else{
        globalQuery += ' OR ';
      }
      globalQuery += ` sectionId = '${filterTemplate.sectionId}'`
    }
    console.log('globalQuery:', globalQuery);
    return this.fireSQL.query(globalQuery,{includeId:'id'});
  }

  filterTemplate(filterTemplate: any): Promise<DocumentData[]>{

    let globalQuery = `SELECT * FROM template WHERE status ='active' AND isExamTemplate = false `;
    let haved = false;

    if(filterTemplate.companyId){
      globalQuery += ` AND companyId = '${filterTemplate.companyId}'`
      haved = true;
    }
    if(filterTemplate.categoryId){
      if(!haved){
        globalQuery += ' AND ';
      }else{
        globalQuery += ' OR ';
      }
      globalQuery += ` categoryId = '${filterTemplate.categoryId}'`
    }
    if(filterTemplate.sectionId){

      if(!haved){
        globalQuery += ' AND ';
      }else{
        globalQuery += ' OR ';
      }
      globalQuery += ` sectionId = '${filterTemplate.sectionId}'`
    }
    console.log('globalQuery:', globalQuery);
    return this.fireSQL.query(globalQuery,{includeId:'id'});
  }

  async searchTemplate(searchText: string): Promise<DocumentData[]> {
    console.log('searchText: ', searchText);
    // company, section, category, --city
    let companyIdString: string = '';
    let categoryIdString: string = '';
    let sectionIdString: string = '';
    let globalQuery = `SELECT * FROM template WHERE status ='active' AND isExamTemplate = false
                AND ( (name LIKE '${searchText.toLowerCase()}%' OR name LIKE '${searchText.charAt(0).toUpperCase() + searchText.slice(1)}%') `;
    let sectionId = await this.findSectionIdListBySearchText(searchText);
    console.log('sectionId: ', sectionId);
    if (sectionId && sectionId.length > 0) {
      sectionId.map(sectionList => {
        sectionIdString = sectionIdString + '"' + sectionList.id + '",';
      });
      sectionIdString = sectionIdString.substring(0, sectionIdString.length - 1);
      globalQuery += ` OR sectionId IN (${sectionIdString})`;
    }
    console.log('sectionIDS: ', sectionIdString);

    let companyId = await this.findCompanyIdListBySearchText(searchText);
    console.log('companyId: ', companyId);
    if (companyId && companyId.length > 0) {
      companyId.map(companyList => {
        companyIdString = companyIdString + '"' + companyList.id + '",';
      });
      companyIdString = companyIdString.substring(0, companyIdString.length - 1);
      globalQuery += ` OR companyId IN (${companyIdString})`;
    }
    console.log('companyIDS: ', companyIdString);

    let categoryId = await this.findCategoryIdListBySearchText(searchText);
    console.log('categoryId: ', categoryId);
    if (categoryId && categoryId.length > 0) {
      categoryId.map(categoryList => {
        categoryIdString = categoryIdString + '"' + categoryList.id + '",';
      });
      categoryIdString = categoryIdString.substring(0, categoryIdString.length - 1);
      globalQuery += ` OR categoryId IN (${categoryIdString})`;
    }
    console.log('categoryIDS: ', categoryIdString);

    globalQuery += `)`;
    console.log('globalQuery: ', globalQuery);
    return this.fireSQL
            .query(globalQuery, {includeId: 'id'});

  }

  findSectionIdListBySearchText(searchText: string): Promise<DocumentData[]> {
    let query = `SELECT __name__ as id FROM section WHERE name LIKE '${searchText}%' OR name LIKE '${searchText.charAt(0).toUpperCase() + searchText.slice(1)}%'`;
    console.log('query section is:', query)
    return this.fireSQL.query(query);
  }

  findCategoryIdListBySearchText(searchText: string) {
    let query = `SELECT __name__ as id FROM category WHERE name LIKE '${searchText}%' OR name LIKE '${searchText.charAt(0).toUpperCase() + searchText.slice(1)}%'`;
    console.log('query category is:', query)
    return this.fireSQL.query(query);
  }

  findCompanyIdListBySearchText(searchText: string) {
    let query = `SELECT __name__ as id FROM company WHERE name LIKE '${searchText}%' OR name LIKE '${searchText.charAt(0).toUpperCase() + searchText.slice(1)}%'`;
    console.log('query company is:', query)
    return this.fireSQL.query(query);
  }

  setCompanyIdForUser(docId, companyId) {
    return this.firestore.collection('user').doc(docId).update({companyId: companyId, role: 'staff'});
  }

  getUserByIdn(idn) {
    return this.fireSQL.query(`SELECT __name__ as id, companyId from user WHERE idn = '${idn}'`);
  }

  archiveExam(examId: string) {
    return this.firestore.collection('examination').doc(examId).update({status: 'archived'});
  }

  getExamHistoryByUserId(userId: string) {
    return this.fireSQL.query(`SELECT __name__ as id, category,title,score,mistake,correct,section FROM result 
      WHERE status='done' AND userId='${userId}'`);
  }

  deleteSpeciality(id: string) {
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

  getResultList(cased?: string) {
    let query = `SELECT __name__ as id, isTest,correct,mistake,score,category,section,title,userId,username 
      FROM result `;
    if (cased && cased === 'ratings') {
      if (this.cookieService.get('role') !== 'admin') {
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
    return this.firestore.collection('user').doc(user.id).update({
      status: 'active'
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
      privilegeList: user.privilegeList,
      companyId: user.companyId
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
    return this.fireSQL.query(`SELECT __name__ as id, cityCode, name,address, companyId FROM subsidiary`);
  }

  getSubsidiaryListByCompanyId(companyId: string) {
    return this.fireSQL.query(`SELECT __name__ as id, cityCode, name,address, companyId FROM subsidiary
      WHERE companyId = '${companyId}'`);
  }

  updateSubsidiary(subsidiary) {
    return this.firestore.collection('subsidiary').doc(subsidiary.id).set({
      cityCode: subsidiary.cityCode,
      name: subsidiary.name,
      address: subsidiary.address,
      companyId: subsidiary.companyId
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

  getExaminatorList(companyId: string) {
    return this.firestore.collection('user', ref =>
      ref.where('privilegeList', 'array-contains', 'examination')
        .where('role', '==', 'staff')
        .where('companyId', '==', companyId))
      .snapshotChanges();
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
      subsidiary: company.subsidiary,
      status: company.status
    });
  }

  getCompanyById(id) {
    return this.fireSQL.query(`SELECT __name__ as id, bin, name,phoneNumber,subsidiary,status FROM company where __name__ ='` + id + `'`);
  }

  deleteCompany(id) {
    return this.firestore.collection('company').doc(id).delete();
  }

  getCompanyList() {
    return this.fireSQL.query(`SELECT __name__ as id, bin,subsidiary, name,phoneNumber,status FROM company`);
  }

  getActiveCompanyList() {
    return this.fireSQL.query(`SELECT __name__ as id, bin,subsidiary, name,phoneNumber,status FROM company WHERE status='active'`);
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
    return this.fireSQL.query(`SELECT __name__ as id, name, categoryId, sectionId,companyId, questionIdList, status 
      FROM template WHERE status ='active' AND isExamTemplate = false`)
      .then(res => {
        return res;
      });
  }

  getTemplateResultListByIds(temlateIds: string[]){
    let temp = "";
    for (let str of temlateIds) {
      temp = temp + '"' + str + '",';
    }
    temp = temp.substring(0, temp.length - 1);
    console.log('temp to search: ', temp);
    return this.fireSQL.query(`SELECT __name__ as id,templateId FROM result WHERE templateId IN (${temp})`);
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
