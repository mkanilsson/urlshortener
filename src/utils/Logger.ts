import * as fs from "fs";

export default class Logger {
    static file: string = "log.txt";

    static init(fileName: string = "log.txt", clearFile: boolean = false) {
        this.file = fileName;

        let initMessage: string = "---- STARTING " + this.getDate() + " ----\n";

        console.log(initMessage);

        if (clearFile) fs.writeFile(this.file, initMessage, () => {});
        else fs.appendFile(this.file, initMessage, () => {});
    }

    static log(message: string): void {
        this.write("LOG", message);
    }

    static error(message: string): void {
        this.write("ERROR", message);
    }

    static warning(message: string): void {
        this.write("WARNING", message);
    }

    static write(method: string, message: string) {
        let text = `[${method}] ${this.getDate()} - ${message}`;
        console.warn(text);
        fs.appendFile(this.file, text + "\n", () => {});
    }

    static getDate(): string {
        let date = new Date();

        let minutes = date.getMinutes();
        let minutesText = minutes.toString();

        if (minutes < 10) minutesText = "0" + minutes.toString();

        let secounds = date.getSeconds();
        let secoundsText = secounds.toString();

        if (secounds < 10) secoundsText = "0" + secounds.toString();

        return (
            date.getFullYear() +
            "/" +
            date.getMonth() +
            "/" +
            date.getDay() +
            " " +
            date.getHours() +
            ":" +
            minutesText +
            ":" +
            secoundsText
        );
    }
}
