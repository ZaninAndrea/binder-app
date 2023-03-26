import React, { Component } from "react"
import { Mobile, Desktop } from "../utils/MobileDesktop"
import DeleteIcon from "@material-ui/icons/Delete"
import WarningIcon from "@material-ui/icons/Warning"

function displayPlan(plan) {
    switch (plan) {
        case "VIP":
            return "VIP Guest"
        case "BASIC":
            return "Basic"
        default:
            return "No Subscription"
    }
}

export default class SettingsPage extends Component {
    state = {
        deleteClicked: false,
    }
    render() {
        return (
            <div className="settings">
                <h2>Account</h2>
                <p id="settings-email">
                    Email: {this.props.userData && this.props.userData.email}
                </p>
                <p id="settings-email">
                    Subscription:{" "}
                    {this.props.userData &&
                        displayPlan(this.props.userData.plan)}
                </p>
                <p id="settings-email">
                    Timezone:{" "}
                    {this.props.userData && this.props.userData.timezone}
                </p>
                <p id="settings-email">
                    End of day:{" "}
                    {this.props.userData && this.props.userData.endOfDay}
                </p>
                <button class="full-width">Change password</button>
                <button onClick={this.props.logOut} class="full-width">
                    Log out
                </button>
                <button
                    class="full-width"
                    onClick={() => {
                        if (this.state.deleteClicked) {
                            this.props.deleteUser()
                        } else {
                            this.setState({ deleteClicked: true })
                        }
                    }}
                >
                    {this.state.deleteClicked ? (
                        <>Click again to confirm</>
                    ) : (
                        <>Delete account</>
                    )}
                </button>
            </div>
        )
    }
}
