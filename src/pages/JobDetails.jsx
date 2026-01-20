import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function JobDetails(){
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        fetch(`http://localhost:5001/jobs/${id}`)
        .then(res => res.json())
        .then(data => {
            setJob(data);
            setLoading(false);
        })
    },[id]);

    if (loading) return <p>Loading...</p>;
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