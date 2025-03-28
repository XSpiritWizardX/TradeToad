// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useModal } from "../../context/Modal";
import { useState } from "react";
import "./SellStockModal.css";

function SellStockModal() {
    const [shares, setShares] = useState()
  // const dispatch = useDispatch();
  // const [errors, setErrors] = useState({});
//   const { closeModal } = useModal();

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
    //   closeModal();
    // }
  };

  return (
    <>
      <h1>Sell At Price</h1>
      <form onSubmit={handleSubmit}>
       <label>Shares
            <input
            type="text"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            required
            />
       </label>
        <button type="submit">
          Sell Now
        </button>
      </form>
    </>
  );
}

export default SellStockModal;
