// import { useState } from "react";
// import { useDispatch } from "react-redux";
import { useState } from "react";
// import { useModal } from "../../context/Modal";
import "./BuyStockModal.css";

function BuyStockModal() {
  const [shares,setShares] = useState()
  // const dispatch = useDispatch();
  // const [errors, setErrors] = useState({});
  // const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const serverResponse = await dispatch(
    //   thunkLogin({
    //     email,
    //     password,
    //   })
    // );

    // if (serverResponse) {
    //   setErrors(serverResponse);
    // } else {
      // closeModal();
    // }
  };

  return (
    <>
      <h1>Buy At Price</h1>
      <form onSubmit={handleSubmit}
      className="buy-form"
      >
        <label>
         price statedotstockdotprice
        </label>
      <label>Shares
            <input
            type="text"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            required
            />
       </label>
        <button
        type="submit"
        className="buy-modal-button"
        >
          Buy Now
        </button>
      </form>
    </>
  );
}

export default BuyStockModal;
