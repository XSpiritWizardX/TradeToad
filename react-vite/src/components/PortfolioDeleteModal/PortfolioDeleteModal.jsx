


import * as portfolioActions from '../../redux/portfolio';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './PortfolioDeleteModal.css';
import { useSelector } from 'react-redux';


function PortfolioDeleteModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
    const portfolios = useSelector((state) => state.portfolio.portfolio)
  const handleSubmit = async () => {
    console.log("Portfolio ID before deleting:", portfolios);
    if (!portfolios?.portfolios?.[0]?.id) {
      alert("Error: No Portfolio ID provided!");  // Debugging check
      return;
    }

    try {
      await dispatch(portfolioActions.deletePortfolio(portfolios?.portfolios?.[0]?.id));
      alert("Portfolio deleted successfully!");
      closeModal();
    } catch (error) {
      alert(error.message);
    }
  };





  return (

    <div className='delete-confirm'>
      <h1>Confirm Delete</h1>

      <p
      className='confirm-delete-text'
      >
      Are you sure you want to remove your portfolio?
      </p>
      <form onSubmit={handleSubmit}>




        <button type="submit"
          onClick={handleSubmit}
          className='delete-spotty-button'
        >
          Yes (Delete Portfolio)
          </button>


          <button type="submit"
          onClick={closeModal}
          className='keep-spot-button'
        >
          No (Keep Portfolio)
          </button>


      </form>
    </div>


  );
}






export default PortfolioDeleteModal;
