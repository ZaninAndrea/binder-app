import React from "react"

export default class Card extends React.Component {
    render() {
        const { onGrade, isNew, onOk } = this.props
        return (
            <div className="footer">
                {isNew ? (
                    <button onClick={onOk}>✓</button>
                ) : (
                    <>
                        <button onClick={() => onGrade(0)}>X</button>
                        {/* <button onClick={() => onGrade(1)}>1</button> */}
                        <button onClick={() => onGrade(2)}>~</button>
                        {/* <button onClick={() => onGrade(3)}>3</button> */}
                        {/* <button onClick={() => onGrade(4)}>4</button> */}
                        <button onClick={() => onGrade(5)}>✓</button>
                    </>
                )}
            </div>
        )
    }
}
