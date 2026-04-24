import './LandingPage.css';
import {Link} from 'react-router-dom'


const LandingPage = () => {
  return (
      <div className="landing">
        <header className="hero-section" id="home">
          <div className="hero-content">
            <p>Real-Estate consultency</p>
          </div>
        </header>

        
        

        <section className="contact-section" id="contact">
          <h2>Get in Touch</h2>
          <p>Have questions or need help? Our experts are just a call or click away.</p>
          <p>
            📞 <strong>+91-9347522620</strong> <br />
            📧 <strong>rrconsultancy@email.com</strong>
          </p>
          <a href="/contact" className="cta-button secondary">Contact Us</a>
        </section>

        <footer className="footer">
         
        </footer>
      </div>
    
  );
};

export default LandingPage;
