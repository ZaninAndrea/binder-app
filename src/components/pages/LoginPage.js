import React from "react"

export default class LoginPage extends React.Component {
    state = {
        email: "",
        password: "",
    }

    login = async () => {
        const res = await fetch(
            "https://flipcards-server.herokuapp.com/login",
            {
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password,
                }),
                headers: {
                    "content-type": "application/json",
                },
                method: "POST",
            }
        ).then(res => res.text())

        this.props.setBearer(res)
    }

    render() {
        return (
            <div id="loginForm">
                Login
                <input
                    value={this.state.email}
                    onChange={e => this.setState({ email: e.target.value })}
                />
                <input
                    value={this.state.password}
                    onChange={e => this.setState({ password: e.target.value })}
                />
                <button onClick={this.login}>Log In</button>
            </div>
        )
    }
}
