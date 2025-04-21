import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as watchlistActions from '../../redux/watchlist'; // You'll need to create this file
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import './WatchlistUpdateModal.css';


function WatchlistUpdateModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const [selectedWatchlistId, setSelectedWatchlistId] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({});
  
  // get watchlists from Redux state
  const watchlistsData = useSelector((state) => state.watchlist.watchlist);
  
  // memoize the watchlists array to prevent extra useEffect hooks from running
  const watchlists = useMemo(() => {
    return watchlistsData?.watchlists || [];
  }, [watchlistsData]);

  useEffect(() => {
    // fetch watchlists when component mounts
    const loadWatchlists = async () => {
      try {
        setIsLoading(true);
        await dispatch(watchlistActions.fetchWatchlists());
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading watchlists:", error);
        setIsLoading(false);
      }
    };

    if (!watchlists.length) {
      loadWatchlists();
    } else {
      setIsLoading(false);
    }
  }, [dispatch, watchlists.length]);

  // update form fields when a watchlist is selected
  useEffect(() => {
    if (selectedWatchlistId) {
      const selectedWatchlist = watchlists.find(w => w.id === parseInt(selectedWatchlistId));
      if (selectedWatchlist) {
        setName(selectedWatchlist.name);
      }
    }
  }, [selectedWatchlistId, watchlists]);

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
    
    if (!selectedWatchlistId) {
      alert("Please select a watchlist to update");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setIsUpdating(true);
      
      const watchlistData = {
        name
      };
      
      await dispatch(watchlistActions.updateWatchlist(selectedWatchlistId, watchlistData));
      
      setIsUpdating(false);
      alert("Watchlist updated successfully!");
      closeModal();
      navigate('/dashboard');
    } catch (error) {
      setIsUpdating(false);
      alert(error.message || "Failed to update watchlist");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading watchlists...</div>;
  }

  if (!watchlists.length) {
    return (
      <div className='delete-confirm'>
        <h1>No Watchlists</h1>
        <p className='confirm-delete-text'>
          You don&apos;t have any watchlists to update.
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
      <h1>Update Watchlist</h1>

      <p className='confirm-delete-text'>
        Select the watchlist to update:
      </p>
      
      <form onSubmit={handleSubmit}>
        <select 
          value={selectedWatchlistId}
          onChange={(e) => setSelectedWatchlistId(e.target.value)}
          className='watchlist-select'
          required
          disabled={isUpdating}
        >
          <option value="">-- Select a watchlist --</option>
          {watchlists.map(watchlist => (
            <option key={watchlist.id} value={watchlist.id}>
              {watchlist.name} (ID: {watchlist.id})
            </option>
          ))}
        </select>

        {selectedWatchlistId && (
          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="name">Watchlist Name:</label>
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
          </div>
        )}

        <div className="button-container">
          <button 
            type="submit"
            className='update-port-button'
            disabled={!selectedWatchlistId || isUpdating}
          >
            {isUpdating ? "Updating..." : "Yes (Update Watchlist)"}
          </button>

          <button 
            type="button"
            onClick={closeModal}
            className='keep-spot-button'
            disabled={isUpdating}
          >
            No (Keep Watchlist the Same)
          </button>
        </div>
      </form>
    </div>
  );
}


export default WatchlistUpdateModal;