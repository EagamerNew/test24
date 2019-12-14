import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import * as firebase from 'firebase';
import {FireSQL} from 'firesql';
import {Observable} from 'rxjs';
import {Template} from './model/template';
import {User} from './model/user';
import {USER_ROLE_LIST} from './default-constant';
import {CookieService} from 'ngx-cookie-service';
import {FirebaseListObservable} from '@angular/fire/database-deprecated';
import {AngularFireDatabase} from '@angular/fire/database';
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

  getCompanyStaffMembers(companyId: string, role: string) {
    console.log('role:', role);
    if (role === 'admin') {
      return this.firestore.collection('user', ref => ref
        .where('role', '==', 'staff')
      ).snapshotChanges();
    } else {
      return this.firestore.collection('user', ref => ref
        .where('companyId', '==', companyId)
        .where('role', '==', 'staff')
        .where('managerId', '==', this.cookieService.get('userId'))
      ).snapshotChanges();
    }
  }

  async getUserCities(userIdList: any[]): Promise<any> {
    const userIdString = this.getStrFromList(userIdList, 'userId');
    const userCityCodeMapper = await this.fireSQL.query(`SELECT __name__ as id, city FROM user WHERE __name__ IN (${userIdString})`);
    const strCityCodes = this.getStrFromList(userCityCodeMapper, 'city');
    const cityNames = (await this.fireSQL.query(`SELECT name,code FROM city WHERE code IN (${strCityCodes})`));
    console.log('userCityCodeMapper: ', userCityCodeMapper);
    console.log('strCityCodes:', strCityCodes);
    console.log('cityNames:', cityNames);
    userIdList.forEach(user => {
      userCityCodeMapper.forEach(map => {
        if (user.userId === (map.id)) {
          user.code = map.city;
          console.log('found user.code: ', user.code);
        }
      });
      console.log('user.code: ', user.code);
      if (user.code !== '' && user.code) {
        const code = cityNames.find(value => value.code === user.code)['code'];
        user.cityName = (code != null && code !== '') ? code : '-';
      }
    });
    console.log('userIdList:', userIdList);
    return userIdList;
  }

  getStrFromList(list: any [], fromCode: string): string {
    let ret = '';
    list.map(temp => {
      ret = ret + '"' + temp[fromCode] + '",';
    });
    ret = ret.substring(0, ret.length - 1);
    return ret;
  }

  async searchExamTemplate(searchText: string): Promise<DocumentData[]> {
    console.log('searchText: ', searchText);
    // company, section, category, --city
    let companyIdString = '';
    let categoryIdString = '';
    let sectionIdString = '';
    let globalQuery = `SELECT * FROM examination WHERE status ='active'
                AND ( (address LIKE '${searchText.toLowerCase()}%' OR address LIKE '${searchText.charAt(0).toUpperCase() + searchText.slice(1)}%') `;
    const sectionId = await this.findSectionIdListBySearchText(searchText);
    console.log('sectionId: ', sectionId);
    if (sectionId && sectionId.length > 0) {
      sectionId.map(sectionList => {
        sectionIdString = sectionIdString + '"' + sectionList.id + '",';
      });
      sectionIdString = sectionIdString.substring(0, sectionIdString.length - 1);
      globalQuery += ` OR sectionId IN (${sectionIdString})`;
    }
    console.log('sectionIDS: ', sectionIdString);

    const companyId = await this.findCompanyIdListBySearchText(searchText);
    console.log('companyId: ', companyId);
    if (companyId && companyId.length > 0) {
      companyId.map(companyList => {
        companyIdString = companyIdString + '"' + companyList.id + '",';
      });
      companyIdString = companyIdString.substring(0, companyIdString.length - 1);
      globalQuery += ` OR companyId IN (${companyIdString})`;
    }
    console.log('companyIDS: ', companyIdString);

    const categoryId = await this.findCategoryIdListBySearchText(searchText);
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

  findExaminatorUseridByExamId(examId: string): Promise<DocumentData[]> {
    return this.fireSQL.query(`SELECT examinatorUserId FROM examination WHERE __name__ = '${examId}'`);
  }

  async filterRatingList(filterTemplate: any, cased: string): Promise<DocumentData[]> {
    let query = `SELECT __name__ as
                        id,
                        isTest,
                        correct,
                        mistake,
                        scoreMust,
                        score,
                        category,
                        section,
                        title,
                        userId,
                        username,
                        templateId
                 FROM result `;
    let haveWhere = false;
    if (cased && cased === 'ratings') {
      if (this.cookieService.get('role') !== 'admin') {
        query += ` WHERE userId = '${this.cookieService.get('userId')}'`;
        haveWhere = true;
      }
    }

    const templateIdList = await this.getTemplateListByCompanyIdAndCategoryId(filterTemplate);
    console.log('templateIdList: ', templateIdList);
    let templateIdString = '';
    templateIdList.map(sectionList => {
      templateIdString = templateIdString + '"' + sectionList.id + '",';
    });
    templateIdString = templateIdString.substring(0, templateIdString.length - 1);
    query += haveWhere ? ' AND ' : ' WHERE ';
    query += templateIdList.length > 0 ? ` templateId IN (${templateIdString})` : ` templateId IN ('-1')`;
    // if (filterTemplate.cityCode && filterTemplate.cityCode !== '') {
    //   if (templateIdList.length > 0 ) {
    //     query += ` AND `;
    //   } else {
    //     query += ` OR `;
    //   }
    //   query += `city = '${filterTemplate.cityCode}'`;
    // }
    console.log('query:', query);
    return this.fireSQL.query(query);
  }

  getTemplateListByCompanyIdAndCategoryId(filterTemplate: any): Promise<DocumentData[]> {
    return this.fireSQL
      .query(`SELECT __name__ id FROM template WHERE categoryId = '${filterTemplate.categoryId}'
                                       AND companyId = '${filterTemplate.companyId}'`);
  }

  filterExamination(filterTemplate: any): Promise<DocumentData[]> {

    let globalQuery = `SELECT categoryId,
                              address,
                              cityId,
                              sectionId,
                              startTime,
                              date,
                              examinatorUserId,
                              companyId,
                              templateId,
                              participantList
                       FROM examination
                       WHERE status ='active' `;
    let haved = false;

    if (filterTemplate.companyId) {
      globalQuery += ` AND companyId = '${filterTemplate.companyId}'`;
      haved = true;
    }
    if (filterTemplate.categoryId) {
      if (!haved) {
        globalQuery += ' AND ';
      } else {
        globalQuery += ' OR ';
      }
      globalQuery += ` categoryId = '${filterTemplate.categoryId}'`;
    }
    if (filterTemplate.sectionId) {

      if (!haved) {
        globalQuery += ' AND ';
      } else {
        globalQuery += ' OR ';
      }
      globalQuery += ` sectionId = '${filterTemplate.sectionId}'`;
    }
    console.log('globalQuery:', globalQuery);
    return this.fireSQL.query(globalQuery, {includeId: 'id'});
  }

  filterTemplate(filterTemplate: any): Promise<DocumentData[]> {

    let globalQuery = `SELECT *
                       FROM template
                       WHERE status = 'active'
                         AND isExamTemplate = false `;
    let haved = false;

    if (filterTemplate.companyId) {
      globalQuery += ` AND companyId = '${filterTemplate.companyId}'`;
      haved = true;
    }
    if (filterTemplate.categoryId) {
      if (!haved) {
        globalQuery += ' AND ';
      } else {
        globalQuery += ' OR ';
      }
      globalQuery += ` categoryId = '${filterTemplate.categoryId}'`;
    }
    if (filterTemplate.sectionId) {

      if (!haved) {
        globalQuery += ' AND ';
      } else {
        globalQuery += ' OR ';
      }
      globalQuery += ` sectionId = '${filterTemplate.sectionId}'`;
    }
    console.log('globalQuery:', globalQuery);
    return this.fireSQL.query(globalQuery, {includeId: 'id'});
  }

  async searchTemplate(searchText: string): Promise<DocumentData[]> {
    console.log('searchText: ', searchText);
    // company, section, category, --city
    let companyIdString = '';
    let categoryIdString = '';
    let sectionIdString = '';
    let globalQuery = `SELECT * FROM template WHERE status ='active' AND isExamTemplate = false
                AND ( (name LIKE '${searchText.toLowerCase()}%' OR name LIKE '${searchText.toUpperCase()}%') `;
    const sectionId = await this.findSectionIdListBySearchText(searchText);
    console.log('sectionId: ', sectionId);
    if (sectionId && sectionId.length > 0) {
      sectionId.map(sectionList => {
        sectionIdString = sectionIdString + '"' + sectionList.id + '",';
      });
      sectionIdString = sectionIdString.substring(0, sectionIdString.length - 1);
      globalQuery += ` OR sectionId IN (${sectionIdString})`;
    }
    console.log('sectionIDS: ', sectionIdString);

    const companyId = await this.findCompanyIdListBySearchText(searchText);
    console.log('companyId: ', companyId);
    if (companyId && companyId.length > 0) {
      companyId.map(companyList => {
        companyIdString = companyIdString + '"' + companyList.id + '",';
      });
      companyIdString = companyIdString.substring(0, companyIdString.length - 1);
      globalQuery += ` OR companyId IN (${companyIdString})`;
    }
    console.log('companyIDS: ', companyIdString);

    const categoryId = await this.findCategoryIdListBySearchText(searchText);
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
    const query = `SELECT __name__ as id FROM section WHERE name LIKE '${searchText}%' OR name LIKE '${searchText.charAt(0).toUpperCase() + searchText.slice(1)}%'`;
    console.log('query section is:', query);
    return this.fireSQL.query(query);
  }

  findCategoryIdListBySearchText(searchText: string) {
    const query = `SELECT __name__ as id FROM category WHERE name LIKE '${searchText}%' OR name LIKE '${searchText.charAt(0).toUpperCase() + searchText.slice(1)}%'`;
    console.log('query category is:', query);
    return this.fireSQL.query(query);
  }

  findCompanyIdListBySearchText(searchText: string) {
    const query = `SELECT __name__ as id FROM company WHERE name LIKE '${searchText}%' OR name LIKE '${searchText.charAt(0).toUpperCase() + searchText.slice(1)}%'`;
    console.log('query company is:', query);
    return this.fireSQL.query(query);
  }

  setCompanyIdForUser(docId, companyId, subsidiaryId) {
    return this.firestore.collection('user').doc(docId).update({
      managerId: this.cookieService.get('userId'),
      companyId: companyId,
      subsidiaryId: subsidiaryId,
      role: 'staff'
    });
  }

  getUserByIdn(idn) {
    return this.fireSQL.query(`SELECT __name__ as id, companyId from user WHERE idn = '${idn}' AND (role = 'staff' OR  role = 'author' OR role = 'user')`);
  }

  getUserByUserIdn(idn) {
    return this.fireSQL.query(`SELECT __name__ as id, idn, lastname, firstname, gender, city, birthdate, status, role, privilegeList, userId, companyIds, phoneNumber  from user WHERE idn = '${idn}' AND (role = 'staff' OR  role = 'author' OR role = 'user')`);
  }

  getStudentByUserIdn(idn) {
    return this.fireSQL.query(`SELECT __name__ as id, idn, lastname, firstname, gender, city, birthdate, status, role, privilegeList, userId, companyIds, phoneNumber  from user WHERE idn = '${idn}' AND (role = 'student')`);
  }

  archiveExam(examId: string) {
    return this.firestore.collection('examination').doc(examId).update({status: 'archived'});
  }

  getExamHistoryByUserId(userId: string) {
    return this.fireSQL.query(`SELECT __name__ as id, category,title,score,mistake,correct,section,isTest,time,date,examinatorUserId, companyName FROM result
      WHERE status='done' AND userId='${userId}' ORDER BY date DESC,time DESC `);
  }

  getExamHistoryList() {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      category,
                                      title,
                                      score,
                                      scoreMust,
                                      mistake,
                                      correct,
                                      section,
                                      isTest,
                                      time,
                                      date,
                                      examinatorUserId,
                                      companyName,
                                      username
                               FROM result
                               WHERE status='done'
                               ORDER BY date DESC, time DESC `);
  }

  getExamHistoryListQuery(companyNames) {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      category,
                                      title,
                                      score,
                                      scoreMust,
                                      mistake,
                                      correct,
                                      section,
                                      isTest,
                                      time,
                                      date,
                                      examinatorUserId,
                                      companyName,
                                      username
                               FROM result res
                               WHERE res.status='done' and res.companyName = '${companyNames}'`);
  }

  deleteSpeciality(id: string) {
    return this.firestore.collection('speciality').doc(id).delete();
  }

  updateSpeciality(speciality) {
    return this.firestore.collection('speciality').doc(speciality.id).update({'name': speciality.name});
  }

  getSpecialityList() {
    return this.fireSQL.query(`SELECT __name__ as id, name
                               FROM speciality`);
  }

  saveQuestionSpeciality(speciality) {
    return this.firestore.collection('speciality').add(speciality);
  }

  getQuestionListByAuthorId(authorId: string) {
    // TODO USING DOCID
    return this.fireSQL.query(`SELECT __name__ as docId, answers,author, category,correctAnswer, description, point,
    questionType, section, company, status, answerCount, answerCountTotal FROM question WHERE author='${authorId}'`);
  }

  saveExamParticipant(resultId: string, userId: string, examId: string) {
    this.getExamParticipantList(examId).then(res => {
      const pList = res[0].participantList;
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
    return this.fireSQL.query(`SELECT DISTINCT __name__ as id, name FROM template WHERE __name__ = '${id}'`);
  }

  getShortTemplateList(idList: string[]) {
    let temp = '';
    for (const str of idList) {
      temp = temp + '"' + str + '",';
    }
    temp = temp.substring(0, temp.length - 1);
    console.log('temp to search: ', temp);
    return this.fireSQL.query(`SELECT DISTINCT __name__ as id, name , questionIdList FROM template WHERE __name__ IN (${temp})`);
  }

  getSubsidiaryListByListIdn(idList: string[]) {
    let temp = '';
    for (const str of idList) {
      temp = temp + '"' + str + '",';
    }
    temp = temp.substring(0, temp.length - 1);
    console.log('temp to search: ', temp);
    return this.fireSQL.query(`SELECT DISTINCT __name__ as id, name FROM subsidiary WHERE __name__ IN (${temp})`);
  }

  getResultById(id: string) {
    return this.fireSQL.query(`SELECT * FROM result WHERE __name__ = '${id}'`);
  }

  updateExamParticipantList(examId: string, participantList: any) {
    return this.firestore.collection('examination').doc(examId).update({
      'participantList': participantList
    });
  }

  getUserNameAndIdn(userId: string) {
    return this.fireSQL.query(`SELECT __name__ as id, lastname, firstname, idn
                               FROM user
                               WHERE __name__ = '` + userId + `'`);
  }

  getExamTemplateList() {
    return this.fireSQL.query(`SELECT __name__ as id, name
                               FROM template
                               WHERE status = 'active'
                                 AND isExamTemplate = TRUE`);
  }

  getExamTemplateListByCompany(company) {
    return this.fireSQL.query(`SELECT __name__ as id, name
                               FROM template
                               WHERE status = 'active'
                                 AND isExamTemplate = TRUE AND companyId = '` + company + `'`);
  }

  async getPreparedExamTemplateById(id: string) {
    const examination = await this.getExamTemplateById(id);
    const company = examination[0].companyId ? await this.getCompanyById(examination[0].companyId) : null;
    const categoryName = examination[0].categoryId ? await this.getCategoryNameById(examination[0].categoryId) : null;
    const sectionName = examination[0].sectionId ? await this.getSectionNameById(examination[0].sectionId) : null;
    const examinatorUser = examination[0].examinatorUserId ? await this.getUserByDocId(examination[0].examinatorUserId) : null;
    const template = examination[0].templateId ? await this.getTemplateById(examination[0].templateId) : null;
    const cityName = examination[0].cityId ? await this.getCityNameById(examination[0].cityId) : null;

    return {
      examination: examination[0],
      company: company[0],
      categoryName: categoryName[0],
      sectionName: sectionName[0],
      examinatorUser: examinatorUser[0],
      template: template[0],
      cityName: cityName[0]
    };
  }

  getCityNameById(id: string) {
    return this.fireSQL.query(`SELECT name FROM city WHERE __name__ = '${id}'`);
  }

  getTemplateById(id: string) {
    return this.fireSQL.query(`SELECT __name__ as id, name, categoryId, sectionId,companyId, questionIdList, status FROM
      template WHERE __name__ = '${id}'`);
  }

  getExamTemplateById(id: string) {
    return this.fireSQL.query(`SELECT __name__ as id, categoryId, address, cityId, sectionId, startTime,
          date, examinatorUserId, companyId, templateId, participantList
      FROM examination WHERE status = 'active' AND __name__ = '${id}'`);
  }

  getExamList() {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      categoryId,
                                      address,
                                      cityId,
                                      sectionId,
                                      startTime,
                                      date,
                                      examinatorUserId,
                                      companyId,
                                      templateId,
                                      participantList
                               FROM examination
                               WHERE status = 'active'`);
  }

  getExamById(id: string) {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      categoryId,
                                      address,
                                      cityId,
                                      sectionId,
                                      startTime,
                                      date,
                                      examinatorUserId,
                                      companyId,
                                      templateId,
                                      participantList
                               FROM examination
                               WHERE __name__ ='` + id + `'`);
  }

  saveResult(result) {
    return this.firestore.collection('result').add(result);
  }

  getResultList(cased?: string) {
    let query = `SELECT __name__ as
                        id,
                        isTest,
                        correct,
                        mistake,
                        scoreMust,
                        score,
                        category,
                        section,
                        title,
                        userId,
                        username,
                        templateId,
                        companyName
                 FROM result`;
    // FROM result WHERE templateId IN ('F08wusvGDxh4HcWFb2Wm')`;
    if (cased && cased === 'ratings') {
      if (this.cookieService.get('role') !== 'admin') {
        query += ` WHERE userId = '${this.cookieService.get('userId')}'`;
      }
    }
    return this.fireSQL.query(query);
  }

  getResultListQuery(companyNames: string, cased?: string) {
    let query = `SELECT __name__ as
                        id,
                        isTest,
                        correct,
                        mistake,
                        scoreMust,
                        score,
                        category,
                        section,
                        title,
                        userId,
                        username,
                        templateId,
                        companyName
                 FROM result where companyName = ` + companyNames;
    // FROM result WHERE templateId IN ('F08wusvGDxh4HcWFb2Wm')`;
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

  updateUserByDocIdWithoutPassword(userDocId: string, user) {
    return this.firestore.collection('user').doc(userDocId).update({
      idn: user.idn,
      firstname: user.firstname,
      lastname: user.lastname,
      birthdate: user.birthdate,
      // userId: user.userId,
      companyIds: user.companyIds,
      gender: user.gender,
      status: user.status,
      city: user.city,
      phoneNumber: user.phoneNumber,
      role: user.role,
      privilegeList: user.privilegeList,
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
    return this.fireSQL.query(`SELECT __name__ as id, code, name
                               FROM city`);
  }

  addSubsidiary(subsidiary) {
    return this.firestore.collection('subsidiary').add(subsidiary);
  }

  getSubsidiaryList() {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      cityCode,
                                      name,
                                      address,
                                      companyId
                               FROM subsidiary`);
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

  updateRoleAndCompanyId(docId: string, role: string, companyId: string) {
    return this.firestore.doc('user/' + docId).update({'role': role, 'companyId': companyId});
  }

  checkPhoneAndPassword(phone, password) {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      idn,
                                      role,
                                      privilegeList,
                                      lastname,
                                      firstname,
                                      birthdate,
                                      gender,
                                      city,
                                      phoneNumber,
                                      status,
                                      companyId
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
    return this.fireSQL.query(`SELECT __name__ as id, bin, name,phoneNumber
                               FROM company`);
  }

  addCompany(company) {
    return this.firestore.collection('company').add(company);
  }

  updateCompany(company) {
    console.log('===================================');
    console.log(JSON.stringify(company));
    return this.firestore.collection('company').doc(company.id).set({
      bin: company.bin,
      name: company.name,
      phoneNumber: company.phoneNumber,
      subsidiary: company.subsidiary,
      status: company.status
    });
  }

  getCompanyById(id) {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      bin,
                                      name,
                                      phoneNumber,
                                      subsidiary,
                                      status
                               FROM company
                               where __name__ ='` + id + `'`);
  }

  deleteCompany(id) {
    return this.firestore.collection('company').doc(id).delete();
  }

  getCompanyList() {
    return this.fireSQL.query(`SELECT __name__ as id,
                                      bin,
                                      subsidiary,
                                      name,
                                      phoneNumber,
                                      status
                               FROM company`);
  }

  getActiveCompanyList() {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      bin,
                                      subsidiary,
                                      name,
                                      phoneNumber,
                                      status
                               FROM company
                               WHERE status='active'
                               ORDER BY name ASC `);
  }

  getUserList() {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      idn,
                                      role,
                                      privilegeList,
                                      lastname,
                                      firstname,
                                      birthdate,
                                      gender,
                                      city,
                                      phoneNumber,
                                      password,
                                      status,
                                      companyIds,
                                      companyId
                               FROM user`);
  }

  getStudentList() {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      idn,
                                      role,
                                      privilegeList,
                                      lastname,
                                      firstname,
                                      birthdate,
                                      gender,
                                      city,
                                      phoneNumber,
                                      password,
                                      status,
                                      companyIds,
                                      companyId
                               FROM user where role='student'`);
  }

  getUserListByCompany(id) {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      idn,
                                      role,
                                      privilegeList,
                                      lastname,
                                      firstname,
                                      birthdate,
                                      gender,
                                      city,
                                      phoneNumber,
                                      password,
                                      status,
                                      companyIds,
                                      companyId
                               FROM user where companyId=${id}`);
  }

  getUserStudents(company) {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      idn,
                                      role,
                                      privilegeList,
                                      lastname,
                                      firstname,
                                      birthdate,
                                      gender,
                                      city,
                                      phoneNumber,
                                      password,
                                      status,
                                      companyId
                               FROM user where role='student'`);
  }

  getUserByPhone(phone: string) {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      role,
                                      idn,
                                      privilegeList,
                                      lastname,
                                      firstname,
                                      birthdate,
                                      gender,
                                      city,
                                      phoneNumber,
                                      status,
                                      companyId
                               FROM user
                               WHERE phoneNumber= '` + phone + `'`).then(res => {
      return res;
    });
  }

  getUserByDocId(docId: string) {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      idn,
                                      role,
                                      privilegeList,
                                      lastname,
                                      firstname,
                                      birthdate,
                                      gender,
                                      city,
                                      phoneNumber,
                                      status,
                                      companyId
                               FROM user
                               WHERE __name__ = '` + docId + `'`).then(res => {
      return res;
    });
  }

  checkUserByPhone(phone: string) {
    return this.fireSQL.query(`SELECT __name__
                               FROM user
                               WHERE phoneNumber= '` + phone + `'`).then(res => {
      return res;
    });
  }

  getSectionNameById(id) {
    return this.fireSQL.query(`SELECT name
                               FROM section
                               WHERE __name__ = '` + id + `'`).then(res => {
      return res;
    });
  }

  getSectionList() {
    return this.fireSQL.query(`SELECT __name__ as id, name, categoryId
                               FROM section`).then(res => {
      return res;
    });
  }

  getCategoryList() {
    return this.fireSQL.query(`SELECT __name__ as id, name
                               FROM category`).then(res => {
      return res;
    });
  }

  getCategoryNameById(id) {
    return this.fireSQL.query(`SELECT name
                               FROM category
                               WHERE __name__ = '` + id + `'`).then(res => {
      return res;
    });
  }

  async getPreparedTemplateById(id: string) {
    const template = await this.getTemplateById(id);
    const company = template[0].companyId ? await this.getCompanyById(template[0].companyId) : null;
    const categoryName = template[0].categoryId ? await this.getCategoryNameById(template[0].categoryId) : null;
    const sectionName = template[0].sectionId ? await this.getSectionNameById(template[0].sectionId) : null;
    const templateResult = template[0].id ? await this.getTemplateResultByTemplateId(template[0].id) : null;

    return {
      template: template[0],
      company: company[0],
      categoryName: categoryName[0],
      sectionName: sectionName[0],
      templateResult: templateResult
    };
  }

  getActiveTemplateList(companyId) {
    return this.fireSQL.query(`SELECT __name__ as
                                      id,
                                      name,
                                      categoryId,
                                      sectionId,
                                      companyId,
                                      questionIdList,
                                      status
                               FROM template
                               WHERE status ='active' AND isExamTemplate = false`)
      .then(res => {
        console.log(res);
        return res;
      });
  }

  getTemplateResultByTemplateId(id: string) {
    return this.fireSQL.query(`SELECT __name__ as id,templateId FROM result WHERE templateId = '${id}'`);
  }

  getTemplateResultListByIds(temlateIds: string[]) {
    let temp = '';
    for (const str of temlateIds) {
      temp = temp + '"' + str + '",';
    }
    temp = temp.substring(0, temp.length - 1);
    console.log('temp to search: ', temp);
    return this.fireSQL.query(`SELECT __name__ as id,templateId FROM result WHERE templateId IN (${temp})`);
  }

  getUserFioByIds(userIds: string[]) {
    let temp = '';
    for (const str of userIds) {
      temp = temp + '"' + str + '",';
    }
    temp = temp.substring(0, temp.length - 1);
    // console.log('temp to search: ', temp);
    const query = `SELECT __name__ as id,firstname, lastname FROM user WHERE __name__ IN (${temp})`;
    // console.log('query: ', query);
    return this.fireSQL.query(query);
  }

  deleteTemplateById(id: string) {
    return this.firestore.collection('template').doc(id).delete();
  }

  getUserPrivilegeListByDocId(userDocId: string) {
    return this.fireSQL.query(`SELECT __name__ as id, privilegeList
                               FROM user
                               WHERE __name__ ='` + userDocId + `'`)
      .then(res => {
        return res;
      });
  }

  getConditionTerms() {
    return this.fireSQL.query('SELECT __name__ as id, description FROM condition');
  }

  updateConditionTerms(id, description: string) {
    return this.firestore.collection('condition').doc(id).update({
      description: description
    });
  }
}
