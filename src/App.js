import React from "react"
import "./App.css"
import Card from "./Card"
import Footer from "./Footer"

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Card />
                <Footer />
            </div>
        )
    }
}

export default App
