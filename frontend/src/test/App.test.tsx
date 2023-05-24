import { describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RenderApp, App } from "../App";

describe("App", () => {
  it("renders", () => {
    render(RenderApp());
    // expect a loginBtn to be present
    expect(screen.getByText("WELCOME BACK TO SHARESAFE")).toBeInTheDocument();
  });

  it("renders not found if user navigates to a non-existing page", () => {
    render(
      <MemoryRouter initialEntries={["/non-existing-page"]}>
        {App()}
      </MemoryRouter>,
    );
    expect(
      screen.getByText(
        "Looks like you've found the doorway to the great nothing",
      ),
    ).toBeInTheDocument();
  });
});
