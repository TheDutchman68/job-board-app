function JobCard({job}){
    return(
        <div>
            <h3>{job.title}</h3>
            <p>{job.company}</p>
            <p>{job.location}</p>
        </div>
    );
}

export default JobCard;