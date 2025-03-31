
import "./Footer.css";














function FooterCard() {






  return (
    <div
   className="foot-container"
    >





<footer
    className="foot"
    >






      <div
      className="resource-col"
      >

        <h5>Get Connected</h5>

      <a to='/resources'
      className='foot-links'
      >
        Connectivity
        </a>


        <a
        to='/api-docs'
        className='foot-links'
        >Dashboard
        </a>


        <a
        to='/api-docs'
        className='foot-links'
        >Terms of Service
        </a>


        <a
        to='/api-docs'
        className='foot-links'
        >Privacy Policy
        </a>


        <a
        to='/api-docs'
        className='foot-links'
        >Third-Party Cookies
        </a>


      </div>










      <div
      className="resource-col"
      >


        <h5>Resources</h5>

        <a
        to='/api-docs'
        className='foot-links'
        >Using Trade Toad</a>


        <a
        to='/api-docs'
        className='foot-links'
        >Docs
        </a>


        <a
        to='/api-docs'
        className='foot-links'
        >Support
        </a>

        <a
        to='/api-docs'
        className='foot-links'
        >Supported Hardware
        </a>



      </div>












      <div
      className="resource-col"
      >

        <h5>Pricing</h5>


      <a to='/resources'
      className='foot-links'
      >
        Pricing Overview
        </a>


        <a
        to='/api-docs'
        className='foot-links'
        >Flexible plans
        </a>


        <a
        to='/api-docs'
        className='foot-links'
        >High Volume Data
        </a>


        <a
        to='/api-docs'
        className='foot-links'
        >Free Version
        </a>

        <a
        to='/api-docs'
        className='foot-links'
        >Subscriptions
        </a>

      </div>








        {/* DEVELOPERS */}
      <div
      className="resource-col"
      >

        <h5>Developers</h5>

      <a to='/resources'
      className='foot-links'
      >
        Forum
        </a>

        <a
        to='/api-docs'
        className='foot-links'
        >
          Projects
        </a>


        <a
        to='/api-docs'
        className='foot-links'
        >
          Team Comments
        </a>


      </div>







        {/* COMPANY */}
      <div
      className="resource-col"
      >

        <h5>Company</h5>

      <a to='/resources'
      className='foot-links'
      >
        About Us
        </a>

        <a
        to='/api-docs'
        className='foot-links'
        >Blog
        </a>

        <a
        to='/api-docs'
        className='foot-links'
        >Partnerships
        </a>

        <a
        to='/api-docs'
        className='foot-links'
        >Careers
        </a>

      </div>












        {/* SOCIAL */}

      <div
      className="resource-col"
      >

        <h5>Social</h5>

      <a to='/resources'
      className='foot-links'
      >
        Twitter
        </a>
        <a
        to='/api-docs'
        className='foot-links'
        >Facebook
        </a>

        <a
        to='/api-docs'
        className='foot-links'
        >Linkedin
        </a>

        <a
        to='/api-docs'
        className='foot-links'
        >Github
        </a>

        <a
        to='/api-docs'
        className='foot-links'
        >Discord
        </a>
      </div>








    </footer>

      <p
      className="copyright-text"
      >@2025 TradeToad</p>







    </div>
  );
}

export default FooterCard;
