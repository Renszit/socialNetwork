import { Component } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {};
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
        console.log("click", this.state);
        axios
            .post("/registration", this.state)
            .then((res) => {
                console.log("response:", res);
                if (res.data.error) {
                    this.setState({ error: true });
                } else {
                    location.replace("/");
                }
            })
            .catch((err) => {
                console.log("handleclick error:", err);
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div className="registerContainer">
                <h1 className="registrationTitle">Registration</h1>
                {this.state.error && (
                    <p className="error">something went wrong! :O</p>
                )}
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="first"
                    placeholder="first name"
                    type="text"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="last"
                    placeholder="last name"
                    type="text"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    placeholder="email"
                    type="text"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    placeholder="password"
                    type="password"
                />
                <button onClick={() => this.handleClick()}>submit</button>
                <Link className="linkTags" to="/login">
                    Click here to log in
                </Link>
                <Link className="linkTags" to="/resetpassword">
                    Forgot password?
                </Link>
            </div>
        );
    }
}
