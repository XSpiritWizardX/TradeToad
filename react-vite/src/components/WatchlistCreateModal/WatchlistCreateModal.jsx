import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as watchlistActions from '../../redux/watchlist'; // You'll need to create this file
import { useModal } from '../../context/Modal';
import './WatchlistCreateModal.css';


function WatchlistCreateModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const sessionUser = useSelector(state => state.session.user);
  const [name, setName] = useState('My Watchlist');
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = "Watchlist name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsCreating(true);
      
      // default watchlist data plus user_id from sessionUser
      const watchlistData = {
        user_id: sessionUser.id,
        name: name
      };
      
      const result = await dispatch(watchlistActions.createWatchlist(watchlistData));
      setIsCreating(false);
      alert("Watchlist created successfully!");
      closeModal();
    } catch (error) {
      setIsCreating(false);
      alert(error.message || "Failed to create watchlist");
    }
  };

  return (
    <div className='create-confirm'>
      <h1>Create New Watchlist</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Watchlist Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isCreating}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>

        <div className="button-container">
          <button 
            type="submit"
            className='delete-spotty-button'
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Watchlist"}
          </button>

          <button 
            type="button"
            onClick={closeModal}
            className='keep-spot-button'
            disabled={isCreating}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}


export default WatchlistCreateModal;