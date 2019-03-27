export interface IQuestion {
    id?: string;
    description?: string;
    questionType?: string;
    answers?: string[];
    correctAnswer?: string;
    author?: string;
    company?: string;
    point?: number;
    sectionId?: string;
    status?: string;
    note?: string;
}


export class Question implements IQuestion {
    constructor(
        public id: string,
        public description?: string,
        public questionType?: string,
        public answers?: string[],
        public correctAnswer?: string,
        public author?: string,
        public company?: string,
        public point?: number,
        public sectionId?: string,
        public status?: string,
        public note?: string
    ) {
        this.id = this.id ? this.id : null;
        this.description = this.description ? this.description : '';
        this.questionType = this.questionType ? this.questionType : null;
        this.answers = this.answers ? this.answers : [];
        this.correctAnswer = this.correctAnswer ? this.correctAnswer : '';
        this.author = this.author ? this.author : '';
        this.company = this.company ? this.company : '';
        this.point = this.point ? this.point : 0;
        this.sectionId = this.sectionId ? this.sectionId : null;
        this.status = this.status ? this.status : null;
        this.note = this.note ? this.note : null;
    }
}
