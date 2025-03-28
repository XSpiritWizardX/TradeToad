// import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PortfolioCard from '../../components/Portfolio/Portfolio';
import WatchlistCard from '../../components/Watchlist/Watchlist'
import './Dashboard.css'


function Dashboard() {
//   const sessionUser = useSelector(state => state.session.user);

  // Redirect if not logged in
//   if (!sessionUser) return <Navigate to="/" />;

  return (
    <div className="dashboard-container">



      <h1
      className='dash-head-text'
      >
        Welcome, USER!
        </h1>




      <div className="dashboard-content">
        <PortfolioCard
        className="portfolio-card"
        />
        <WatchlistCard
        className='watchlist-card'
        />
      </div>




        <div
        className='foot-text'
        >
            <p>Tune in for more</p>
        </div>




    <h1
    className='para-stock-choice'
    >
        stock choices
    </h1>
        <div
        className='stock-choices-dashboard'
        >


            <NavLink
              className="stock-choices-card"
              to='/stocks/:stockID'
            >
              <button>
                Stock #1
              </button>
            </NavLink>

            <NavLink
             to='/stocks/:stockID'
                className="stock-choices-card"
            >
              <button>
                Stock #2
              </button>
            </NavLink>

            <NavLink
             to='/stocks/:stockID'
                className="stock-choices-card"
            >
              <button>
                Stock #3
              </button>
            </NavLink>

        </div>






    </div>
  );
}

export default Dashboard;
