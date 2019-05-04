import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/firestore";
import * as fire from "firebase"
import {FireSQL} from "firesql";

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

  getActiveQuestions() {
    return this.firebase
      .collection('question',
        ref => ref.where("status", "==", "accepted")
      ).snapshotChanges();
  }

  getActiveQuestionsByAuthorId(authorId: string) {
    return this.fireSQL.query(`SELECT __name__ as docId, answers,company,speciality, author, category, correctAnswer,
                                    description, point, questionType, section
                                     FROM question WHERE author = '${authorId}'`);
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
    return this.firebase.collection('question').doc(docId).set(question);
  }

  deleteQuestion(questionId) {
    this.firebase.doc('question/' + questionId).delete();
  }

}
