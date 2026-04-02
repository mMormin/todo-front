import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoriesList from "../components/elements/CategoriesList";
import { Category } from "../types";

const categories: Category[] = [
  { id: "1", name: "Work", icon: "💼" },
  { id: "2", name: "Personal", icon: "🏠" },
];

describe("CategoriesList", () => {
  it("renders all category names and icons", () => {
    render(<CategoriesList categories={categories} />);

    expect(screen.getByText("#Work")).toBeInTheDocument();
    expect(screen.getByText("#Personal")).toBeInTheDocument();
    expect(screen.getByText("💼")).toBeInTheDocument();
    expect(screen.getByText("🏠")).toBeInTheDocument();
  });

  it("renders nothing when the categories list is empty", () => {
    const { container } = render(<CategoriesList categories={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a delete button for each category when onDeleteCategory is provided", () => {
    render(
      <CategoriesList categories={categories} onDeleteCategory={vi.fn()} />
    );

    // Each category pill has a × delete button
    const deleteButtons = screen.getAllByRole("button", { name: "×" });
    expect(deleteButtons).toHaveLength(2);
  });

  it("does not render delete buttons when onDeleteCategory is not provided", () => {
    render(<CategoriesList categories={categories} />);
    expect(screen.queryByRole("button", { name: "×" })).not.toBeInTheDocument();
  });

  it("calls onDeleteCategory with the correct id when the delete button is clicked", async () => {
    const onDeleteCategory = vi.fn();
    render(
      <CategoriesList
        categories={categories}
        onDeleteCategory={onDeleteCategory}
      />
    );

    const deleteButtons = screen.getAllByRole("button", { name: "×" });
    await userEvent.click(deleteButtons[0]);
    expect(onDeleteCategory).toHaveBeenCalledWith("1");
  });

  it("renders a SELECT button for each category when onSelectCategory is provided", () => {
    render(
      <CategoriesList categories={categories} onSelectCategory={vi.fn()} />
    );

    const selectButtons = screen.getAllByRole("button", { name: /SELECT/i });
    expect(selectButtons).toHaveLength(2);
  });

  it("does not render SELECT buttons when onSelectCategory is not provided", () => {
    render(<CategoriesList categories={categories} />);
    expect(
      screen.queryByRole("button", { name: /SELECT/i })
    ).not.toBeInTheDocument();
  });

  it("calls onSelectCategory with the correct id when the SELECT button is clicked", async () => {
    const onSelectCategory = vi.fn();
    render(
      <CategoriesList
        categories={categories}
        onSelectCategory={onSelectCategory}
      />
    );

    const selectButtons = screen.getAllByRole("button", { name: /SELECT/i });
    await userEvent.click(selectButtons[1]);
    expect(onSelectCategory).toHaveBeenCalledWith("2");
  });
});
