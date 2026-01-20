import { useParams } from "react-router-dom";
import { jobs } from "../data/jobs";

function JobDetails(){
    const { id } = useParams();
    const job = jobs.find(j => j.id === Number(id));

    if (!job) return <p>Job not found</p>;

    return(      
        <div>
            <h2>{job.title}</h2>
            <p>{job.company}</p>
            <p>{job.description}</p>
        </div>
    );
}

export default JobDetails;