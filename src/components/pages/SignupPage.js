import React from "react"
import { NavLink } from "react-router-dom"

export default class SignupPage extends React.Component {
    state = {
        email: "",
        password: "",
        error: "",
    }

    signup = async () => {
        const res = await fetch(
            `https://binderbackend.baida.dev:8080/user?email=${encodeURIComponent(
                this.state.email
            )}&password=${encodeURIComponent(this.state.password)}`,
            {
                body: JSON.stringify({ decks: [] }),
                headers: {
                    "content-type": "application/json",
                },
                method: "POST",
            }
        )

        if (res.status === 200) this.props.setBearer((await res.json()).token)
        else this.setState({ error: await res.text() })
    }

    render() {
        return (
            <div id="loginForm">
                <div id="mainLoginBody">
                    <img src="/full_logo.png" id="loginLogo" />
                    <br />
                    <br />
                    <span id="loginEmailText">Email</span>
                    <br />
                    <input
                        value={this.state.email}
                        id="loginEmail"
                        type="email"
                        onChange={(e) =>
                            this.setState({ email: e.target.value })
                        }
                    />
                    <br />
                    <br />
                    <span id="loginPasswordText">Password</span>
                    <br />
                    <input
                        id="loginPassword"
                        value={this.state.password}
                        type="password"
                        onChange={(e) =>
                            this.setState({ password: e.target.value })
                        }
                    />
                    <br />
                    {this.state.error ? (
                        <p className="login-error">{this.state.error}</p>
                    ) : (
                        ""
                    )}
                    <button onClick={this.signup} id="loginButton">
                        Sign Up
                    </button>

                    <NavLink to="/login">
                        <span id="gotoSignupText">Or log in instead</span>
                    </NavLink>
                </div>
            </div>
        )
    }
}
