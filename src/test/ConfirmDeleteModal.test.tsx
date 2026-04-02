import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmDeleteModal from "../components/elements/ConfirmDeleteModal";

describe("ConfirmDeleteModal", () => {
  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <ConfirmDeleteModal
        isOpen={false}
        categoryName="Work"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the modal when isOpen is true", () => {
    render(
      <ConfirmDeleteModal
        isOpen={true}
        categoryName="Work"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(
      screen.getByText(/Category associated with a task/i)
    ).toBeInTheDocument();
  });

  it("displays the category name in the warning message", () => {
    render(
      <ConfirmDeleteModal
        isOpen={true}
        categoryName="💼 Work"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText("💼 Work")).toBeInTheDocument();
  });

  it("warns that all associated tasks will also be deleted", () => {
    render(
      <ConfirmDeleteModal
        isOpen={true}
        categoryName="Work"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );

    expect(screen.getByText(/all associated tasks/i)).toBeInTheDocument();
  });

  it("calls onConfirm when the Delete button is clicked", async () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDeleteModal
        isOpen={true}
        categoryName="Work"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /Delete/i }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onCancel when the Abort button is clicked", async () => {
    const onCancel = vi.fn();
    render(
      <ConfirmDeleteModal
        isOpen={true}
        categoryName="Work"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /Abort/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("does not call onConfirm when Abort is clicked", async () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDeleteModal
        isOpen={true}
        categoryName="Work"
        onConfirm={onConfirm}
        onCancel={vi.fn()}
      />
    );

    await userEvent.click(screen.getByRole("button", { name: /Abort/i }));
    expect(onConfirm).not.toHaveBeenCalled();
  });
});
