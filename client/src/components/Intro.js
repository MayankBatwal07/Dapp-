import React from "react";
import { Link } from "react-router-dom";
import "./Intro.css";
const Intro = () => {
  return (
    <>
      <ul className="list-group" id="list">
        <div className="center">
          <li className="list-group-item" aria-disabled="true">
            <h1>You are</h1>
          </li>
          <li className="list-group-item">
            <Link to="/supernode" className="text-decoration-none text">
              <button className="button1">Supernode</button>
            </Link>

            <Link to="/nodes" className="text-decoration-none text">
              <button className="button1 player">Node</button>
            </Link>
          </li>
        </div>
      </ul>
    </>
  );
};

export default Intro;