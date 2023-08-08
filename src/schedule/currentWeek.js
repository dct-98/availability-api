function currentWeek() {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const currentDate = new Date()
    const currentDayIndex = currentDate.getDay()

    return daysOfWeek.slice(currentDayIndex + 1)
}

module.exports = {
    currentWeek
}