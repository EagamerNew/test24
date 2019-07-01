import {Component, OnInit} from '@angular/core';
import {QuestionService} from "../shared/question.service";
import {QuestionList} from "./question-list";
import {MatSnackBar} from "@angular/material";
import {QuestionCategory} from "../question/category/question-category.model";
import {QuestionSection} from "../question/section/question-section.model";
import {CategoryService} from "../shared/category.service";
import {SectionService} from "../shared/section.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommonService} from "../shared/common.service";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.scss']
})
export class ListQuestionsComponent implements OnInit {

  questions: QuestionList[];

  categories: QuestionCategory[] = [];
  specialityList: any[] = [];
  sections: QuestionSection[] = [];
  sectionSelectDisable = true;
  docId: string;
  companyList: any[] = [];
  loading: boolean = true;
  searching: boolean = false;

  companyId: string;
  questionIdList: any[];
  isAdmin: boolean = false;
  page = 1;
  maxPage = 0;
  searchString: string = "";

  constructor(private service: QuestionService,
              public snackBar: MatSnackBar,
              private serviceCategory: CategoryService,
              private serviceSection: SectionService,
              private commonService: CommonService,
              private route: ActivatedRoute,
              private router: Router,
              private cookieService: CookieService) {
  }

  ngOnInit() {
    this.cookieService.set('title', 'Вопросы');
    this.loading = true;
    this.getCompanyList();
    this.getSpecialityList();
    this.route.params.subscribe(res => {
      this.docId = res['docId'];
      this.getCategories();
      if (this.docId) {
        this.getRejectedQuestion();
      } else {
        if (this.cookieService.get('role') === 'admin') {
          this.isAdmin = true;
          this.getQuestions();

        } else {
          this.isAdmin = false;
          if (this.cookieService.get('companyId')) {
            this.companyId = this.cookieService.get('companyId');
            this.getQuestionsByCompanyId();

          } else {
            this.openSnackBar('Вы не состоите в компании!', '');
          }
        }
      }


    });

  }

  handleSearchString() {
    this.searchString = "";
    this.searching = false;
    if (this.isAdmin) {
      this.getQuestions();
    } else {
      this.getQuestionsByCompanyId();
    }

  }

  search() {
    this.loading = true;
    if (this.searchString.trim().length > 0) {
      this.searching = true;
      if (this.isAdmin) {
        console.log('searchString: ' + this.searchString)
        this.service.searchActiveQuestions(this.searchString).subscribe(res => {
          let result: any = res;
          this.questions = result.map(reslist => {
            return {
              docId: reslist.payload.doc.id,
              ...reslist.payload.doc.data()
            }
          });
          this.loading = false;
          console.log('result: ', this.questions);
        });
      } else {
        this.service.searchActiveCompanyQuestions(this.companyId,this.searchString).subscribe(res => {
          let result: any = res;
          this.questions = result.map(reslist => {
            return {
              docId: reslist.payload.doc.id,
              ...reslist.payload.doc.data()
            }
          });
          this.loading = false;
          console.log('result: ', this.questions);
        });
      }
    } else {
      this.handleSearchString();
    }
  }

  getSpecialityList() {
    this.commonService.getSpecialityList().then(res => {
      this.specialityList = res;
    })
  }


  getCompanyList() {
    this.commonService.getActiveCompanyList().then(res => {
      this.companyList = res;
    })
  }

  // TODO modify to get one question using doc id
  getRejectedQuestion() {
    this.service.getRejectedQuestions().subscribe(
      list => {
        this.questions = list.map(item => {
          if (this.docId === item.payload.doc.id) {
            this.serviceSection.getSections().subscribe(res => {
              res.map(item => {
                this.sections.push(new QuestionSection(item.payload.doc.id, item.payload.doc.get('name'), item.payload.doc.get('categoryId')))
              })
            });
            console.log('case 3');
            return {
              docId: item.payload.doc.id,
              ...item.payload.doc.data()
            }
          }

        })
      }
    )
  }

  getQuestions() {
    this.page = 1;
    this.loading = true;
    this.service.getListIdOfActiveQuestion().then(ress => {
      this.questionIdList = ress;
      console.log('max length res:', ress);
      this.maxPage = Math.ceil(ress.length / 5);
      console.log('maxPage is: ', this.maxPage);
      console.log('size is: ', ress.length);
    });
    this.service.getActiveQuestions().subscribe(
      list => {

        console.log('list: ', list);

        this.questions = list.map(item => {

          return {
            docId: item.payload.doc.id,
            ...item.payload.doc.data()
          }
        });
        this.serviceSection.getSections().subscribe(res => {
          res.map(item => {
            this.sections.push(new QuestionSection(item.payload.doc.id, item.payload.doc.get('name'), item.payload.doc.get('categoryId')))
          })
        });
        this.loading = false;

      }
    )
  }

  getQuestionsByCompanyId() {
    this.page = 1;
    this.loading = true;
    this.service.getListIdOfActiveCompanyQuestion(this.companyId).then(ress => {
      this.questionIdList = ress;
      console.log('max length res:', ress);
      this.maxPage = Math.ceil(ress.length / 5);
      console.log('maxPage is: ', this.maxPage);
      console.log('size is: ', ress.length);
    });
    this.service.getActiveCompanyQuestions(this.cookieService.get('companyId')).subscribe(
      list => {
        this.questions = list.map(itemq => {
          return {
            docId: itemq.payload.doc.id,
            ...itemq.payload.doc.data()
          }
        });
        this.serviceSection.getSections().subscribe(res => {
          res.map(item => {

            this.loading = false;
            this.sections.push(new QuestionSection(item.payload.doc.id, item.payload.doc.get('name'),
              item.payload.doc.get('categoryId')))
          });
        });
      }
    )

  }

  save(question) {
    this.loading = true;
    if (this.docId) {
      question.status = 'in_moderation';
    }
    this.service.updateQuestion(question).then(
      res => {
        console.log("success", res);
        if (this.docId) {
          this.router.navigateByUrl('');
        }
        this.loading = false;
        if (this.isAdmin) {
          this.getQuestions();
        } else {
          this.getQuestionsByCompanyId();
        }
      }
    )
  }

  getCategories() {
    this.serviceCategory.getCategories().subscribe(
      list => {
        this.categories = [];
        list.map(item => {
          this.categories.push(new QuestionCategory(item.payload.doc.id, item.payload.doc.get('name')))
        })
        console.log('categories: ', this.categories);
      }
    )
  }

  getSectionsByCategory(event) {
    const categoryId: string = event.value;
    // get data from DB by category ID
    this.serviceSection.getSectionsByCategory(categoryId).subscribe(
      list => {
        this.sections = []
        list.map(item => {
          this.sections.push(new QuestionSection(item.payload.doc.id, item.payload.doc.get('name'), item.payload.doc.get('categoryId')))
        })
      }
    )
    this.sectionSelectDisable = false;
  }

  delete(question) {
    this.service.deleteQuestion(question.docId);

    if (this.isAdmin) {
      this.getQuestions();
    } else {
      this.getQuestionsByCompanyId();
    }
    this.openSnackBar('Вопрос успешно удален!', '');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  nextQuestions() {
    this.page++;
    this.loading = true;
    let lastId = this.questions[this.questions.length - 1].docId;
    if (this.isAdmin) {
      this.service.getActiveNextQuestions(lastId).subscribe(res => {
        this.questions = res.map(val => {
          return {
            docId: val.payload.doc.id,
            ...val.payload.doc.data()
          }
        });
        this.questions.forEach((val, ind) => {
          if (val.docId === lastId) {
            this.loading = false;
            this.questions.splice(ind, 1);
          }
        });
      });
    } else {
      this.service.getActiveNextCompanyQuestions(lastId, this.companyId).subscribe(res => {
        this.questions = res.map(val => {
          return {
            docId: val.payload.doc.id,
            ...val.payload.doc.data()
          }
        });
        this.questions.forEach((val, ind) => {
          if (val.docId === lastId) {
            this.loading = false;
            this.questions.splice(ind, 1);
          }
        });
      });
    }
  }

  predQuestions() {
    this.page--;
    this.loading = true;
    let lastId = this.questionIdList[this.questionIdList.indexOf(this.questions[0].docId) - 5];
    this.questionIdList.forEach((val, ind) => {
      if (val.id === this.questions[0].docId) {
        lastId = this.questionIdList[ind - 5].id;
      }
    })
    if (this.isAdmin) {
      this.service.getActivePrevQuestions(lastId).subscribe(res => {
        this.questions = res.map(val => {
          return {
            docId: val.payload.doc.id,
            ...val.payload.doc.data()
          }
        });
        this.loading = false;
      });
    } else {
      this.service.getActivePrevCompanyQuestions(lastId, this.companyId).subscribe(res => {
        this.questions = res.map(val => {
          return {
            docId: val.payload.doc.id,
            ...val.payload.doc.data()
          }
        });
        this.loading = false;
      });
    }
  }
}
