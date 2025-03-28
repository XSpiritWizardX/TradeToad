// import { useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';
import './Portfolio.css'

function PortfolioCard() {

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
            >Portfolio ...Investing...  Total amount of money
            </h1>
            <h1
            className='investing-money-portfolio2'
            >money today... %change</h1>
        </div>


      <div className="portfolio-content">
        <img src="https://res.cloudinary.com/dl6ls3rgu/image/upload/v1743126559/robinhood-portfolio-example_cl1zyl.jpg" alt="example-portfolio"
        className='example-port-img'/>
      </div>

    </div>
  );

}

export default PortfolioCard;
