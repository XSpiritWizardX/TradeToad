
import "./Footer.css";

function FooterCard() {
  return (
    <div>





<footer
    className="foot"
    >



      {/* <div
      className="resource-col"
      > */}


      <h5>App Data && Resources</h5>
      <a to='/resources'
      className='resources'
      >
        resources
        </a>
        <a
        to='/api-docs'
        className='resources'
        >Products</a>
{/*
      </div> */}



      {/* <div
      className="career-col"
      > */}

        <a
        to='/api-docs'
        className='resources'
        >Careers</a>
        <a


        to='/api-docs'
        className='resources'
        >contact Us</a>

      {/* </div> */}





    </footer>







    </div>
  );
}

export default FooterCard;
