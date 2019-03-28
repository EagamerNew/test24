import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import * as firebase from "firebase";
import {FireSQL} from "firesql";
import {Observable} from "rxjs";
import {Template} from './model/template';
import {User} from "./model/user";

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

  saveUser(user: any) {
    return this.firestore.collection('user').add(user);
  }

  updateUserId(user, userId: string){
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

  updateUserByDocId(userDocId: string, user){
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

  deleteUserByUserDocId(userDocId){
    return this.firestore.collection('user').doc(userDocId).delete();
  }

  addCity(city){
    return this.firestore.collection('city').add(city);
  }
  deleteCity(city){
    return this.firestore.collection('city').doc(city.id).delete();
  }
  getCityList(){
    return this.fireSQL.query(`SELECT __name__ as id, code, name FROM city`);
  }

  getUserList(){
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
}
