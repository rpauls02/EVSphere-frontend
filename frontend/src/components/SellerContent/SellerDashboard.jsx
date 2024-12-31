import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import SellerSidebar from "./SellerSidebar";
import "./SellerDashboard.css";

const SellerDashboard = () => {
   return (
          <div className="settings-page-container">
              <div className="sidebar-container">
                  <SellerSidebar/>
              </div>
          </div>
      );
};

export default SellerDashboard;
