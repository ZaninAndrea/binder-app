import React from "react"
import { NavLink } from "react-router-dom"

export default class LoginPage extends React.Component {
    state = {
        email: "",
        password: "",
        error: "",
    }

    login = async () => {
        const res = await fetch(
            `https://binderv2.caprover.baida.dev/login?email=${encodeURIComponent(
                this.state.email
            )}&password=${encodeURIComponent(this.state.password)}`,
            {
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
