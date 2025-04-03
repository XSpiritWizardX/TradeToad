// import { useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';
import './Portfolio.css'
import lineChart from '../LineChart/lineChart'
// import 'useLagRadar'
/*import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from ChartJS
 */

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
            >Investing
            <br/>
             $123,456,789.00
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


       {/* <img src="https://res.cloudinary.com/dl6ls3rgu/image/upload/v1743126559/robinhood-portfolio-example_cl1zyl.jpg" alt="example-portfolio"
        className='example-port-img'/> */}

<LineChart className='example-port-img'/>


      </div>

      {/* start react charts here */}


{/** end of chart */}

    </div>
  );

}

export default PortfolioCard;
