import { useState } from "react";
import { useNavigate } from "react-router-dom";


function SearchBar() {

  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("")




  const handleSubmit = async () => {




      navigate(`/stocks/${searchText}`);

  };

  return (
    <>
      <h1>Search</h1>
    
      <form onSubmit={handleSubmit}>
        <label>

          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}

          />
        </label>



        <button type="submit">Search</button>
        </form>
    </>
  );
}

export default SearchBar;
