import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";

function JobDetails(){
    const { id } = useParams();
    const {data: job, loading, error} = useFetch(`http://localhost:5001/jobs/${id}`)


    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>
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