import { useDispatch, useSelector } from 'react-redux';
import * as watchlistActions from '../../redux/watchlist';
import { useModal } from '../../context/Modal';
import './WatchlistCreateModal.css';


function WatchlistCreateModal() {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const sessionUser = useSelector(state => state.session.user);

  const handleSubmit = async (e) => {
    e.preventDefault();    // prevent default form submission

    try {
      // Default watchlist data plus user_id from sessionUser
      const watchlistData = {
        user_id: sessionUser.id
      };
      
      await dispatch(watchlistActions.createWatchlist(watchlistData));
      alert("Watchlist created successfully!");
      closeModal();
    } catch (error) {
      alert(error.message || "Failed to create watchlist");
    }
  };

  return (
    <div className='create-confirm'>
      <h1>Confirm New Watchlist</h1>

      <p className='confirm-create-text'>
        Are you sure you want to create a watchlist?
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="button-container">
          <button 
            type="submit"
            className='delete-spotty-button'
          >
            Yes (Create Watchlist)
          </button>

          <button 
            type="button"  // Changed from "submit" to prevent form submission
            onClick={closeModal}
            className='keep-spot-button'
          >
            No (Return)
          </button>
        </div>
      </form>
    </div>
  );
}


export default WatchlistCreateModal;
