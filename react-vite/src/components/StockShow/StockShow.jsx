// import { useSelector } from 'react-redux';
import './StockShow.css'

import OpenModalButton from '../OpenModalButton/OpenModalButton';
import BuyStockModal from '../BuyStockModal/BuyStockModal';
import SellStockModal from '../SellStockModal/SellStockModal'

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



                <div
                className='button-cont-stockshow'
                >

                {/* <button
                className= 'buy-button'
                > */}


                <OpenModalButton
                className='buy-button'
                buttonText="Buy"
                // onItemClick={closeMenu}
                modalComponent={<BuyStockModal />}
              />
                {/* </button> */}



               

                <OpenModalButton
                className='sell-button'
                buttonText="Sell"
                // onItemClick={closeMenu}
                modalComponent={<SellStockModal />}
              />




                <button
                className='add-watch-button'
                >Add to watchlist</button>
                </div>


                <p>Technical data</p>

                <div
                className='tech-data'
                >
                <p>PRICE</p>
                <p>VOLUME</p>
                <p>VOLATILITY</p>
                <p>MARKET-CAP</p>
                <p>OPEN</p>
                <p>CLOSE</p>
                <p>HIGH</p>
                <p>LOW</p>

                </div>





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
