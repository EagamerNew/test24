export interface IQuestionCategory {
    id?: string;
    name?: string;
}


export class QuestionCategory implements IQuestionCategory{
    constructor(
        public id: string,
        public name: string
    ){
        this.id = this.id ? this.id : null;
        this.name = this.name ? this.name : '';
    }
}
  