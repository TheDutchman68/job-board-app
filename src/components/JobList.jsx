import { jobs } from "../data/jobs";
import JobCard from "./JobCard";


function JobList(){
    return(
        <div>
        {jobs.map(job => (
        <JobCard key={job.id} job={job}/>
        ))}
        </div>    

    );
}


export default JobList;