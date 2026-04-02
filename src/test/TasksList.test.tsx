import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TasksList from "../components/elements/TasksList";
import { Task, Category } from "../types";

const mockCategory: Category = {
  id: "1",
  name: "Work",
  icon: "💼",
};

const getCategoryForTask = () => mockCategory;

const pendingTask: Task = {
  id: 1,
  text: "Write the report",
  categoryId: "1",
  completed: false,
};

const completedTask: Task = {
  id: 2,
  text: "Send the emails",
  categoryId: "1",
  completed: true,
};

describe("TasksList", () => {
  it("displays the task title and its category", () => {
    render(
      <TasksList
        tasks={[pendingTask]}
        toggleComplete={vi.fn()}
        getCategoryForTask={getCategoryForTask}
        onDeleteTask={vi.fn()}
      />
    );

    expect(screen.getByText("Write the report")).toBeInTheDocument();
    expect(screen.getByText("#Work")).toBeInTheDocument();
  });

  it("applies the line-through class on a completed task", () => {
    render(
      <TasksList
        tasks={[completedTask]}
        toggleComplete={vi.fn()}
        getCategoryForTask={getCategoryForTask}
        onDeleteTask={vi.fn()}
      />
    );

    const taskText = screen.getByText("Send the emails");
    expect(taskText).toHaveClass("line-through");
  });

  it("does not apply line-through on a pending task", () => {
    render(
      <TasksList
        tasks={[pendingTask]}
        toggleComplete={vi.fn()}
        getCategoryForTask={getCategoryForTask}
        onDeleteTask={vi.fn()}
      />
    );

    const taskText = screen.getByText("Write the report");
    expect(taskText).not.toHaveClass("line-through");
  });

  it("displays an empty state message when the task list is empty", () => {
    render(
      <TasksList
        tasks={[]}
        toggleComplete={vi.fn()}
        getCategoryForTask={getCategoryForTask}
        onDeleteTask={vi.fn()}
      />
    );

    expect(
      screen.getByText(/No tasks added for the moment/i)
    ).toBeInTheDocument();
  });

  it("calls toggleComplete with the task id when the checkbox is clicked", async () => {
    const toggleComplete = vi.fn();
    render(
      <TasksList
        tasks={[pendingTask]}
        toggleComplete={toggleComplete}
        getCategoryForTask={getCategoryForTask}
        onDeleteTask={vi.fn()}
      />
    );

    await userEvent.click(screen.getByRole("checkbox"));
    expect(toggleComplete).toHaveBeenCalledWith(1);
  });

  it("calls onDeleteTask with the task id when the delete button is clicked", async () => {
    const onDeleteTask = vi.fn();
    render(
      <TasksList
        tasks={[pendingTask]}
        toggleComplete={vi.fn()}
        getCategoryForTask={getCategoryForTask}
        onDeleteTask={onDeleteTask}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /x/i }));
    expect(onDeleteTask).toHaveBeenCalledWith(1);
  });
});
