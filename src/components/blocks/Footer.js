import React from "react"
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied"
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfiedAlt"
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied"

export default class Card extends React.Component {
    render() {
        const { onGrade, isNew, onOk } = this.props
        return (
            <div className="footer">
                {isNew ? (
                    <button onClick={onOk}>
                        <SentimentVerySatisfiedIcon
                            fontSize="large"
                            style={{ marginTop: "4px" }}
                        />
                    </button>
                ) : (
                    <>
                        <button onClick={() => onGrade(0)}>
                            <SentimentVeryDissatisfiedIcon
                                fontSize="large"
                                style={{ marginTop: "4px" }}
                            />
                        </button>
                        <button onClick={() => onGrade(2)}>
                            <SentimentSatisfiedIcon
                                fontSize="large"
                                style={{ marginTop: "4px" }}
                            />
                        </button>
                        <button onClick={() => onGrade(4)}>
                            <SentimentVerySatisfiedIcon
                                fontSize="large"
                                style={{ marginTop: "4px" }}
                            />
                        </button>
                    </>
                )}
            </div>
        )
    }
}
