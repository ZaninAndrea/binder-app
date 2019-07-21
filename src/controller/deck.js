const supermemo2 = require("./supermemo2.js")
const dayjs = require("dayjs")
let starterDB = require("./db")

class Deck {
    constructor() {
        const now = new Date()
        this.loadDB()

        console.log(this.db)

        this.indexesToReview = this.db
            .filter(
                ({ nextRepeat, isRepeatAgain }) =>
                    (nextRepeat !== null && new Date(nextRepeat) <= now) ||
                    isRepeatAgain
            )
            .map(card => card.id)

        this.indexesToLearn = this.db
            .filter(({ nextRepeat }) => nextRepeat === null)
            .map(card => card.id)

        this.currentIndex = null
        this._mode = this.indexesToReview.length > 0 ? "REVIEW" : "LEARN"
    }

    mode() {
        this._mode =
            this.indexesToReview.length >= 3
                ? "REVIEW"
                : this.indexesToReview.length === 0
                ? "LEARN"
                : this._mode

        return this._mode
    }

    loadDB() {
        let db = localStorage.getItem("db")

        if (db !== null) {
            this.db = JSON.parse(db)
        } else {
            this.db = starterDB
            localStorage.setItem("db", JSON.stringify(this.db))
        }
    }

    saveDB(newDB) {
        localStorage.setItem("db", JSON.stringify(newDB))
    }

    grade(quality) {
        let card = this.getCurrentCard()
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
                          : dayjs(entry.nextRepeat || new Date())
                                .add(schedule, "days")
                                .toDate(),
                  }
                : entry
        )
        this.saveDB(this.db)

        if (isRepeatAgain) {
            this.indexesToReview.push(this.currentIndex)
        }
    }

    getCurrentCard() {
        return this.currentIndex !== null ? this.db[this.currentIndex] : null
    }

    hasCardsToReview() {
        return this.indexesToReview.length > 0
    }

    hasCardsToLearn() {
        return this.indexesToLearn.length > 0
    }

    nextCard() {
        return this.mode() === "REVIEW"
            ? this.nextCardToReview()
            : this.nextCardToLearn()
    }

    nextCardToReview() {
        this.currentIndex = this.hasCardsToReview()
            ? this.indexesToReview[0]
            : null

        this.indexesToReview.shift()
        return { ...this.getCurrentCard(), isNew: false }
    }

    nextCardToLearn() {
        this.currentIndex = this.hasCardsToLearn()
            ? this.indexesToLearn[0]
            : null

        this.indexesToReview.push(this.indexesToLearn.shift())
        return { ...this.getCurrentCard(), isNew: true }
    }
}

export default Deck
