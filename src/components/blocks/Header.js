import React from "react"
import ExitToApp from "@material-ui/icons/ExitToApp"
import Menu from "@material-ui/icons/Menu"

export default class Header extends React.Component {
    render() {
        return (
            <div id="flipcardHeader">
                <Menu id="hamburger" onClick={this.props.openSidebar} />
                <span id="flipcardTitle">Flipcards</span>
                <ExitToApp id="logoutButton" onClick={this.props.logout} />
            </div>
        )
    }
}
