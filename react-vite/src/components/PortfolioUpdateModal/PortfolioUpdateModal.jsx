


// import * as portfolioActions from '../../redux/portfolio';
// import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './PortfolioUpdateModal.css';
// import { useSelector } from 'react-redux';
//

function PortfolioUpdateModal() {
//   const dispatch = useDispatch();
  const { closeModal } = useModal();
    // const portfolios = useSelector((state) => state.portfolio.portfolio)






  return (

    <div className='delete-confirm'>
      <h1>Confirm Update</h1>

      <p
      className='confirm-delete-text'
      >
      Are you sure you want to update your portfolio?
      </p>
      <form
    //   onSubmit={handleSubmit}
      >




        <button type="submit"
        //   onClick={handleSubmit}
          className='delete-spotty-button'
        >
          Yes (Update Portfolio // add $100)
          </button>


          <button type="submit"
          onClick={closeModal}
          className='keep-spot-button'
        >
          No (Keep Portfolio the Same)
          </button>


      </form>
    </div>


  );
}






export default PortfolioUpdateModal;
