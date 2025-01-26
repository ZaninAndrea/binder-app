import React from "react"
import { NavLink } from "react-router-dom"

export default class LoginPage extends React.Component {
    state = {
        email: "",
        password: "",
        error: "",
    }

    login = async () => {
        const res = await fetch(process.env.BACKEND_URL + `/users/login`, {
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),
            method: "POST",
        })

        if (res.status === 200) this.props.setBearer(await res.text())
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
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                this.login()
                            }
                        }}
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
                    <button onClick={this.login} id="loginButton">
                        Log In
                    </button>
                    <NavLink to="/signup">
                        <span id="gotoSignupText">Or sign up instead</span>
                    </NavLink>
                </div>
            </div>
        )
    }
}
