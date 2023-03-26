import React, { Component } from "react"
import CalendarHeatmap from "react-calendar-heatmap"
import "react-calendar-heatmap/dist/styles.css"
import { Mobile, Desktop } from "../utils/MobileDesktop"
import RepetitionsCalendar from "../blocks/RepetitionsCalendar"
const dayjs = require("dayjs")

export default class HomePage extends Component {
    componentDidMount() {
        const calendar = document.getElementById("home-repetitions-calendar")
        calendar.scrollTo(0, calendar.scrollHeight)
    }

    render() {
        const totalCards = this.props.decks.reduce(
            (acc, deck) => acc + deck.cards.length,
            0
        )
        const totalRepetitions = this.props.decks.reduce(
            (acc, deck) =>
                acc +
                deck.cards.reduce(
                    (acc2, card) => acc2 + card.totalRepetitions,
                    0
                ),
            0
        )
        const correctRepetitions = this.props.decks.reduce(
            (acc, deck) =>
                acc +
                deck.cards.reduce(
                    (acc2, card) => acc2 + card.correctRepetitions,
                    0
                ),
            0
        )
        const recallAccuracy =
            totalRepetitions === 0
                ? 100
                : Math.round((100 * correctRepetitions) / totalRepetitions)

        return (
            <div className="home">
                <RepetitionsCalendar
                    title="Repetitions"
                    id="home-repetitions-calendar"
                    values={Object.entries(
                        this.props.userData.statistics.dailyRepetitions
                    ).map(([date, value]) => ({
                        year: dayjs(date).year(),
                        month: dayjs(date).month() + 1,
                        day: dayjs(date).date(),
                        value,
                    }))}
                    colors={["#eee", "#ead1ff", "#dbb3ff", "#ce96ff"]}
                    maxValue={50}
                    streaks={[]}
                />
                <div className="home-stats">
                    <div className="total-cards">
                        {totalCards} <span className="unit">Cards</span>
                    </div>
                    <div className="total-repetitions">
                        {totalRepetitions}{" "}
                        <span className="unit">Repetitions</span>
                    </div>
                    <div className="total-repetitions">
                        {recallAccuracy}
                        {"% "}
                        <span className="unit">Accuracy</span>
                    </div>
                </div>
            </div>
        )
    }
}
