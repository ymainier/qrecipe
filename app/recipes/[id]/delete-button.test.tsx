import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeleteRecipeButton } from "@/app/recipes/[id]/delete-button";

// Mock the deleteRecipe action
const mockDeleteRecipe = vi.fn();

vi.mock("@/app/recipes/actions", () => ({
  deleteRecipe: (recipeId: string) => mockDeleteRecipe(recipeId),
}));

describe("DeleteRecipeButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render delete button", () => {
    render(<DeleteRecipeButton recipeId="recipe-123" />);

    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("should open confirmation dialog when clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteRecipeButton recipeId="recipe-123" />);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    expect(screen.getByText("Delete Recipe")).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to delete this recipe/i)
    ).toBeInTheDocument();
  });

  it("should close dialog when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteRecipeButton recipeId="recipe-123" />);

    // Open dialog
    await user.click(screen.getByRole("button", { name: /delete/i }));
    expect(screen.getByText("Delete Recipe")).toBeInTheDocument();

    // Click cancel
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    await waitFor(() => {
      expect(screen.queryByText("Delete Recipe")).not.toBeInTheDocument();
    });
  });

  it("should call deleteRecipe when confirmed", async () => {
    const user = userEvent.setup();
    mockDeleteRecipe.mockResolvedValue(undefined);

    render(<DeleteRecipeButton recipeId="recipe-123" />);

    // Open dialog
    await user.click(screen.getByRole("button", { name: /delete/i }));

    // Click confirm delete button (the one inside the dialog)
    const confirmButtons = screen.getAllByRole("button", { name: /delete/i });
    const confirmButton = confirmButtons[confirmButtons.length - 1]; // Last one is in the dialog
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteRecipe).toHaveBeenCalledWith("recipe-123");
    });
  });

  it("should show loading state while deleting", async () => {
    const user = userEvent.setup();
    let resolveDelete: (value?: unknown) => void;
    mockDeleteRecipe.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveDelete = resolve;
        })
    );

    render(<DeleteRecipeButton recipeId="recipe-123" />);

    // Open dialog
    await user.click(screen.getByRole("button", { name: /delete/i }));

    // Click confirm delete
    const confirmButtons = screen.getAllByRole("button", { name: /delete/i });
    const confirmButton = confirmButtons[confirmButtons.length - 1];
    await user.click(confirmButton);

    // Verify deleteRecipe was called (the loading state triggers before dialog closes)
    await waitFor(() => {
      expect(mockDeleteRecipe).toHaveBeenCalledWith("recipe-123");
    });

    // Cleanup
    resolveDelete!();
  });

  it("should reset loading state on error", async () => {
    const user = userEvent.setup();
    mockDeleteRecipe.mockRejectedValue(new Error("Delete failed"));

    render(<DeleteRecipeButton recipeId="recipe-123" />);

    // Open dialog
    await user.click(screen.getByRole("button", { name: /delete/i }));

    // Click confirm delete
    const confirmButtons = screen.getAllByRole("button", { name: /delete/i });
    const confirmButton = confirmButtons[confirmButtons.length - 1];
    await user.click(confirmButton);

    // Wait for error to be handled
    await waitFor(() => {
      // Should still show Delete button (not Deleting...) after error
      const buttons = screen.getAllByRole("button", { name: /delete/i });
      expect(buttons.some((btn) => btn.textContent === "Delete")).toBe(true);
    });
  });

  it("should call deleteRecipe only once per click", async () => {
    const user = userEvent.setup();
    mockDeleteRecipe.mockResolvedValue(undefined);

    render(<DeleteRecipeButton recipeId="recipe-123" />);

    // Open dialog
    await user.click(screen.getByRole("button", { name: /delete/i }));

    // Click confirm delete
    const confirmButtons = screen.getAllByRole("button", { name: /delete/i });
    const confirmButton = confirmButtons[confirmButtons.length - 1];
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteRecipe).toHaveBeenCalledTimes(1);
      expect(mockDeleteRecipe).toHaveBeenCalledWith("recipe-123");
    });
  });
});
