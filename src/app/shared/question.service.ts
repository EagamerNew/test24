import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import * as fire from "firebase"
import {FireSQL} from "firesql";
import FieldPath = fire.firestore.FieldPath;

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  fireSQL: FireSQL;

  constructor(private firebase: AngularFirestore) {
    this.fireSQL = new FireSQL(this.firebase.firestore);
  }

  getQuestionListByIdIn(idList: string[]) {
    let temp = "";
    for (let str of idList) {
      temp = temp + '"' + str + '",';
    }
    temp = temp.substring(0, temp.length - 1);
    // console.log(temp);
    return this.fireSQL.query(`SELECT __name__ as docId, answers, author, category, correctAnswer,
                                    description, point, questionType, section
                                     FROM question WHERE __name__ IN (` + temp + `) `);
  }

  getCategoryNameById(id) {
    return this.firebase.collection('category').doc(id).snapshotChanges();
  }

  getSectionNameById(id) {
    return this.firebase.collection('section').doc(id).snapshotChanges();
  }

  getActiveTemplateList() {
    return this.firebase
      .collection('template', ref => ref.where("status", "==", "0")
      ).snapshotChanges();
  }

  getTemplateById(id: string) {
    return this.firebase
      .collection('template').doc(id).snapshotChanges();
  }

  getAllQuestions() {
    return this.firebase.collection('question').snapshotChanges()
  }

  getQuestionById(docId: string) {
    return this.firebase.doc('question/' + docId).snapshotChanges();
  }

  getListIdOfActiveQuestion(){
    return this.fireSQL.query(`SELECT __name__ as id FROM question WHERE status = 'accepted'`);
  }

  getListIdOfActiveCompanyQuestion(companyId){
    return this.fireSQL.query(`SELECT __name__ as id FROM question WHERE status = 'accepted' AND company = '${companyId}'`);
  }

  getActiveQuestions() {
    return this.firebase
      .collection('question',
        ref => ref.where("status", "==", "accepted").limit(5)
      ).snapshotChanges();
  }

  getActiveCompanyQuestions(companyId) {
    return this.firebase
      .collection('question',
        ref => ref.where("status", "==", "accepted")
          .where('company', '==', companyId).limit(5)
      ).snapshotChanges();
  }

  getActiveNextQuestions(id) {
    return this.firebase
      .collection('question',
        ref => ref.where("status", "==", "accepted").orderBy(FieldPath.documentId()).startAt(id).limit(6)
      ).snapshotChanges();
  }

  getActiveNextCompanyQuestions(id,companyId) {
    return this.firebase
      .collection('question',
        ref => ref.where("status", "==", "accepted")
          .where('company', '==', companyId)
          .orderBy(FieldPath.documentId()).startAt(id).limit(6)
      ).snapshotChanges();
  }

  getActivePrevQuestions(id) {
    return this.firebase
      .collection('question',
        ref => ref.where("status", "==", "accepted").orderBy(FieldPath.documentId()).startAt(id).limit(5)
      ).snapshotChanges();
  }

  getActivePrevCompanyQuestions(id,company) {
    return this.firebase
      .collection('question',
        ref => ref.where("status", "==", "accepted")
          .where('company', '==', company)
          .orderBy(FieldPath.documentId()).startAt(id).limit(5)
      ).snapshotChanges();
  }

  getActiveQuestionsByCompanyId(companyId: string) {
    return this.fireSQL.query(`SELECT __name__ as docId, answers,company,speciality, author, category, correctAnswer,
                                    description, point, questionType, section, isExamQuestion
                                     FROM question WHERE company = '${companyId}'`);
  }

  getRejectedQuestions() {
    return this.firebase
      .collection('question',
        ref => ref.where("status", "==", "rejected")
      ).snapshotChanges();
  }

  getArchivedQuestions() {
    return this.firebase
      .collection('question',
        ref => ref.where("status", "==", "in_archive")
      ).snapshotChanges();
  }

  getModeratingQuestions() {
    return this.firebase
      .collection('question',
        ref => ref.where("status", "==", "in_moderation")
      ).snapshotChanges();
  }

  updateQuestion(question) {
    let docId = question.docId;
    delete question.docId;
    console.log('updating question: ', question, '\n docId:', docId);
    return this.firebase.collection('question').doc(docId).set(question);
  }

  deleteQuestion(questionId) {
    this.firebase.doc('question/' + questionId).delete();
  }

}
