import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPortfolios } from "../../redux/portfolio";
// import { fetchPortfolioStocks } from "../../redux/portfolioStocks";
import './Portfolio.css'
// import { thunkAuthenticate } from '../../redux/session';

function PortfolioCard() {
  const dispatch = useDispatch();
  const portfolios = useSelector(state => state.portfolio.portfolio || [])
  // const portfolioStocks = useSelector(state => state.portfolioStocks.portfolioStocks || [])
  const user = useSelector(state => state.session.user);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      dispatch(fetchPortfolios())
        .then(() => setIsLoading(false))
        .catch(() => setIsLoading(false));
    }
  }, [dispatch, user]);

  if (isLoading) {
    return <div className="portfolio-container">Loading portfolio...</div>;
  }

  if (!portfolios?.portfolios?.length) {
    return (
      <div className="portfolio-container">
        <h2>No portfolios found. Create one to get started!</h2>
      </div>
    );
  }

  // const sessionUser = useSelector(state => state.session.user);
  // Redirect if not logged in
  // if (!sessionUser) return <Navigate to="/" />;
  
  // calculate daily change? (need daily data for this)
  // const dailyChange = 1.00; // Example value
  
  // get the first portfolio or use default values
  const portfolio = portfolios?.portfolios?.[0] || {};
  const totalCash = portfolio?.total_cash || 0;

  return (
    <div className="portfolio-container">
        <div className='portfolio-headline'>
            <h1 className='investing-money-portfolio'>Investing
              <br/>
              ${totalCash}
            </h1>
            <h1 className='investing-money-portfolio2'>$1234567.89
            {/* change this to a <h2> and adjust style ^ */}
            <span className="separation">
              &#183;
            </span>

            (1.00%)

            <span className="separation">
              &#183;
            </span>

            Today</h1>
        </div>

          {/* Begin react charts here */}
      <div className="portfolio-content">

        <img src="https://res.cloudinary.com/dl6ls3rgu/image/upload/v1743126559/robinhood-portfolio-example_cl1zyl.jpg" alt="example-portfolio"
        className='example-port-img'/>

      </div>
      {/* End react charts here */}

    </div>
  );
}

export default PortfolioCard;
