import React from "react";
import Routes from "./router/Router.jsx";
import Navbar from "./components/Navbar.jsx"; 
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <div className="App">
    <Navbar/>
    <Routes/>
    <Footer/>
  </div>
  )
}

export default App