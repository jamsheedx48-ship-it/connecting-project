import './App.css';
import MainRoute from './routes/MainRoute';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="">
      
      
      <MainRoute/>
      
        <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
