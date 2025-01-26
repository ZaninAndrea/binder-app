import React from "react"
import ArrowForwardIcon from "@material-ui/icons/ArrowForward"

let achievementTitle = [
    "Beginner",
    "Amateur",
    "Novice",
    "Apprentice",
    "Journeyman",
    "Adept",
    "Expert",
    "Master",
    "Virtuoso",
    "Grandmaster",
    "Grandmaster II",
    "Grandmaster III",
    "Grandmaster IV",
    "Grandmaster V",
    "Grandmaster VI",
    "Grandmaster VII",
    "Grandmaster VIII",
    "Grandmaster IX",
    "Grandmaster X",
]
let achievementName = {
    totalRepetitions: "Repetitions",
    activeDays: "Perseverance",
    singleDayRepetitions: "One-day",
}
let requirements = {
    totalRepetitions: [
        0, 10, 25, 50, 100, 250, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000,
        6000, 7000, 8000, 9000, 10000,
    ],
    activeDays: [0, 3, 7, 14, 30, 50, 100, 150, 200, 300, 365, 500, 730, 1000],
    singleDayRepetitions: [
        0, 2, 5, 10, 20, 30, 50, 75, 100, 125, 150, 175, 200,
    ],
}
let achievementDescription = {
    totalRepetitions: (level) => (
        <>
            You've reached {requirements.totalRepetitions[level]} repetitions in
            total!
        </>
    ),
    activeDays: (level) => (
        <>
            You've done {requirements.activeDays[level]} days of studying
            flashcards!
        </>
    ),
    singleDayRepetitions: (level) => (
        <>
            You've done {requirements.singleDayRepetitions[level]} repetitions
            in a single day!
        </>
    ),
}

export default class EndBatchScreen extends React.Component {
    render() {
        let body = (
            <div className="card">
                <div className="message">
                    <h1>You completed a batch of cards, well done!</h1>
                </div>
            </div>
        )

        if (this.props.unlockedAchievements.length > 0) {
            body = (
                <div className="card">
                    <div className="message">
                        {this.props.unlockedAchievements.map((a) => (
                            <>
                                <h1>
                                    You unlocked the title{" "}
                                    {achievementName[a.ID]}{" "}
                                    {achievementTitle[a.Level]}
                                </h1>
                                <p>{achievementDescription[a.ID](a.Level)}</p>
                            </>
                        ))}
                    </div>
                </div>
            )
        }

        return (
            <>
                <div className="learn-header"></div>
                {body}
                <div className="footer">
                    <button onClick={() => this.props.continue()}>
                        <ArrowForwardIcon
                            fontSize="large"
                            style={{ marginTop: "4px" }}
                        />
                    </button>
                </div>
            </>
        )
    }
}
