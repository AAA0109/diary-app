import moment from "moment";

export function isToday(date: any) {
    return new Date(Date.parse(date.toString())).toDateString() === new Date().toDateString();
}

export function showDateString(value: any) {
    const date = new Date(value.toString());
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate()).toString().padStart(2, '0')}`;
}

export function hummanizeDateDiff(startDate: Date, endDate: Date) {
    const diff = moment(endDate).diff(startDate);
    return moment.duration(diff).humanize();
}