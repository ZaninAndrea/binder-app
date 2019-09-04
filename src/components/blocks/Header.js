import React from "react"
import ExitToApp from "@material-ui/icons/ExitToApp"
import Menu from "@material-ui/icons/Menu"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"

export default class Header extends React.Component {
    render() {
        return (
            <div id="flipcardHeader">
                {this.props.backToPage ? (
                    <ArrowBackIcon
                        id="hamburger"
                        onClick={() => {
                            this.props.redirectTo(this.props.backToPage)
                            this.props.setBackToPage(null)
                        }}
                    />
                ) : (
                    <Menu id="hamburger" onClick={this.props.openSidebar} />
                )}

                <span id="flipcardTitle">Binder</span>
                <ExitToApp id="logoutButton" onClick={this.props.logout} />
            </div>
        )
    }
}
