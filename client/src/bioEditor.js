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
        if (e.target.value) {
            this.setState(
                {
                    [e.target.name]: e.target.value,
                },
                () => console.log("this.state in handleChange:", this.state)
            );
        }
    }

    toggleText() {
        this.setState({
            textareaVisible: !this.state.textareaVisible,
        });
    }

    bioAxios() {
        if (this.state.textareaVisible) {
            axios
                .post("/bio", this.state)
                .then((res) => this.props.setBio(res.data.bio))
                .catch((err) => console.log("error in toggletext", err));
        }
    }

    render() {
        return (
            <div>
                {this.state.textareaVisible && (
                    <textarea
                        className="bioButton"
                        name="draftBio"
                        onChange={(e) => this.handleChange(e)}
                        defaultValue={this.props.bio}
                    />
                )}

                {!this.props.bio && (
                    <button
                        className="bioButton"
                        onClick={() => this.toggleText()}
                    >
                        Add bio!
                    </button>
                )}
                {this.props.bio && (
                    <button
                        className="bioButton"
                        onClick={() => this.toggleText()}
                    >
                        Edit bio
                    </button>
                )}

                {this.state.textareaVisible && (
                    <button
                        className="bioButton"
                        onClick={() => this.bioAxios()}
                    >
                        Save
                    </button>
                )}
            </div>
        );
    }
}
