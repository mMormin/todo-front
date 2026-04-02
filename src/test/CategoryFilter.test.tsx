import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryFilter from "../components/elements/CategoryFilter";
import { Category } from "../types";

const categories: Category[] = [
  { id: "1", name: "Work", icon: "💼" },
  { id: "2", name: "Personal", icon: "🏠" },
];

describe("CategoryFilter", () => {
  it("renders the label and the select element", () => {
    render(
      <CategoryFilter
        categories={categories}
        filterCategoryId={null}
        setFilterCategoryId={vi.fn()}
      />
    );

    expect(screen.getByText(/Filter Tasks by Category/i)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders an option for each category plus the default 'All Categories' option", () => {
    render(
      <CategoryFilter
        categories={categories}
        filterCategoryId={null}
        setFilterCategoryId={vi.fn()}
      />
    );

    const options = screen.getAllByRole("option");
    // 2 categories + 1 "All Categories"
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("All Categories");
  });

  it("shows 'All Categories' as selected when filterCategoryId is null", () => {
    render(
      <CategoryFilter
        categories={categories}
        filterCategoryId={null}
        setFilterCategoryId={vi.fn()}
      />
    );

    expect(screen.getByRole("combobox")).toHaveValue("");
  });

  it("reflects the active filter when filterCategoryId is set", () => {
    render(
      <CategoryFilter
        categories={categories}
        filterCategoryId="2"
        setFilterCategoryId={vi.fn()}
      />
    );

    expect(screen.getByRole("combobox")).toHaveValue("2");
  });

  it("calls setFilterCategoryId with the selected category id on change", async () => {
    const setFilterCategoryId = vi.fn();
    render(
      <CategoryFilter
        categories={categories}
        filterCategoryId={null}
        setFilterCategoryId={setFilterCategoryId}
      />
    );

    await userEvent.selectOptions(screen.getByRole("combobox"), "1");
    expect(setFilterCategoryId).toHaveBeenCalledWith("1");
  });

  it("calls setFilterCategoryId with null when 'All Categories' is selected", async () => {
    const setFilterCategoryId = vi.fn();
    render(
      <CategoryFilter
        categories={categories}
        filterCategoryId="1"
        setFilterCategoryId={setFilterCategoryId}
      />
    );

    await userEvent.selectOptions(screen.getByRole("combobox"), "");
    expect(setFilterCategoryId).toHaveBeenCalledWith(null);
  });
});
