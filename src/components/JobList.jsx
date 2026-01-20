import {useEffect, useState } from "react";
import JobCard from "./JobCard";


function JobList(){

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5001/jobs")
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch jobs");
            return res.json();
        })
        .then(data => {
            setJobs(data);
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });

    },[]);

    if (loading) return <p>Loading jobs...</p>
    if (error) return <p>{error}</p>

    return(
        <div>
        {jobs.map(job => (
        <JobCard key={job.id} job={job}/>
        ))}
        </div>    

    );
}


export default JobList;