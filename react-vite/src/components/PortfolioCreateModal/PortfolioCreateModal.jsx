import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as portfolioActions from '../../redux/portfolio';
import { useModal } from '../../context/Modal';
import './PortfolioCreateModal.css';


function PortfolioCreateModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { closeModal } = useModal();
  const sessionUser = useSelector(state => state.session.user);
  console.log(`Trying to get user ID: ${ sessionUser }`)

  const handleSubmit = async (e) => {
    e.preventDefault();    // prevent default form submission

    try {
      // Default portfolio data plus user_id from sessionUser
      const portfolioData = {
        user_id: sessionUser.id,
        name: "My Portfolio",
        total_cash: 100.00,
        available_cash: 100.00
      };
      
      await dispatch(portfolioActions.createPortfolio(portfolioData));
      alert("Portfolio created successfully!");
      closeModal();
      navigate('/dashboard');
    } catch (error) {
      alert(error.message || "Failed to create portfolio");
    }
  };

  return (
    <div className='create-confirm'>
      <h1>Confirm New Portfolio</h1>

      <p className='confirm-create-text'>
        Are you sure you want to create a portfolio?
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="button-container">
          <button 
            type="submit"
            className='create-port-button'
          >
            Yes (Create Portfolio)
          </button>

          <button 
            // use "type=submit" to type="button" so it doesn't submit the form
            type="button"
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


export default PortfolioCreateModal;


  //   try {
  //      dispatch(portfolioActions.createPortfolio({
  //       user_id: currentUser,
  //       total_cash: 100.00,
  //       available_cash: 100.00
  //     })
  //     );
  //     alert("Portfolio created successfully!");
  //     closeModal();
  //   } catch (error) {
  //     alert(error.message);
  //   }
  // };


  // return (

  //   <div className='create-confirm'>
  //     <h1>Confirm New Portfolio</h1>

  //     <p className='confirm-create-text'>
  //       Are you sure you want to create a portfolio?
  //     </p>

  //     <form onSubmit={handleSubmit}>

  //       <button type="submit"
  //         onClick={handleSubmit} className='delete-spotty-button'>
  //         Yes (Create Portfolio)
  //       </button>

  //       <button type="submit"
  //         onClick={closeModal} className='keep-spot-button'>
  //         No (Return)
  //       </button>

  //     </form>
      
  //   </div>
  // );
// }



// export default PortfolioCreateModal;
