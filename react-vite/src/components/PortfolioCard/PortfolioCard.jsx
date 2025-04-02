import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './PortfolioCard.css';

function PortfolioCard() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [balance, setBalance] = useState(sessionUser?.balance || 0);
  const [amount, setAmount] = useState('');

  const handleAddFunds = async (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      // You'll need to create this API endpoint in your backend
      const response = await fetch('/api/users/balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: parseFloat(amount) })
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
        setAmount('');
        // You might want to update the user in the session store as well
        // dispatch(updateUserBalance(data.balance));
      } else {
        const errorData = await response.json();
        alert(errorData.errors || 'Failed to add funds');
      }
    } catch (error) {
      console.error('Error adding funds:', error);
      alert('An error occurred while adding funds');
    }
  };

  if (!sessionUser) return null;

  return (
    <div className="portfolio-card">
      <h2>Your Portfolio!</h2>
      <div className="balance-section">
        <h3>Account Balance</h3>
        <p className="balance-amount">${balance.toFixed(2)}</p>
      </div>

      <form onSubmit={handleAddFunds} className="add-funds-form">
        <div className="input-group">
          <label htmlFor="amount">Add Funds</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
        </div>
        <button type="submit" className="add-funds-button">Add Funds</button>
      </form>
    </div>
  );
}

export default PortfolioCard;
