import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import JobCard from "./JobCard";
import type { Job } from "../types/job";

const mockJob: Job = {
  id: 1,
  title: "Frontend Developer",
  company: "Acme Corp",
  location: "Remote",
  description: "Build things with React.",
};

function renderJobCard(job: Job) {
  return render(
    <MemoryRouter>
      <JobCard job={job} />
    </MemoryRouter>
  );
}

describe("JobCard", () => {
  it("displays the job title, company and location", () => {
    renderJobCard(mockJob);

    expect(screen.getByText("Frontend Developer")).toBeInTheDocument();
    expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    expect(screen.getByText("Remote")).toBeInTheDocument();
  });

  it("links to the correct job details page", () => {
    renderJobCard(mockJob);

    const link = screen.getByRole("link", { name: /view details/i });
    expect(link).toHaveAttribute("href", "/jobs/1");
  });
});