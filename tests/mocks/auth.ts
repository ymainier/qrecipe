import { vi } from "vitest";
import { mockUser } from "@/tests/mocks/db";

// Default mock session
export function createMockSession(userOverrides = {}) {
  const user = mockUser(userOverrides);
  return {
    user,
    session: {
      id: "session-123",
      userId: user.id,
      token: "mock-token",
      expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      ipAddress: null,
      userAgent: null,
    },
  };
}

// Mock auth object
export const mockAuth = {
  api: {
    getSession: vi.fn(),
    signOut: vi.fn().mockResolvedValue(undefined),
  },
};

// Helper to set up authenticated state
export function mockAuthenticated(userOverrides = {}) {
  const session = createMockSession(userOverrides);
  mockAuth.api.getSession.mockResolvedValue(session);
  return session;
}

// Helper to set up unauthenticated state
export function mockUnauthenticated() {
  mockAuth.api.getSession.mockResolvedValue(null);
}

// Reset auth mocks
export function resetAuthMocks() {
  mockAuth.api.getSession.mockReset();
  mockAuth.api.signOut.mockReset();
  mockAuth.api.signOut.mockResolvedValue(undefined);
}
