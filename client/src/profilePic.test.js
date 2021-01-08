// import React from "react";
import ProfilePic from "./profilePic";
import { render } from "@testing-library/react";



test("no url = default.jpeg", () => {
    //'container' is the same as 'document" from week 2
    // it is our entry poit into the DOM
    const { container } = render(<ProfilePic url="test" />);

    // console.log(
    //     'container.querySelector("img")',
    //     container.querySelector("img")
    // );
    expect(container.querySelector("img").src.endsWith("test")).toBe(true);
});

test("on click runs when img is clicked", () => {
    expect().toBe(2);
});
