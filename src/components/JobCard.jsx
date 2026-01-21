import { Link } from "react-router-dom";

function JobCard({job}){
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