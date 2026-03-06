import React from 'react'
import "./css/Home.css"
import Carousel from 'react-bootstrap/Carousel';
import vid from "../assets/vid.mp4";
import vid2 from "../assets/vid2.mp4";
import vid3 from "../assets/vid3.mp4";
import Item from '../components/Item';


const Home = () => {

  return (
    <>
    <div>
      <Carousel className='mycarousel'>
      <Carousel.Item>
       <video className='slideimg' autoPlay muted playsInline>
        <source src={vid} type='video/mp4'/>
       </video>
        <Carousel.Caption>
          <h3>Style Meets Performance</h3>
          <p>Comfort that keeps up with your everyday hustle</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <video className='slideimg' autoPlay muted playsInline>
          <source src={vid2} type='video/mp4'/>
        </video>
        <Carousel.Caption>
          <h3>Unleash Your Power</h3>
          <p>Move faster. Train harder. Perform better.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
       <video className='slideimg' autoPlay muted playsInline>
        <source src={vid3} type='video/mp4'/>
       </video>
        <Carousel.Caption>
          <h3>Engineered for Speed</h3>
          <p>
          Built with precision cushioning for unstoppable motion.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    </div> 
     <br/><br/><br/>
  
  <Item/>
   </>
  )
}

export default Home