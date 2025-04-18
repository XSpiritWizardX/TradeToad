import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPortfolios } from "../../redux/portfolio";
// import { fetchPortfolioStocks } from "../../redux/portfolioStocks";
import './Portfolio.css'

function PortfolioCard() {
  const dispatch = useDispatch();
  const portfolios = useSelector(state => state.portfolio.portfolio || [])
  // const portfolioStocks = useSelector(state => state.portfolioStocks.portfolioStocks || [])


  useEffect(() => {
    dispatch(fetchPortfolios());
    // dispatch(fetchPortfolioStocks())
  }, [dispatch]);
  // const sessionUser = useSelector(state => state.session.user);

  // Redirect if not logged in
//   if (!sessionUser) return <Navigate to="/" />;

  return (
    <div className="portfolio-container">

        <div
        className='portfolio-headline'
        >
            <h1
            className='investing-money-portfolio'
            >Investing
            <br/>
            ${[portfolios?.portfolios?.[0]?.total_cash]}
            </h1>
            <h1
            className='investing-money-portfolio2'
            >$1234567.89

            <span
            className="seperation"
            >
              &#183;
            </span>

            (1.00%)

             <span
            className="seperation"
            >
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
