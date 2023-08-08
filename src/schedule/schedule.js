class Schedule {
    constructor(id, daysLeft) {
        this.randomID = id
        this.daysInWeek = daysLeft 
    }

    updateDays(daysUnavailable) {
        this.daysInWeek = this.daysInWeek.filter(day => !daysUnavailable.includes(day))
    }

}

module.exports = {
    Schedule
}