import {useEffect, useState } from "react";
import JobCard from "./JobCard";


function JobList(){

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 5;

    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;


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

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase());
        const matchesLocation = location === "" || job.location === location;

        return matchesSearch && matchesLocation;

    })
    // filtered jobs + paginate
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    return(
        <>
        <div>
            <input type="text" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)}></input>
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">All locations</option>
            <option value="Remote">Remote</option>
            <option value="Belgium">Belgium</option>
            </select>

            {filteredJobs.length === 0 && <p>No jobs found.</p>}

            {currentJobs.map(job => (
            <JobCard key={job.id} job={job}/>
            ))}
        </div>  
        <div style={{marginTop: "20px"}}>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1,1))} disabled={currentPage === 1}>
            Prev
        </button>

        <span style={{margin: "0 10px"}}>Page {currentPage}</span>

         <button onClick={() => setCurrentPage(next => Math.min(next + 1, Math.ceil(filteredJobs.length/jobsPerPage)))} disabled={currentPage === Math.ceil(filteredJobs.length / jobsPerPage)}>
            Next
        </button>   

        </div>
    </>
    );
}


export default JobList;