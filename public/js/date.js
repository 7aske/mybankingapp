class FormatDate extends Date {
    constructor(dateString){
        super(dateString);

    }
    short(){
        return `${this.getDate()}-${this.getMonth()}-${this.getFullYear()}`;
    }
    long(){
        return `${this.getDate()}-${this.getMonth()}-${this.getFullYear()} ${this.getHours() < 10 ? '0' + this.getHours():this.getHours()}:${this.getMinutes()}`;
    }
}