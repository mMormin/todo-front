/**
 * Tests for the task list display inside Main.tsx.
 * Covers loading, success, and error states by controlling
 * the Zustand store mock, and also demonstrates direct API mocking
 * via vi.spyOn on the api service module.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Main from "../components/Main";
import { useTaskStore } from "../store/useTaskStore";
import { useCategoryStore } from "../store/useCategoryStore";
import { Category, Task } from "../types";

vi.mock("../store/useTaskStore");
vi.mock("../store/useCategoryStore");

const mockCategory: Category = { id: "1", name: "Work", icon: "💼" };

const mockTasks: Task[] = [
  { id: 1, text: "Finish the report", categoryId: "1", completed: false },
  { id: 2, text: "Call the client", categoryId: "1", completed: true },
];

function setupCategoryStore() {
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
}

beforeEach(() => {
  vi.clearAllMocks();
  setupCategoryStore();
});

describe("TasksList — loading state", () => {
  it("renders the loading indicator when isLoading prop is true", () => {
    vi.mocked(useTaskStore).mockImplementation((selector) =>
      selector({
        tasks: [] as Task[],
        isLoading: true,
        error: null,
        addTask: vi.fn(),
        toggleComplete: vi.fn(),
        removeTaskById: vi.fn(),
        removeTasksByCategory: vi.fn(),
        getTasksByCategory: vi.fn().mockReturnValue([]),
        fetchTasks: vi.fn(),
        updateTask: vi.fn(),
        setTasks: vi.fn(),
      })
    );

    render(<Main isLoading={true} />);
    expect(screen.getByText(/Loading\.\.\./i)).toBeInTheDocument();
  });
});

describe("TasksList — success state", () => {
  it("renders the tasks returned by the store", () => {
    vi.mocked(useTaskStore).mockImplementation((selector) =>
      selector({
        tasks: mockTasks,
        isLoading: false,
        error: null,
        addTask: vi.fn(),
        toggleComplete: vi.fn(),
        removeTaskById: vi.fn(),
        removeTasksByCategory: vi.fn(),
        getTasksByCategory: vi.fn().mockReturnValue(mockTasks),
        fetchTasks: vi.fn(),
        updateTask: vi.fn(),
        setTasks: vi.fn(),
      })
    );

    render(<Main />);
    expect(screen.getByText("Finish the report")).toBeInTheDocument();
    expect(screen.getByText("Call the client")).toBeInTheDocument();
  });

  it("renders the empty state message when the store returns no tasks", () => {
    vi.mocked(useTaskStore).mockImplementation((selector) =>
      selector({
        tasks: [] as Task[],
        isLoading: false,
        error: null,
        addTask: vi.fn(),
        toggleComplete: vi.fn(),
        removeTaskById: vi.fn(),
        removeTasksByCategory: vi.fn(),
        getTasksByCategory: vi.fn().mockReturnValue([]),
        fetchTasks: vi.fn(),
        updateTask: vi.fn(),
        setTasks: vi.fn(),
      })
    );

    render(<Main />);
    expect(
      screen.getByText(/No tasks added for the moment/i)
    ).toBeInTheDocument();
  });
});

describe("TasksList — error state", () => {
  it("renders without crashing when the store exposes an error", async () => {
    // The store handles the error internally (error state).
    // Main.tsx does not render a global error message,
    // but the component must not crash when error is set.
    vi.mocked(useTaskStore).mockImplementation((selector) =>
      selector({
        tasks: [] as Task[],
        isLoading: false,
        error: "Unable to load tasks",
        addTask: vi.fn(),
        toggleComplete: vi.fn(),
        removeTaskById: vi.fn(),
        removeTasksByCategory: vi.fn(),
        getTasksByCategory: vi.fn().mockReturnValue([]),
        fetchTasks: vi.fn(),
        updateTask: vi.fn(),
        setTasks: vi.fn(),
      })
    );

    render(<Main />);
    await waitFor(() => {
      expect(
        screen.getByText(/No tasks added for the moment/i)
      ).toBeInTheDocument();
    });
  });
});

describe("tasksApi — direct API mock with vi.spyOn", () => {
  it("tasksApi.getAll can be mocked to return a list of tasks", async () => {
    const { tasksApi } = await import("../services/api");
    vi.spyOn(tasksApi, "getAll").mockResolvedValue(mockTasks);

    const result = await tasksApi.getAll();
    expect(result).toHaveLength(2);
    expect(result[0].text).toBe("Finish the report");
  });

  it("tasksApi.getAll can be mocked to simulate a network error", async () => {
    const { tasksApi } = await import("../services/api");
    vi.spyOn(tasksApi, "getAll").mockRejectedValue(new Error("Network Error"));

    await expect(tasksApi.getAll()).rejects.toThrow("Network Error");
  });
});
