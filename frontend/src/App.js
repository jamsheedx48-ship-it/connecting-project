import './App.css';
import MainRoute from './routes/MainRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
function App() {

useEffect(() => {
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.pushState(null, "", window.location.href);
  };
}, []);
  return (
    <div className="">
      
      <MainRoute/>
      <ToastContainer position="top-right" autoClose={2000} />
      
    
    </div>
  );
}

export default App;
