import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as portfolioActions from '../../redux/portfolio';
import './BuyStockModal.css';


function BuyStockModal({ stockId, stockName, currentPrice }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const sessionUser = useSelector(state => state.session.user);
  
  const portfoliosData = useSelector((state) => state.portfolio.portfolio);
  const portfolios = portfoliosData?.portfolios || [];
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  
  const totalCost = (quantity * currentPrice).toFixed(2);
  
  useEffect(() => {
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

    if (sessionUser && !portfolios.length) {
      loadPortfolios();
    } else if (!sessionUser) {
      setIsLoading(false);
    }
  }, [dispatch, portfolios.length, sessionUser]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!quantity || quantity <= 0) {
      newErrors.quantity = "Please enter a valid quantity";
    }
    
    if (!selectedPortfolioId) {
      newErrors.portfolio = "Please select a portfolio";
    }
    
    if (selectedPortfolioId) {
      const selectedPortfolio = portfolios.find(p => p.id === parseInt(selectedPortfolioId));
      if (selectedPortfolio && parseFloat(selectedPortfolio.available_cash) < parseFloat(totalCost)) {
        newErrors.funds = "Insufficient funds in selected portfolio";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleContinue = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // use stockId in the alert to satisfy the ESLint warning
    alert(`Would proceed to confirmation for buying ${quantity} shares of ${stockName} (ID: ${stockId}) for $${totalCost}`);
    closeModal();
  };
  
  if (!sessionUser) {
    return (
      <div className='buy-stock-modal'>
        <h1>Buy {stockName}</h1>
        <p>Please log in to buy stocks.</p>
        <button 
          onClick={closeModal}
          className='cancel-button'
        >
          Close
        </button>
      </div>
    );
  }
  
  if (isLoading) {
    return <div className="loading">Loading portfolios...</div>;
  }
  
  if (!portfolios.length) {
    return (
      <div className='buy-stock-modal'>
        <h1>Buy {stockName}</h1>
        <p>You need to create a portfolio before you can buy stocks.</p>
        <button 
          onClick={closeModal}
          className='cancel-button'
        >
          Close
        </button>
      </div>
    );
  }
  
  return (
    <div className='buy-stock-modal'>
      <h1>Buy {stockName}</h1>
      
      <div className="stock-info">
        <p className="current-price">Current Price: ${currentPrice}</p>
        <p className="stock-id">Stock ID: {stockId}</p> {/* Added to use stockId */}
      </div>
      
      <form onSubmit={handleContinue}>
        <div className="form-group">
          <label htmlFor="portfolio">Select Portfolio:</label>
          <select
            id="portfolio"
            value={selectedPortfolioId}
            onChange={(e) => setSelectedPortfolioId(e.target.value)}
            className={errors.portfolio ? 'error' : ''}
            required
          >
            <option value="">-- Select a portfolio --</option>
            {portfolios.map(portfolio => (
              <option key={portfolio.id} value={portfolio.id}>
                {portfolio.name} (Available: ${parseFloat(portfolio.available_cash).toFixed(2)})
              </option>
            ))}
          </select>
          {errors.portfolio && <p className="error-message">{errors.portfolio}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
            min="1"
            step="1"
            className={errors.quantity ? 'error' : ''}
            required
          />
          {errors.quantity && <p className="error-message">{errors.quantity}</p>}
        </div>
        
        <div className="order-summary">
          <p>Total Cost: <span className="total-cost">${totalCost}</span></p>
          {errors.funds && <p className="error-message funds-error">{errors.funds}</p>}
        </div>
        
        <div className="button-container">
          <button 
            type="submit"
            className='continue-button'
          >
            Continue
          </button>
          
          <button 
            type="button"
            onClick={closeModal}
            className='cancel-button'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}


export default BuyStockModal;
