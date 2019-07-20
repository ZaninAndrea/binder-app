const supermemo2 = require("./supermemo2.js")
const dayjs = require("dayjs")
let db = require("./db")

class Deck {
    constructor() {
        const now = new Date()

        this.db = db
        this.indexesToReview = db
            .filter(
                ({ nextRepeat, isRepeatAgain }) =>
                    (nextRepeat !== null && nextRepeat <= now) || isRepeatAgain
            )
            .map(card => card.id)
        this.currentIndex =
            this.indexesToReview.length > 0 ? this.indexesToReview[0] : null
    }

    grade(quality) {
        let card = this.getCard()
        let { isRepeatAgain, factor, schedule } = supermemo2(
            quality,
            card.lastSchedule,
            card.factor
        )

        this.db = this.db.map(entry =>
            entry.id === card.id
                ? {
                      ...entry,
                      repetitions: [
                          ...entry.repetitions,
                          { quality, date: new Date() },
                      ],
                      factor,
                      lastSchedule: entry.isRepeatAgain
                          ? entry.lastSchedule
                          : schedule,
                      isRepeatAgain,
                      nextRepeat: entry.isRepeatAgain
                          ? entry.nextRepeat
                          : dayjs(entry.nextRepeat)
                                .add(schedule, "days")
                                .toDate(),
                  }
                : entry
        )

        if (isRepeatAgain) {
            this.indexesToReview.push(this.currentIndex)
        }

        this.indexesToReview.shift()
        this.currentIndex =
            this.indexesToReview.length > 0 ? this.indexesToReview[0] : null
    }

    getCard() {
        return this.currentIndex !== null ? this.db[this.currentIndex] : null
    }
}

export default Deck
