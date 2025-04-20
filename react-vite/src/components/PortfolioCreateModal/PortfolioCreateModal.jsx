


import * as portfolioActions from '../../redux/portfolio';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './PortfolioCreateModal.css';
import { useSelector } from 'react-redux';


function PortfolioCreateModal() {

  const currentUser = useSelector((state) => state.session.user.id);

  const dispatch = useDispatch();
  const { closeModal } = useModal();
    // const portfolios = useSelector((state) => state.portfolio.portfolio)


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       dispatch(portfolioActions.createPortfolio({
        user_id: currentUser,
        total_cash: 100.00,
        available_cash: 100.00
      })
      );
      alert("Portfolio created successfully!");
      closeModal();
    } catch (error) {
      alert(error.message);
    }
  };





  return (

    <div className='delete-confirm'>
      <h1>Confirm New Portfolio</h1>

      <p
      className='confirm-delete-text'
      >
      Are you sure you want to create a portfolio?
      </p>
      <form
      onSubmit={handleSubmit}
      >




        <button type="submit"
          onClick={handleSubmit}
          className='delete-spotty-button'
        >
          Yes (Create Portfolio)
          </button>


          <button type="submit"
          onClick={closeModal}
          className='keep-spot-button'
        >
          No (Return)
          </button>


      </form>
    </div>


  );
}






export default PortfolioCreateModal;
