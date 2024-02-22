import moment from "moment";

module.exports = function () {
    const firstDayOfWeek = moment().startOf('week').subtract(1, 'days');
    const lastDayOfWeek = moment().endOf('week').add(1, 'days');
    const durationToLastDayOfWeek = moment.duration(lastDayOfWeek.diff(moment.now()));
    
    return {
        startDate: function () { return firstDayOfWeek.format('YYYY-MM-DD') },
        date: function () { return lastDayOfWeek.toDate() },
        seconds: function () { return Math.round(durationToLastDayOfWeek.asSeconds()) }
    }
}();