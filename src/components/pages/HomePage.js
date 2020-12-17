import React, { Component } from "react"
import CalendarHeatmap from "react-calendar-heatmap"
import "react-calendar-heatmap/dist/styles.css"
import { Mobile, Desktop } from "../utils/MobileDesktop"
const dayjs = require("dayjs")

function computeStreakValues(decks) {
    if (!decks) {
        return { streak: [], high: 0, medium: 0 }
    }

    const repetitions = decks
        .map((deck) => deck.cards)
        .flat()
        .map((card) => card.repetitions)
        .flat()

    const map = {}
    for (let repetition of repetitions) {
        let day = new Date(repetition.date).toDateString()
        if (map[day]) {
            map[day]++
        } else {
            map[day] = 1
        }
    }

    let streakArray = []
    for (let day in map) {
        streakArray.push({ date: new Date(day).toUTCString(), value: map[day] })
    }

    const counts = streakArray.map((day) => day.value).sort()
    const medium = counts[Math.floor(counts.length / 3)]
    const high = counts[Math.floor((2 * counts.length) / 3)]

    return { streak: streakArray, high, medium }
}

export default class HomePage extends Component {
    render() {
        const { streak, high, medium } = computeStreakValues(this.props.decks)
        const totalCards = this.props.decks.reduce(
            (acc, deck) => acc + deck.cards.length,
            0
        )
        const totalRepetitions = this.props.decks.reduce(
            (acc, deck) =>
                acc +
                deck.cards.reduce(
                    (acc2, card) => acc2 + card.repetitions.length,
                    0
                ),
            0
        )

        return (
            <div className="home">
                <div id="streak-calendar">
                    <Desktop>
                        <CalendarHeatmap
                            startDate={dayjs(new Date())
                                .subtract(1, "year")
                                .toDate()}
                            endDate={new Date()}
                            values={streak}
                            titleForValue={(data) =>
                                data
                                    ? `${data.value} repetitions`
                                    : `0 repetitions`
                            }
                            classForValue={(data) => {
                                if (!data) {
                                    return "color-empty"
                                } else if (data.value > high) {
                                    return `color-scale-high`
                                } else if (data.value > medium) {
                                    return `color-scale-medium`
                                } else if (data.value > 1) {
                                    return `color-scale-low`
                                } else {
                                    return "color-empty"
                                }
                            }}
                        />
                        <div className="home-stats">
                            <div className="total-cards">
                                {totalCards} Cards
                            </div>
                            <div className="total-repetitions">
                                {totalRepetitions} Repetitions
                            </div>
                        </div>
                    </Desktop>
                    <Mobile>
                        <CalendarHeatmap
                            startDate={dayjs(new Date())
                                .subtract(6, "months")
                                .toDate()}
                            endDate={new Date()}
                            values={streak}
                            titleForValue={(data) =>
                                data
                                    ? `${data.value} repetitions`
                                    : `0 repetitions`
                            }
                            classForValue={(data) => {
                                if (!data) {
                                    return "color-empty"
                                } else if (data.value > high) {
                                    return `color-scale-high`
                                } else if (data.value > medium) {
                                    return `color-scale-medium`
                                } else if (data.value > 1) {
                                    return `color-scale-low`
                                } else {
                                    return "color-empty"
                                }
                            }}
                        />
                    </Mobile>
                </div>
            </div>
        )
    }
}
