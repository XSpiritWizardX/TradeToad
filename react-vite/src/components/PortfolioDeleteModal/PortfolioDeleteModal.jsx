import { useState, useEffect } from 'react';
import * as portfolioActions from '../../redux/portfolio';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import './PortfolioDeleteModal.css';

function PortfolioDeleteModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Get portfolios from Redux state
  const portfoliosData = useSelector((state) => state.portfolio.portfolio);
  const portfolios = portfoliosData?.portfolios || [];

  useEffect(() => {
    // Fetch portfolios when component mounts if not already loaded
    const loadPortfolios = async () => {
      try {
        setIsLoading(true);
        await dispatch(portfolioActions.fetchPortfolios());
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading portfolios:", error);
        setIsLoading(false);
      }
    };

    if (!portfolios.length) {
      loadPortfolios();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, portfolios.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPortfolioId) {
      alert("Please select a portfolio to delete");
      return;
    }

    try {
      await dispatch(portfolioActions.deletePortfolio(selectedPortfolioId));
      alert("Portfolio deleted successfully!");
      closeModal();
    } catch (error) {
      alert(error.message || "Failed to delete portfolio");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading portfolios...</div>;
  }

  if (!portfolios.length) {
    return (
      <div className='delete-confirm'>
        <h1>No Portfolios</h1>
        <p>You dont have any portfolios to delete.</p>
        <button 
          onClick={closeModal}
          className='keep-spot-button'
        >
          Return
        </button>
      </div>
    );
  }

  return (
    <div className='delete-confirm'>
      <h1>Confirm Delete</h1>

      <p className='confirm-delete-text'>
        Select the portfolio to delete:
      </p>
      
      <form onSubmit={handleSubmit}>
        <select 
          value={selectedPortfolioId}
          onChange={(e) => setSelectedPortfolioId(e.target.value)}
          className='portfolio-select'
          required
        >
          <option value="">-- Select a portfolio --</option>
          {portfolios.map(portfolio => (
            <option key={portfolio.id} value={portfolio.id}>
              {portfolio.name} (ID: {portfolio.id})
            </option>
          ))}
        </select>

        <div className="button-container">
          <button 
            type="submit"
            className='delete-port-button'
            disabled={!selectedPortfolioId}
          >
            Yes (Delete Portfolio)
          </button>

          <button 
            type="button" // Changed from submit to prevent form submission
            onClick={closeModal}
            className='keep-spot-button'
          >
            No (Keep Portfolio)
          </button>
        </div>
      </form>
    </div>
  );
}


export default PortfolioDeleteModal;