// function component
// import React from "react";
import Registration from "./registration";

export default function Welcome() {
    return (
        <div>
            <div className="largeLogoContainer">
                <img
                    className="logoLarge"
                    src="Surrealism_logo_large.svg"
                ></img>
                <p>community for the unconcious mind</p>
            </div>
            <Registration />
        </div>
    );
}
