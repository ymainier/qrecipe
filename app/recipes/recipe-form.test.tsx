import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecipeForm } from "@/app/recipes/recipe-form";

// Mock useRouter
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

describe("RecipeForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSubmit.mockReset();
  });

  it("should render form with default empty values", () => {
    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel="Create Recipe" />);

    expect(screen.getByLabelText(/title/i)).toHaveValue("");
    expect(screen.getByLabelText(/servings/i)).toHaveValue(null);
    expect(screen.getByLabelText(/prep time/i)).toHaveValue(null);
    expect(screen.getByLabelText(/cook time/i)).toHaveValue(null);
    expect(screen.getByRole("button", { name: "Create Recipe" })).toBeInTheDocument();
  });

  it("should render form with initial data", () => {
    const initialData = {
      title: "Test Recipe",
      description: "Test description",
      servings: "4",
      prepTime: "15",
      cookTime: "30",
      imageUrl: "",
      ingredients: [{ name: "Flour", quantity: "2", unit: "cups" }],
      steps: [{ instruction: "Mix well" }],
      tags: ["vegetarian", "quick"],
    };

    render(
      <RecipeForm
        initialData={initialData}
        onSubmit={mockOnSubmit}
        submitLabel="Update Recipe"
      />
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue("Test Recipe");
    expect(screen.getByLabelText(/servings/i)).toHaveValue(4);
    expect(screen.getByRole("button", { name: "Update Recipe" })).toBeInTheDocument();
  });

  it("should add ingredient when clicking add button", async () => {
    const user = userEvent.setup();
    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel="Create" />);

    // Initially should have 1 ingredient row
    const initialInputs = screen.getAllByPlaceholderText("Ingredient name");
    expect(initialInputs).toHaveLength(1);

    // Click add ingredient button
    const addButton = screen.getByRole("button", { name: "+ Add Ingredient" });
    await user.click(addButton);

    // Should now have 2 ingredient rows
    const afterAddInputs = screen.getAllByPlaceholderText("Ingredient name");
    expect(afterAddInputs).toHaveLength(2);
  });

  it("should remove ingredient when clicking remove button", async () => {
    const user = userEvent.setup();
    const initialData = {
      title: "",
      description: "",
      servings: "",
      prepTime: "",
      cookTime: "",
      imageUrl: "",
      ingredients: [
        { name: "Flour", quantity: "2", unit: "cups" },
        { name: "Sugar", quantity: "1", unit: "cup" },
      ],
      steps: [{ instruction: "" }],
      tags: [],
    };

    render(
      <RecipeForm
        initialData={initialData}
        onSubmit={mockOnSubmit}
        submitLabel="Create"
      />
    );

    // Should have 2 ingredient rows initially
    expect(screen.getAllByPlaceholderText("Ingredient name")).toHaveLength(2);

    // Click first remove button
    const removeButtons = screen.getAllByRole("button", { name: "×" });
    await user.click(removeButtons[0]);

    // Should now have 1 ingredient row
    expect(screen.getAllByPlaceholderText("Ingredient name")).toHaveLength(1);
  });

  it("should add step when clicking add button", async () => {
    const user = userEvent.setup();
    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel="Create" />);

    // Initially should have 1 step row
    const initialInputs = screen.getAllByPlaceholderText("Step instruction");
    expect(initialInputs).toHaveLength(1);

    // Click add step button
    const addButton = screen.getByRole("button", { name: "+ Add Step" });
    await user.click(addButton);

    // Should now have 2 step rows
    const afterAddInputs = screen.getAllByPlaceholderText("Step instruction");
    expect(afterAddInputs).toHaveLength(2);
  });

  it("should call onSubmit with formatted data", async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel="Create Recipe" />);

    // Fill in the form
    await user.type(screen.getByLabelText(/title/i), "My Recipe");
    await user.type(screen.getByLabelText(/servings/i), "4");

    // Fill in ingredient
    const ingredientInput = screen.getByPlaceholderText("Ingredient name");
    await user.type(ingredientInput, "Flour");

    // Submit the form
    const submitButton = screen.getByRole("button", { name: "Create Recipe" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "My Recipe",
          servings: 4,
          ingredients: expect.arrayContaining([
            expect.objectContaining({ name: "Flour" }),
          ]),
        })
      );
    });
  });

  it("should show error message on submit failure", async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockRejectedValue(new Error("Submit failed"));

    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel="Create Recipe" />);

    await user.type(screen.getByLabelText(/title/i), "My Recipe");

    const submitButton = screen.getByRole("button", { name: "Create Recipe" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Submit failed")).toBeInTheDocument();
    });
  });

  it("should call router.back when clicking cancel", async () => {
    const user = userEvent.setup();
    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel="Create" />);

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelButton);

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it("should disable submit button while submitting", async () => {
    const user = userEvent.setup();
    let resolveSubmit: (value?: unknown) => void;
    mockOnSubmit.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        })
    );

    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel="Create Recipe" />);

    await user.type(screen.getByLabelText(/title/i), "My Recipe");

    const submitButton = screen.getByRole("button", { name: "Create Recipe" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();
    });

    // Cleanup
    resolveSubmit!();
  });

  it("should parse tags from comma-separated input", async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel="Create" />);

    await user.type(screen.getByLabelText(/title/i), "My Recipe");
    await user.type(
      screen.getByLabelText(/tags/i),
      "vegetarian, quick, dinner"
    );

    const submitButton = screen.getByRole("button", { name: "Create" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: ["vegetarian", "quick", "dinner"],
        })
      );
    });
  });

  it("should filter out empty ingredients and steps", async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel="Create" />);

    await user.type(screen.getByLabelText(/title/i), "My Recipe");
    // Leave ingredient and step empty (default empty values)

    const submitButton = screen.getByRole("button", { name: "Create" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          ingredients: [],
          steps: [],
        })
      );
    });
  });

  it("should update ingredient fields correctly", async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(<RecipeForm onSubmit={mockOnSubmit} submitLabel="Create" />);

    await user.type(screen.getByLabelText(/title/i), "My Recipe");

    // Fill all ingredient fields
    await user.type(screen.getByPlaceholderText("Qty"), "2");
    await user.type(screen.getByPlaceholderText("Unit"), "cups");
    await user.type(screen.getByPlaceholderText("Ingredient name"), "Flour");

    const submitButton = screen.getByRole("button", { name: "Create" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          ingredients: [{ name: "Flour", quantity: "2", unit: "cups" }],
        })
      );
    });
  });
});
