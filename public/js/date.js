class FormatDate extends Date {
    constructor(dateString){
        super(dateString);
        this.months =['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    }
    short(){
        return `${this.getDate() < 10 ? '0' + this.getDate():this.getDate()}-${this.months[this.getMonth()]}-${this.getFullYear()}`;
    }
    long(){
        return `${this.getDate() < 10 ? '0' + this.getDate():this.getDate()}-${this.months[this.getMonth()]}-${this.getFullYear()} ${this.getHours() < 10 ? '0' + this.getHours():this.getHours()}:${this.getMinutes()}`;
    }
}
