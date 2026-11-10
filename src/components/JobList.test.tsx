import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import JobList from "./JobList";
import type { Job } from "../types/job";

const mockJobs: Job[] = [
  { id: 1, title: "Frontend Developer", company: "Acme", location: "Remote", description: "" },
  { id: 2, title: "Backend Developer", company: "Globex", location: "Belgium", description: "" },
  { id: 3, title: "React Engineer", company: "Initech", location: "Remote", description: "" },
  { id: 4, title: "QA Engineer", company: "Umbrella", location: "Belgium", description: "" },
  { id: 5, title: "DevOps Engineer", company: "Hooli", location: "Remote", description: "" },
  { id: 6, title: "Data Analyst", company: "Stark", location: "Belgium", description: "" },
];

function mockFetchWith(jobs: Job[]) {
  vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => jobs,
  } as Response);
}

function renderJobList() {
  return render(
    <MemoryRouter>
      <JobList />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.stubEnv("VITE_API_URL", "http://api.test");
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("JobList", () => {
  it("shows a loading state, then the jobs", async () => {
    mockFetchWith(mockJobs);
    renderJobList();

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    expect(await screen.findByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("shows an error message when the request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network down"));
    renderJobList();

    expect(await screen.findByText("Network down")).toBeInTheDocument();
  });

  it("shows 5 jobs per page and lets you go to the next page", async () => {
    mockFetchWith(mockJobs);
    const user = userEvent.setup();
    renderJobList();

    await screen.findByText("Frontend Developer");
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(5);
    expect(screen.queryByText("Data Analyst")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next/i }));

    expect(await screen.findByText("Data Analyst")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /view details/i })).toHaveLength(1);
  });

  it("filters the jobs by location", async () => {
    mockFetchWith(mockJobs);
    const user = userEvent.setup();
    renderJobList();

    await screen.findByText("Frontend Developer");
    await user.selectOptions(screen.getByRole("combobox"), "Belgium");

    await waitFor(() => {
      expect(screen.queryByText("Frontend Developer")).not.toBeInTheDocument();
    });
    expect(screen.getByText("Backend Developer")).toBeInTheDocument();
    expect(screen.getByText("QA Engineer")).toBeInTheDocument();
    expect(screen.getByText("Data Analyst")).toBeInTheDocument();
  });

  it("filters the jobs by search text after the debounce delay", async () => {
    mockFetchWith(mockJobs);
    const user = userEvent.setup();
    renderJobList();

    await screen.findByText("Frontend Developer");
    await user.type(screen.getByPlaceholderText("Search jobs..."), "react");

    expect(
      await screen.findByText("React Engineer", {}, { timeout: 2000 })
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("Frontend Developer")).not.toBeInTheDocument();
    });
  });

  it("shows a message when no jobs match", async () => {
    mockFetchWith(mockJobs);
    const user = userEvent.setup();
    renderJobList();

    await screen.findByText("Frontend Developer");
    await user.type(screen.getByPlaceholderText("Search jobs..."), "zzzzzz");

    expect(
      await screen.findByText("No jobs found!", {}, { timeout: 2000 })
    ).toBeInTheDocument();
  });
});