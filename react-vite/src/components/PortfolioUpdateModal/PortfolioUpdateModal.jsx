import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as portfolioActions from '../../redux/portfolio';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import './PortfolioUpdateModal.css';

function PortfolioUpdateModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const [selectedPortfolioId, setSelectedPortfolioId] = useState('');
  const [name, setName] = useState('');
  const [totalCash, setTotalCash] = useState('');
  const [availableCash, setAvailableCash] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  
  // get portfolios from Redux state
  const portfoliosData = useSelector((state) => state.portfolio.portfolio);
  const portfolios = portfoliosData?.portfolios || [];

  useEffect(() => {
    // fetch portfolios when component mounts
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

    loadPortfolios();
  }, [dispatch]);

  // update form fields when a portfolio is selected
  useEffect(() => {
    if (selectedPortfolioId) {
      const selectedPortfolio = portfolios.find(p => p.id === parseInt(selectedPortfolioId));
      if (selectedPortfolio) {
        setName(selectedPortfolio.name);
        setTotalCash(selectedPortfolio.total_cash);
        setAvailableCash(selectedPortfolio.available_cash);
      }
    }
  }, [selectedPortfolioId, portfolios]);
  // warning  The 'portfolios' logical expression could make the dependencies of useEffect Hook (at line 50) change on every render. To fix this, wrap the initialization of 'portfolios' in its own useMemo() Hook  react-hooks/exhaustive-deps

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Portfolio name is required";
    }
    
    if (!totalCash || isNaN(totalCash) || parseFloat(totalCash) < 0) {
      newErrors.totalCash = "Total cash must be a valid positive number";
    }
    
    if (!availableCash || isNaN(availableCash) || parseFloat(availableCash) < 0) {
      newErrors.availableCash = "Available cash must be a valid positive number";
    }
    
    if (parseFloat(availableCash) > parseFloat(totalCash)) {
      newErrors.availableCash = "Available cash cannot exceed total cash";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPortfolioId) {
      alert("Please select a portfolio to update");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsUpdating(true);
      
      const portfolioData = {
        name,
        total_cash: parseFloat(totalCash),
        available_cash: parseFloat(availableCash)
      };
      
      // add updatePortfolio action to the redux/portfolio.js file
      await dispatch(portfolioActions.updatePortfolio(selectedPortfolioId, portfolioData));
      
      setIsUpdating(false);
      alert("Portfolio updated successfully!");
      closeModal();
      navigate('/dashboard');
    } catch (error) {
      setIsUpdating(false);
      alert(error.message || "Failed to update portfolio");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading portfolios...</div>;
  }

  if (!portfolios.length) {
    return (
      <div className='delete-confirm'>
        <h1>No Portfolios</h1>
        <p className='confirm-delete-text'>
          You don&apos;t have any portfolios to update.
        </p>
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
      <h1>Update Portfolio</h1>

      <p className='confirm-delete-text'>
        Select the portfolio to update:
      </p>
      
      <form onSubmit={handleSubmit}>
        <select 
          value={selectedPortfolioId}
          onChange={(e) => setSelectedPortfolioId(e.target.value)}
          className='portfolio-select'
          required
          disabled={isUpdating}
        >
          <option value="">-- Select a portfolio --</option>
          {portfolios.map(portfolio => (
            <option key={portfolio.id} value={portfolio.id}>
              {portfolio.name} (ID: {portfolio.id})
            </option>
          ))}
        </select>

        {selectedPortfolioId && (
          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="name">Portfolio Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isUpdating}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <p className="error-message">{errors.name}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="totalCash">Total Cash:</label>
              <input
                type="number"
                id="totalCash"
                value={totalCash}
                onChange={(e) => setTotalCash(e.target.value)}
                step="0.01"
                min="0"
                disabled={isUpdating}
                className={errors.totalCash ? 'error' : ''}
              />
              {errors.totalCash && <p className="error-message">{errors.totalCash}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="availableCash">Available Cash:</label>
              <input
                type="number"
                id="availableCash"
                value={availableCash}
                onChange={(e) => setAvailableCash(e.target.value)}
                step="0.01"
                min="0"
                disabled={isUpdating}
                className={errors.availableCash ? 'error' : ''}
              />
              {errors.availableCash && <p className="error-message">{errors.availableCash}</p>}
            </div>
          </div>
        )}

        <div className="button-container">
          <button 
            type="submit"
            className='update-port-button'
            disabled={!selectedPortfolioId || isUpdating}
          >
            {isUpdating ? "Updating..." : "Yes (Update Portfolio)"}
          </button>

          <button 
            type="button"
            onClick={closeModal}
            className='keep-spot-button'
            disabled={isUpdating}
          >
            No (Keep Portfolio the Same)
          </button>
        </div>
      </form>
    </div>
  );
}


export default PortfolioUpdateModal;