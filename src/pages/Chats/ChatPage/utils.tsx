import moment from "moment"

export const getDateString = (date: Date) => {
    if(moment(date).diff(moment(), 'days') === 0) {
        return 'Today'
    }
    if(moment(date).diff(moment(), 'days') === 1) {
        return 'Yesterday'
    }
    if(moment(date).diff(moment(), 'days') === -1) {
        return 'Tomorrow'
    }
    return moment(date).format('MMMM DDD YYYY');
}