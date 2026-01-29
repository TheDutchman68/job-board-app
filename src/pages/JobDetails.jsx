import { useParams,useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import Loading from "../components/Loading";

function JobDetails(){
    const { id } = useParams();
    const API_URL = "https://job-board-api-1yuc.onrender.com"
    const {data: job, loading, error} = useFetch(`${API_URL}/jobs/${id}`)
    const navigate = useNavigate();

    if (loading) return <Loading/>
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