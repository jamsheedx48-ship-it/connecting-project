import React from "react";
import "./css/About.css"
const About = () => {
  return (
    <div className="about-container">
      <h2 className="about-title">About Us</h2>

      <p className="about-text">
        Welcome to <strong>Nike Store</strong>, your ultimate destination
        for premium Nike products! We believe that sportswear is more than just
        clothing or footwear — it’s a lifestyle, a passion, and a statement of
        who you are. Our mission is to bring the power of Nike’s world-class
        innovation and design directly to our customers.
      </p>

      <h3 className="about-heading">Who We Are</h3>
      <p className="about-text">
        We are a dedicated team of sneaker enthusiasts, athletes, and fashion
        lovers who strive to deliver the best shopping experience for Nike fans.
        Whether you are a runner, gym lover, or a street-style fan — we have
        something special for you.
      </p>

      <h3 className="about-heading">What We Offer</h3>
      <h6 className="about-subheading">We handpick the finest Nike products:</h6>
      <ul className="about-list">
        <li>Latest Sneakers & Jordans</li>
        <li>Training & Running Shoes</li>
        <li>Sports Apparel & Activewear</li>
        <li>High-performance Accessories</li>
        <li>Limited Edition Collections</li>
      </ul>

      <h3 className="about-heading">Why Choose Us?</h3>
      <ul className="about-list">
        <li>100% Authentic Products</li>
        <li>Affordable & Competitive Pricing</li>
        <li>Secure & Easy Shopping Experience</li>
        <li>Friendly Customer Support</li>
      </ul>

      <h3 className="about-heading">Our Vision</h3>
      <p className="about-text">
        To become India’s most trusted destination for Nike apparel and footwear
        — where every customer finds confidence, energy, and inspiration.
      </p>

      <h3 className="about-heading">Our Promise</h3>
      <p className="about-text">
        We are committed to improving continuously — expanding product lines,
        boosting support, and keeping you updated with the latest Nike trends.
      </p>

      <h6 className="about-footer">
        Thank you for choosing our Nike Store.
        <br />
        Gear up. Step out. Believe in your greatness. <br />
        <strong>Just Do It.</strong>
      </h6>
    </div>
  );
};

export default About;
