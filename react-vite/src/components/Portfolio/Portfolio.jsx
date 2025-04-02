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


        <img src="https://res.cloudinary.com/dl6ls3rgu/image/upload/v1743126559/robinhood-portfolio-example_cl1zyl.jpg" alt="example-portfolio"
        className='example-port-img'/>


      </div>

      {/* start react charts here */}
type DailyStars = {
   date: Date,
   stars: number,
 }

 type Series = {
   label: string,
   data: DailyStars[]
 }

 const data: Series[] = [
   {
     label: 'React Charts',
     data: [
       {
         date: new Date(),
         stars: 202123,
       }
       // ...
     ]
   },
   {
     label: 'React Query',
     data: [
       {
         date: new Date(),
         stars: 10234230,
       }
       // ...
     ]
   }
 ]
 function App() {
   const primaryAxis = React.useMemo(
     (): AxisOptions<DailyStars> => ({
       getValue: datum => datum.date,
     }),
     []
   )

   const secondaryAxes = React.useMemo(
     (): AxisOptions<DailyStars>[] => [
       {
         getValue: datum => datum.stars,
       },
     ],
     []
   )

   return (
     <Chart
       options={{
         data,
         primaryAxis,
         secondaryAxes,
       }}
     />
   )
 }
{/** end of chart */}

    </div>
  );

}

export default PortfolioCard;
