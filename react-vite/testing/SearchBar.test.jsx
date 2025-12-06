import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { act } from "react";
import { MemoryRouter } from "react-router-dom";
import SearchBar from "../src/components/SearchBar/SearchBar";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SearchBar", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it("renders placeholder and updates input", async () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/stock = aapl crypto = x:dogeusd/i);
    await act(async () => userEvent.type(input, "AAPL"));
    expect(input).toHaveValue("AAPL");
  });

  it("navigates to stock path on submit", async () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/stock = aapl crypto = x:dogeusd/i);
    await act(async () => userEvent.type(input, "TSLA"));

    const form = input.closest("form");
    await act(async () => {
      fireEvent.submit(form);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/stocks/TSLA");
  });
});
