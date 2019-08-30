const supermemo2 = require("./supermemo2.js")
const dayjs = require("dayjs")

const maskArray = (arr, indexes) => [...new Set(indexes)].map(id => arr[id])

class Deck {
    constructor(deck, updateDecks) {
        const now = new Date()
        this.cards = deck.cards
        this.id = deck.id
        this.name = deck.name
        this.updateDecks = updateDecks

        this.indexesToReview = this.cards
            .filter(
                ({ nextRepeat, isRepeatAgain }) =>
                    (nextRepeat !== null && new Date(nextRepeat) <= now) ||
                    isRepeatAgain
            )
            .map(card => card.id)

        this.indexesToLearn = this.cards
            .filter(({ nextRepeat }) => nextRepeat === null)
            .map(card => card.id)

        this.currentIndex = null
    }

    saveDB() {
        this.updateDecks()
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            cards: this.cards,
        }
    }

    grade(quality) {
        let card = this.getCurrentCard()
        this.indexesToReview.shift()
        let { isRepeatAgain, factor, schedule } = supermemo2(
            quality,
            card.lastSchedule,
            card.factor
        )

        this.cards = this.cards.map(entry =>
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
        this.saveDB()

        if (isRepeatAgain) {
            this.indexesToReview.push(this.currentIndex)
        }
    }

    learn() {
        // learning a card counts as a grade 4 recollection
        this.indexesToReview.push(this.indexesToLearn.shift())
        this.grade(4)
    }

    getCurrentCard() {
        return this.currentIndex !== null ? this.cards[this.currentIndex] : null
    }

    cardsToReview() {
        return maskArray(this.cards, this.indexesToReview)
    }

    cardsToLearn() {
        return maskArray(this.cards, this.indexesToLearn)
    }

    hasCardsToReview() {
        return this.indexesToReview.length > 0
    }

    hasCardsToLearn() {
        return this.indexesToLearn.length > 0
    }

    nextCardToReview() {
        this.currentIndex = this.hasCardsToReview()
            ? this.indexesToReview[0]
            : null

        return { ...this.getCurrentCard(), isNew: false }
    }

    nextCardToLearn() {
        this.currentIndex = this.hasCardsToLearn()
            ? this.indexesToLearn[0]
            : null

        return { ...this.getCurrentCard(), isNew: true }
    }
}

export default Deck
