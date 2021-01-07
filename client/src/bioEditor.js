import axios from "./axios";
import { Component } from "react";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textareaVisible: false,
            draftBio: "",
        };
        this.toggleText = this.toggleText.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            () => console.log("this.state in handleChange:", this.state)
        );
    }

    toggleText() {
        this.setState({
            textareaVisible: !this.state.textareaVisible,
        });
        if (this.state.textareaVisible) {
            axios
                .post("/bio", this.state)
                .then((res) => this.props.setBio(res.data.bio))
                .catch((err) => console.log("error in toggletext", err));
        }
    }

    //call a method within this component, making post request to server, updating value of the bio
    //once succesful, call method passed down from app component,
    // updating the value of bio in app

    render() {
        return (
            <div>
                {this.state.textareaVisible && (
                    <textarea
                        name="draftBio"
                        onChange={(e) => this.handleChange(e)}
                    />
                )}
                <button onClick={() => this.toggleText()}>update bio</button>
            </div>
        );
    }
}
