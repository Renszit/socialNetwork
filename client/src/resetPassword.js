//ResetPassword component
import { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends Component {
    constructor() {
        super();
        this.state = {
            view: 1,
        };
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state in handleChange:", this.state)
        );
    }

    handleClick() {
        if (this.state.view == 1) {
            axios
                .post("/password/reset/start", this.state)
                .then((res) => {
                    if (res.data.error) {
                        this.setState({ error: true });
                    } else {
                        this.setState({ view: 2, error: false });
                    }
                })
                .catch(() => {
                    this.setState({
                        error: true,
                    });
                });
        } else if (this.state.view == 2) {
            axios
                .post("/password/reset/verify", this.state)
                .then((res) => {
                    if (res.data.error) {
                        this.setState({ error: true });
                    } else {
                        this.setState({ view: 3, error: false });
                    }
                })
                .catch(() => {
                    this.setState({
                        error: true,
                    });
                });
        }
    }

    render() {
        if (this.state.view == 1) {
            return (
                <div className="registerContainer">
                    <h1 className="registrationTitle">reset password</h1>
                    {this.state.error && (
                        <p className="error">something went wrong! :O</p>
                    )}
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="email"
                        placeholder="email"
                        type="text"
                    />
                    <button onClick={() => this.handleClick()}>
                        send reset code
                    </button>
                </div>
            );
        } else if (this.state.view == 2) {
            return (
                <div className="registerContainer">
                    <h1 className="registrationTitle">
                        enter code and new password
                    </h1>
                    {this.state.error && (
                        <p className="error">something went wrong! :O</p>
                    )}

                    <input
                        className="hidden"
                        onChange={(e) => this.handleChange(e)}
                        name="email"
                        placeholder="email"
                        type="text"
                    />
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="code"
                        placeholder="code"
                        type="text"
                    />
                    <input
                        onChange={(e) => this.handleChange(e)}
                        name="password"
                        placeholder="password"
                        type="password"
                    />
                    <button onClick={() => this.handleClick()}>submit</button>
                </div>
            );
        } else if (this.state.view == 3) {
            return (
                <div className="registerContainer">
                    <h1 className="registrationTitle">Password changed!</h1>
                    <Link className="linkTags" to="/login">
                        Click here to log in
                    </Link>
                </div>
            );
        }
    }
}
