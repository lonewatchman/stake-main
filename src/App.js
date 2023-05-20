import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreditStake from './Component/CreditStake';
import Faqs from "./Component/Faqs";
import Footer from './Component/Footer';
import Header from './Component/Header';
import Home from './Component/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Validator from "./Component/Validator";

function App() {
  return (
    <>
      <BrowserRouter>
      <ToastContainer pauseOnFocusLoss={false} />
        <Header />
        <Routes>
          <Route exact path="/"  element={<Home />} />
          <Route exact path="/credit-stake" element={<CreditStake />} />
          <Route exact path="/faq" element={<Faqs />} />
          <Route exact path="/validator" element={<Validator />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
