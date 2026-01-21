import { useParams,useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";

function JobDetails(){
    const { id } = useParams();
    const {data: job, loading, error} = useFetch(`http://localhost:5001/jobs/${id}`)
    const navigate = useNavigate();

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>
    if (!job) return <p>Job not found</p>;

    return(      
        <div className="job-details">
            <h2>{job.title}</h2>
            <p>Company: {job.company}</p>
            <p>Description: {job.description}</p>
            <button className="back-button" onClick={() => navigate(-1)}> &larr; Back</button>
        </div>
    );
}

export default JobDetails;