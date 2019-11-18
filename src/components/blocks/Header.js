import React from "react"
import ExitToApp from "@material-ui/icons/ExitToApp"
import Menu from "@material-ui/icons/Menu"
import { NavLink } from "react-router-dom"

export default class Header extends React.Component {
    render() {
        return (
            <div id="flipcardHeader">
                <Menu id="hamburger" onClick={this.props.openSidebar} />

                <NavLink to="/" id="flipcardTitle">
                    <img
                        src="/full_logo.png"
                        style={{ maxWidth: "100%", maxHeight: "100%" }}
                    />
                </NavLink>
                <ExitToApp id="logoutButton" onClick={this.props.logout} />
            </div>
        )
    }
}
