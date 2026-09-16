import JobList from "../components/JobList";
import { GoAlert } from "react-icons/go";
function Home() {
    return(
        <div className="app">
            <h1>Job Board</h1>
            <div className="api-info">
            <span className="api-icon">
                <GoAlert></GoAlert>
            </span>
              <p>
                This project uses a mock backend json server hosted on Render.
                Data may load with a slight delay.
              </p>
            </div>
            <JobList/>
        </div>
    )
}


export default Home;