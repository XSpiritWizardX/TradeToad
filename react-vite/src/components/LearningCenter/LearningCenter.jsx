


import { NavLink } from 'react-router-dom';
import './LearningCenter.css'




function LearningCenter() {



  return (
    <div className="blank-page-container">

        <h1>
            Feature Coming Soon
        </h1>

        <NavLink
        to='/'
         className='foot-links'
        >

            <button
            className='dashboard-button'
            >
              Home
            </button>
        </NavLink>

    </div>
  );

}

export default LearningCenter;
