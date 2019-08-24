import React from "react"
import "../stylesheets/App.css"
import Sidebar from "./Sidebar"
import Main from "./Main"

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <Sidebar />
                <Main />
            </div>
        )
    }
}

export default App
