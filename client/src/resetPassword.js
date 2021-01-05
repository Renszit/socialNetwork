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
        // console.log("click", this.state);
        if (this.state.view == 1) {
            axios
                .post("/password/reset/start", this.state)
                .then((res) => {
                    console.log("response:", res);
                    if (res.data.error) {
                        this.setState({ error: true });
                    } else {
                        this.setState({ view: 2 });
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
                    // console.log("response:", res);
                    if (res.data.error) {
                        this.setState({ error: true });
                    } else {
                        this.setState({ view: 3 });
                    }
                })
                .catch(() => {
                    // console.log("handleclick error:", err);
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
                    {this.state.error && (
                        <p className="error">something went wrong! :O</p>
                    )}
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
                <div>
                    <h1>Password changed!</h1>
                    <Link to="/login">Click here to log in</Link>
                </div>
            );
        }
    }
}
