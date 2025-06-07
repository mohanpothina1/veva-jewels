import React from "react";
import "./ContactUs.css";

const ContactUs = () => {
  return (
    <div className="contact-us-container">
      <div className="contact-us-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you! Reach out for any queries or support.</p>
      </div>

      <div className="contact-us-content">
        <div className="contact-form">
          <h2>Get in Touch</h2>
          <form>
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="Enter your name" />

            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" placeholder="Enter your email" />

            <label htmlFor="message">Message</label>
            <textarea id="message" placeholder="Type your message"></textarea>

            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>

        <div className="contact-details">
          <h2>Our Office</h2>
          <p>
            <strong>Address:</strong> 123 Silver Street, New York, NY 10001
          </p>
          <p>
            <strong>Email:</strong> support@company.com
          </p>
          <p>
            <strong>Phone:</strong> +1 234 567 890
          </p>
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" className="social-icon facebook">Facebook</a>
            <a href="#" className="social-icon twitter">Twitter</a>
            <a href="#" className="social-icon instagram">Instagram</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
