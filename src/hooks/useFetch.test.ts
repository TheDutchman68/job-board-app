import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import useFetch from "./useFetch";

interface Item {
  id: number;
  name: string;
}

const mockItem: Item = { id: 1, name: "Test item" };

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useFetch", () => {
  it("starts in the loading state with no data and no error", () => {
    vi.spyOn(globalThis, "fetch").mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useFetch<Item>("/api/item"));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("returns the data when the request succeeds", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockItem,
    } as Response);

    const { result } = renderHook(() => useFetch<Item>("/api/item"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toEqual(mockItem);
    expect(result.current.error).toBeNull();
  });

  it("sets an error when the response is not ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useFetch<Item>("/api/item"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Something went wrong!");
  });

  it("sets an error when the network request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network down"));

    const { result } = renderHook(() => useFetch<Item>("/api/item"));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe("Network down");
  });
});