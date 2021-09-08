import React, { Component } from "react"
import { Mobile, Desktop } from "../utils/MobileDesktop"

export default class HomePage extends Component {
    render() {
        return (
            <div className="settings">
                <h2>Account</h2>
                <p id="settings-email">Email: 99.zanin@gmail.com</p>
                <p id="settings-email">Subscription: VIP Guest</p>
                <button class="full-width">Change password</button>
                <button onClick={this.props.logOut} class="full-width">
                    Log out
                </button>
                <button class="full-width">Delete account</button>
            </div>
        )
    }
}
