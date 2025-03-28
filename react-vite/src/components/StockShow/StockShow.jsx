// import { useSelector } from 'react-redux';
import './StockShow.css'


function StockShow() {
//   const sessionUser = useSelector(state => state.session.user);

  // Redirect if not logged in
//   if (!sessionUser) return <Navigate to="/" />;

  return (
    <div className="dashboard-container">



      <h1
      className='stock-show-head-text'
      >
       Stock Name Apple
        <br/>
        Price $123.45

        </h1>



        <div
        className='stock-show-area'
        >
            <img src="https://res.cloudinary.com/dl6ls3rgu/image/upload/v1743130771/apple-stock-example_pk547s.webp" alt="apple-example-image"
            className='example-apple-img'/>

            <div
            className='user-trade-menu'
            >
                <h1>Trade</h1>



                <button
                className='buy-button'
                >
                    BUY
                </button>


                <button
                className='sell-button'
                >
                    SELL
                </button>

            </div>


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







    </div>
  );
}

export default StockShow;
