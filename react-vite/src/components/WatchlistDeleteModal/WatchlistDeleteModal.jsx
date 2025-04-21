import { useState, useEffect, useMemo } from 'react';
import * as watchlistActions from '../../redux/watchlist'; // You'll need to create this file
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import { useNavigate } from 'react-router-dom';
import './WatchlistDeleteModal.css';


function WatchlistDeleteModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const navigate = useNavigate();
  const [selectedWatchlistId, setSelectedWatchlistId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // get watchlists from Redux state
  const watchlistsData = useSelector((state) => state.watchlist.watchlist);
  
  // memoize the watchlists array to prevent extra useEffect hooks from running
  const watchlists = useMemo(() => {
    return watchlistsData?.watchlists || [];
  }, [watchlistsData]);

  useEffect(() => {
    // fetch watchlists when component mounts if not already loaded
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedWatchlistId) {
      alert("Please select a watchlist to delete");
      return;
    }

    try {
      setIsDeleting(true);
      await dispatch(watchlistActions.deleteWatchlist(selectedWatchlistId));
      setIsDeleting(false);
      alert("Watchlist deleted successfully!");
      closeModal();
      navigate('/dashboard');
    } catch (error) {
      setIsDeleting(false);
      alert(error.message || "Failed to delete watchlist");
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
          You don&apos;t have any watchlists to delete.
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
      <h1>Confirm Delete</h1>

      <p className='confirm-delete-text'>
        Select the watchlist to delete:
      </p>
      
      <form onSubmit={handleSubmit}>
        <select 
          value={selectedWatchlistId}
          onChange={(e) => setSelectedWatchlistId(e.target.value)}
          className='watchlist-select'
          required
          disabled={isDeleting}
        >
          <option value="">-- Select a watchlist --</option>
          {watchlists.map(watchlist => (
            <option key={watchlist.id} value={watchlist.id}>
              {watchlist.name} (ID: {watchlist.id})
            </option>
          ))}
        </select>

        <div className="button-container">
          <button 
            type="submit"
            className='delete-port-button'
            disabled={!selectedWatchlistId || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Yes (Delete Watchlist)"}
          </button>

          <button 
            type="button"
            onClick={closeModal}
            className='keep-spot-button'
            disabled={isDeleting}
          >
            No (Keep Watchlist)
          </button>
        </div>
      </form>
    </div>
  );
}


export default WatchlistDeleteModal;