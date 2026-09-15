import { Link } from "react-router-dom";
import type { Job } from "../types/job";

interface JobCardProps {
  job: Job;
}

function JobCard({ job }: JobCardProps) {
    return(
        <div className="job-card">
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
            <Link to={`/jobs/${job.id}`}>View Details</Link>
        </div>
    );
}

export default JobCard;