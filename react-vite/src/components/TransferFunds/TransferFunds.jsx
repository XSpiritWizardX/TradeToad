


import { NavLink } from 'react-router-dom';
import './TransferFunds.css'




function TransferFunds() {



  return (
    <div className="blank-page-container">

        <h1>
            TRANSFER FUNDS Coming Soon
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

export default TransferFunds;
