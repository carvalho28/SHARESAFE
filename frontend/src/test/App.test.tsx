import { describe, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { RenderApp, App } from "../App";

describe("App", () => {
  it("renders", () => {
    render(RenderApp());
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Home");
  });

  it("renders not found if user navigates to a non-existing page", () => {
    render(
      <MemoryRouter initialEntries={["/non-existing-page"]}>
        {App()}
      </MemoryRouter>,
    );
    expect(screen.getByText("Not Found")).toBeInTheDocument();
  });
});
