import "@testing-library/jest-dom/vitest";
import { vi, beforeEach } from "vitest";

// Mock Next.js navigation
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => "/"),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// Mock Next.js headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => new Headers()),
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  })),
}));

// Mock Next.js cache
vi.mock("next/cache", () => ({
  unstable_cache: vi.fn((fn) => fn),
  revalidateTag: vi.fn(),
  updateTag: vi.fn(),
}));

// Mock crypto.randomUUID for consistent test IDs
let uuidCounter = 0;
vi.stubGlobal("crypto", {
  ...crypto,
  randomUUID: vi.fn(() => `mock-uuid-${++uuidCounter}`),
});

// Reset uuid counter before each test
beforeEach(() => {
  uuidCounter = 0;
});
