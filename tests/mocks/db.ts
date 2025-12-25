import { vi } from "vitest";

// Types for mock data
type MockUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type MockRecipe = {
  id: string;
  title: string;
  description: string | null;
  servings: number | null;
  prepTime: number | null;
  cookTime: number | null;
  imageUrl: string | null;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  ingredients: MockIngredient[];
  steps: MockStep[];
  recipeTags: MockRecipeTag[];
};

type MockIngredient = {
  id: string;
  name: string;
  quantity: string | null;
  unit: string | null;
  recipeId: string;
};

type MockStep = {
  id: string;
  order: number;
  instruction: string;
  recipeId: string;
};

type MockTag = {
  id: string;
  name: string;
};

type MockRecipeTag = {
  recipeId: string;
  tagId: string;
  tag: MockTag;
};

// Factory functions for mock data
export function mockUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    id: "user-123",
    name: "Test User",
    email: "test@example.com",
    emailVerified: true,
    image: null,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    ...overrides,
  };
}

export function mockRecipe(overrides: Partial<MockRecipe> = {}): MockRecipe {
  return {
    id: "recipe-123",
    title: "Test Recipe",
    description: "A test description",
    servings: 4,
    prepTime: 15,
    cookTime: 30,
    imageUrl: null,
    authorId: "user-123",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    deletedAt: null,
    ingredients: [],
    steps: [],
    recipeTags: [],
    ...overrides,
  };
}

export function mockIngredient(overrides: Partial<MockIngredient> = {}): MockIngredient {
  return {
    id: "ingredient-123",
    name: "Flour",
    quantity: "2",
    unit: "cups",
    recipeId: "recipe-123",
    ...overrides,
  };
}

export function mockStep(overrides: Partial<MockStep> = {}): MockStep {
  return {
    id: "step-123",
    order: 1,
    instruction: "Mix ingredients",
    recipeId: "recipe-123",
    ...overrides,
  };
}

export function mockTag(overrides: Partial<MockTag> = {}): MockTag {
  return {
    id: "tag-123",
    name: "vegetarian",
    ...overrides,
  };
}

export function mockRecipeTag(overrides: Partial<MockRecipeTag> = {}): MockRecipeTag {
  return {
    recipeId: "recipe-123",
    tagId: "tag-123",
    tag: mockTag(),
    ...overrides,
  };
}

// Create mock transaction
export function createMockTransaction() {
  return {
    insert: vi.fn(() => ({
      values: vi.fn().mockResolvedValue([{ id: "mock-id" }]),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn().mockResolvedValue([]),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn().mockResolvedValue([]),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn().mockResolvedValue([]),
        })),
      })),
    })),
  };
}

// Mock db object
export const mockDb = {
  query: {
    recipes: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
    users: {
      findFirst: vi.fn(),
    },
    ingredients: {
      findMany: vi.fn(),
    },
    steps: {
      findMany: vi.fn(),
    },
    tags: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
    },
  },
  insert: vi.fn(() => ({
    values: vi.fn().mockResolvedValue([{ id: "mock-id" }]),
  })),
  update: vi.fn(() => ({
    set: vi.fn(() => ({
      where: vi.fn().mockResolvedValue([]),
    })),
  })),
  delete: vi.fn(() => ({
    where: vi.fn().mockResolvedValue([]),
  })),
  select: vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({
        limit: vi.fn().mockResolvedValue([]),
      })),
    })),
  })),
  transaction: vi.fn((callback: (tx: ReturnType<typeof createMockTransaction>) => Promise<void>) =>
    callback(createMockTransaction())
  ),
};

// Helper to reset all db mocks
export function resetDbMocks() {
  vi.clearAllMocks();
}

// Helper to mock a successful recipe lookup
export function mockRecipeExists(recipe = mockRecipe()) {
  mockDb.select.mockReturnValue({
    from: vi.fn(() => ({
      where: vi.fn(() => ({
        limit: vi.fn().mockResolvedValue([recipe]),
      })),
    })),
  });
}

// Helper to mock recipe not found
export function mockRecipeNotFound() {
  mockDb.select.mockReturnValue({
    from: vi.fn(() => ({
      where: vi.fn(() => ({
        limit: vi.fn().mockResolvedValue([]),
      })),
    })),
  });
}
