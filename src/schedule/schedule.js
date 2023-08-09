class Schedule {
    constructor(id) {
        this.randomID = id
        this.daysInWeek = {
            'Sunday':false,
            'Monday':false,
            'Tuesday':false,
            'Wednesday':false,
            'Thursday':false,
            'Friday':false,
            'Saturday':false
        }
    }

    daysRemaining(currentWeek) {
        /*
            Inputs
                daysUnavailable:array
                    array of days the user is unavailable
            Takes array and modifies modifies object
        */
            if (!Array.isArray(currentWeek)) {
                throw new Error('Expected daysUnavailable to be an array.');
            }
    
            for (let day of currentWeek) {
                if (this.daysInWeek.hasOwnProperty(day)) {
                    this.daysInWeek[day] = true;
                } else {
                    console.warn(`Day "${day}" is not recognized.`);
                }
            }
        }

    updateDays(daysUnavailable) {
        /*
            Inputs
                daysUnavailable:array
                    array of days the user is unavailable
            Takes array and modifies modifies object
        */
            if (!Array.isArray(daysUnavailable)) {
                throw new Error('Expected daysUnavailable to be an array.');
            }
    
            for (let day of daysUnavailable) {
                if (this.daysInWeek.hasOwnProperty(day)) {
                    this.daysInWeek[day] = false;
                } else {
                    console.warn(`Day "${day}" is not recognized.`);
                }
            }
        }
    }


module.exports = {
    Schedule
}