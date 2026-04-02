/**
 * Tests for the task creation form embedded in Main.tsx.
 * Both Zustand stores are mocked to isolate the form behavior.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Main from "../components/Main";
import { useTaskStore } from "../store/useTaskStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { Category, Task } from "../types";

vi.mock("../store/useTaskStore");
vi.mock("../store/useCategoryStore");

const mockCategory: Category = { id: "1", name: "Work", icon: "💼" };

const addTaskMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();

  vi.mocked(useTaskStore).mockImplementation((selector) =>
    selector({
      tasks: [] as Task[],
      isLoading: false,
      error: null,
      addTask: addTaskMock,
      toggleComplete: vi.fn(),
      removeTaskById: vi.fn(),
      removeTasksByCategory: vi.fn(),
      getTasksByCategory: vi.fn().mockReturnValue([]),
      fetchTasks: vi.fn(),
      updateTask: vi.fn(),
      setTasks: vi.fn(),
    })
  );

  vi.mocked(useCategoryStore).mockImplementation((selector) =>
    selector({
      categories: [mockCategory],
      isLoading: false,
      error: null,
      addCategory: vi.fn(),
      deleteCategory: vi.fn(),
      getCategoryById: vi.fn().mockReturnValue(mockCategory),
      getDefaultCategory: vi.fn().mockReturnValue(mockCategory),
      fetchCategories: vi.fn(),
      updateCategory: vi.fn(),
      setCategories: vi.fn(),
    })
  );
});

describe("AddTaskForm (inside Main)", () => {
  it("renders the submit button", () => {
    render(<Main />);
    expect(screen.getByText("↵")).toBeInTheDocument();
  });

  it("task input is empty on initial render", () => {
    render(<Main />);
    const input = screen.getByPlaceholderText(/Write your new task here/i);
    expect(input).toHaveValue("");
  });

  it("shows a validation error when submitting with an empty input", async () => {
    render(<Main />);
    await userEvent.click(screen.getByText("↵"));
    expect(
      await screen.findByText(/You forgot to write your task/i)
    ).toBeInTheDocument();
  });

  it("shows a validation error when the task title is too short", async () => {
    render(<Main />);
    const input = screen.getByPlaceholderText(/Write your new task here/i);
    await userEvent.type(input, "A");
    await userEvent.click(screen.getByText("↵"));
    expect(
      await screen.findByText(/at least two characters/i)
    ).toBeInTheDocument();
  });

  it("calls addTask with the correct title and category id on valid submission", async () => {
    addTaskMock.mockResolvedValue(undefined);
    render(<Main />);

    const input = screen.getByPlaceholderText(/Write your new task here/i);
    await userEvent.type(input, "My new task");
    await userEvent.click(screen.getByText("↵"));

    expect(addTaskMock).toHaveBeenCalledWith("My new task", 1);
  });

  it("clears the input field after a successful submission", async () => {
    addTaskMock.mockResolvedValue(undefined);
    render(<Main />);

    const input = screen.getByPlaceholderText(/Write your new task here/i);
    await userEvent.type(input, "My new task");
    await userEvent.click(screen.getByText("↵"));

    expect(input).toHaveValue("");
  });
});
