import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import JobDetails from "./JobDetails";
import type { Job } from "../types/job";

const mockJob: Job = {
  id: 1,
  title: "Frontend Developer",
  company: "Acme Corp",
  location: "Remote",
  description: "Build things with React.",
};

function renderJobDetails() {
  return render(
    <MemoryRouter initialEntries={["/", "/jobs/1"]} initialIndex={1}>
      <Routes>
        <Route path="/" element={<p>Home page</p>} />
        <Route path="/jobs/:id" element={<JobDetails />} />
      </Routes>
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

describe("JobDetails", () => {
  it("shows a loading state, then the job details", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockJob,
    } as Response);
    renderJobDetails();

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    expect(
      await screen.findByRole("heading", { name: "Frontend Developer" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Acme Corp/)).toBeInTheDocument();
    expect(screen.getByText(/Build things with React\./)).toBeInTheDocument();
  });

  it("requests the job that matches the id in the URL", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockJob,
    } as Response);
    renderJobDetails();

    await screen.findByRole("heading", { name: "Frontend Developer" });

    expect(fetchSpy).toHaveBeenCalledWith("http://api.test/jobs/1");
  });

  it("shows an error message when the request fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
    } as Response);
    renderJobDetails();

    expect(await screen.findByText("Something went wrong!")).toBeInTheDocument();
  });

  it("shows 'Job not found' when the API returns nothing", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => null,
    } as Response);
    renderJobDetails();

    expect(await screen.findByText("Job not found")).toBeInTheDocument();
  });

  it("goes back to the previous page when clicking Back", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => mockJob,
    } as Response);
    const user = userEvent.setup();
    renderJobDetails();

    await user.click(await screen.findByRole("button", { name: /back/i }));

    expect(await screen.findByText("Home page")).toBeInTheDocument();
  });
});