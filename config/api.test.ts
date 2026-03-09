import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getQuizApiUrl, isQuizApiConfigured, QUIZ_API_URL_ERROR_MESSAGE } from "./api";

describe("api", () => {
  beforeEach(() => {
    vi.stubEnv("EXPO_PUBLIC_QUIZ_API_URL", undefined);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe("isQuizApiConfigured", () => {
    it("returns false when EXPO_PUBLIC_QUIZ_API_URL is not set", () => {
      expect(isQuizApiConfigured()).toBe(false);
    });

    it("returns false when EXPO_PUBLIC_QUIZ_API_URL is empty string", () => {
      vi.stubEnv("EXPO_PUBLIC_QUIZ_API_URL", "");
      expect(isQuizApiConfigured()).toBe(false);
    });

    it("returns true when EXPO_PUBLIC_QUIZ_API_URL is set", () => {
      vi.stubEnv("EXPO_PUBLIC_QUIZ_API_URL", "https://api.example.com/quiz");
      expect(isQuizApiConfigured()).toBe(true);
    });
  });

  describe("getQuizApiUrl", () => {
    it("throws when EXPO_PUBLIC_QUIZ_API_URL is not set", () => {
      expect(() => getQuizApiUrl()).toThrow(QUIZ_API_URL_ERROR_MESSAGE);
    });

    it("throws when EXPO_PUBLIC_QUIZ_API_URL is empty string", () => {
      vi.stubEnv("EXPO_PUBLIC_QUIZ_API_URL", "");
      expect(() => getQuizApiUrl()).toThrow(QUIZ_API_URL_ERROR_MESSAGE);
    });

    it("returns the URL when configured", () => {
      const url = "https://api.example.com/quiz";
      vi.stubEnv("EXPO_PUBLIC_QUIZ_API_URL", url);
      expect(getQuizApiUrl()).toBe(url);
    });
  });
});
