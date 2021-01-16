import { render } from "@testing-library/react";
import BioEditor from "./bioEditor.js";
// import axios from "./axios";

// jest.mock("axios");

test("when there is no bio, add bio button is shown", () => {
    const { container } = render(<BioEditor textareaVisible="false" />);
    expect(container.querySelector("button").innerHTML).toContain("Add bio!");
});

test("when there is a bio, edit bio button is shown", () => {
    const { container } = render(<BioEditor textareaVisible="false" bio="true" />);
    expect(container.querySelector("button").innerHTML).toContain("Edit bio");
});

// test("Clicking add or edit causes text area and a save button to be rendered", () => {
//     const { container } = render(
//         <BioEditor textareaVisible="true" />
//     );
//     expect(container.querySelector("textarea").innerHTML).toBe(true);
// });

// test("clicking save button fires an ajax", () => {});
