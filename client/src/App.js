import React, { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";
import ddos from "./contracts/DDOS.json";
import Supernode from "./components/supernode";
import Nodes from "./components/nodes";
import "./App.css";
import { Route,Link } from "react-router-dom";
import Intro from "./components/Intro";


const App = () => {
  const [state, setState] = useState({
    web3: null,
    contract: null,
  });

  const [address,setAddress]=useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        const web3 = await getWeb3();
        const networkId = await web3.eth.net.getId();

        const deployedNetwork = ddos.networks[networkId];
        console.log("Contract Address:", deployedNetwork.address);
        const instance = new web3.eth.Contract(
          ddos.abi,
          deployedNetwork && deployedNetwork.address
        );
        setAddress(deployedNetwork.address);
        setState({ web3, contract: instance });
      } catch (error) {
        alert("Falied to load web3 or contract.");
        console.log(error);
      }
    };
    init();
  }, []);

  return (
    <>
      <div  className="bg">
        <nav className="navbar navbar-expand-lg navbar">
          <div className="container-fluid">
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link to="/" className="nav-link navtext" aria-current="page">
                    Reward System
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/supernode"
                    className="nav-link navtext"
                    aria-current="page"
                  >
                    Supernode
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/nodes" className="nav-link navtext">
                    Node
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>



      <Route exact path="/">
        <Intro></Intro>
      </Route>
      <Route path="/supernode">
      <Supernode state={state} ></Supernode>
      </Route>
      <Route path="/nodes">
      <Nodes state={state} address={address} ></Nodes>
      </Route>
    </>
    
  );
};
export default App;
