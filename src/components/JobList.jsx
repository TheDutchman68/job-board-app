import {useEffect, useState } from "react";
import JobCard from "./JobCard";
import { useSearchParams } from "react-router-dom";


function JobList(){

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get("search") || "";
    const [searchInput, setSearchInput] = useState(search);
    const location = searchParams.get("location") || "";
    const currentPage = Number(searchParams.get("page")) || 1;
    const jobsPerPage = 5;
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;


    const filteredJobs = jobs.filter((job) => {
        const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) || job.company.toLowerCase().includes(search.toLowerCase());
        const matchesLocation = location === "" || job.location === location;

        return matchesSearch && matchesLocation;

    })

     // filtered jobs + paginate
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length/jobsPerPage);
    const noJobsFound = filteredJobs.length === 0;




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

   useEffect(() => {
        if (searchInput === search) return;

        const timeout = setTimeout(() => {
        setSearchParams({
         search: searchInput,
            location,
            page: 1,
                });
             }, 500);

            return () => clearTimeout(timeout);
        }, [searchInput, search, location, setSearchParams]);

    useEffect(() => {setSearchInput(search);},[search]);

    /*Handle pagination edge cases after filtering */
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
        setSearchParams({
        search,
        location,
        page: totalPages,
    });
  }
}, [currentPage, totalPages, search, location, setSearchParams]);



    if (loading) return <p>Loading jobs...</p>
    if (error) return <p>{error}</p>

  
   
    return(
    <div className="job-list-container">
        <div>
            <input type="text" placeholder="Search jobs..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}></input>
            <select value={location} onChange={(e) => setSearchParams({search,location: e.target.value,page: 1})}>
            <option value="">All locations</option>
            <option value="Remote">Remote</option>
            <option value="Belgium">Belgium</option>
            </select>

            {noJobsFound && <p>No jobs found!</p>}

            {currentJobs.map(job => (<JobCard key={job.id} job={job}/>))}
        </div>  
        
        <div className="pagination">
        <button onClick={() => setSearchParams({search, location, page: currentPage -1 })} disabled={currentPage === 1 || noJobsFound}>
            Prev
        </button>
        
        <span style={{margin: "0 10px"}}>Page {currentPage}</span>
        
        <button onClick={() => setSearchParams({search, location, page: currentPage + 1 })} disabled={currentPage === totalPages || noJobsFound}>
            Next
        </button>   
        </div>
    </div>
    );
}


export default JobList;