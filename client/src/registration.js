import { Component } from "react";
import axios from "axios";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: false,
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
        console.log("click", this.state);
        axios
            .post("/registration", this.state)
            .then(() => {
                location.replace("/");
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div>
                <h1>Registration</h1>
                {this.state.error && <p>something went wrong! :O</p>}
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
            </div>
        );
    }
}
