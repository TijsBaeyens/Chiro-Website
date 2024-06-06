import React from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Banner from "./components/Banner.jsx";
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Fotos from "./pages/PhotosPage.jsx";
import Artikel from "./pages/ArtikelPage.jsx";
import Fotoboek from "./pages/PhotoBookPage.jsx";
import InfoPage from "./pages/InfoPage.jsx";
import InschrijvingenPage from "./pages/InschrijvingenPage.jsx";
import InschrijvingSpecifiekEventPage from "./pages/InschrijvingSpecifiekEventPage.jsx";
 

function App() {
  return (
      <Router>
          <Navbar />
          <Routes>
              <Route path="/" element={[<Banner />, <Home />]} />
              <Route exact path="/fotoboek/:id" element={<Fotoboek />} />
              <Route path="/artikel/:id" element={<Artikel />} />
              <Route exact path="/fotos" element={<Fotos />} />
              <Route path="/info" element={<InfoPage />} />
              <Route path="/inschrijvingen" element={<InschrijvingenPage/>} />
              <Route path="/inschrijvingen/:id" element={<InschrijvingSpecifiekEventPage/>} />
              <Route path= "*" element={<h1>404 Not Found</h1>} />

          </Routes>
          <Footer />
      </Router>
  );
}
 
export default App;