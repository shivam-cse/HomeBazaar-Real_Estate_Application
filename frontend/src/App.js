import './App.css';
import React, { Fragment } from 'react';
import { Route, Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom'
import Navbar from './components/Navbar';
import AlertState from "./components/context/AlertState";

import BuyerDashboard from './components/buyer/Dashboard';
import BuyerUpdateProfile from './components/buyer/UpdateProfile';
import BuyerUpdatePassword from './components/buyer/UpdatePassword';

import AgentDashboard from './components/agent/Dashboard';
import AgentUpdateProfile from './components/agent/UpdateProfile';
import AgentUpdatePassword from './components/agent/UpdatePassword';

import AdminDashboard from './components/admin/Dashboard';
import AdminUpdateProfile from './components/admin/UpdateProfile';
import AdminUpdatePassword from './components/admin/UpdatePassword';
import ViewComplaint from './components/admin/ViewComplaint';
import ViewUser from './components/admin/ViewUser';

import SellerDashboard from './components/seller/Dashboard';
import SellerUpdateProfile from './components/seller/UpdateProfile';
import SellerUpdatePassword from './components/seller/UpdatePassword';
import SellerApartmentView from './components/seller/ApartementView';
import SellerAddApartment from './components/seller/AddApartment';
import ApartementResult from './components/apartment/ApartementResult';
import Property from './components/apartment/Property';

import Home from './components/Home';
import About from './components/About';
import ContactUs from './components/ContactUs';
import Complaints from './components/Complaints';
import BuyerSignup from './components/login_signup/BuyerSignup';
import AgentSignup from './components/login_signup/AgentSignup';
import SellerSignup from './components/login_signup/SellerSignup';

import Login from './components/login_signup/Login';
import Receiver from './components/chat/Receiver';
import Chat from './components/chat/Chat';
import AgentResult from './components/agent/AgentResult';

function App() {
  return (
    <>
      <AlertState>
        <BrowserRouter>
          <Fragment>
            <Navbar />
            <Routes>

              <Route exact path="/login" element={<Login />} />

              <Route exact path="/buyersignup" element={<BuyerSignup />} />
              <Route exact path="/agentsignup" element={<AgentSignup />} />
              <Route exact path="/sellersignup" element={<SellerSignup />} />

              <Route exact path="/complaint" element={<Complaints />} />
              <Route exact path="/admin/view-complaints" element={<ViewComplaint />} />
              <Route exact path="/buyer/dashboard" element={<BuyerDashboard />} />
              <Route exact path="/buyer/update-profile" element={<BuyerUpdateProfile />} />
              <Route exact path="/buyer/update-password" element={<BuyerUpdatePassword />} />

              <Route exact path="/agent/dashboard" element={<AgentDashboard />} />
              <Route exact path="/agent/update-profile" element={<AgentUpdateProfile />} />
              <Route exact path="/agent/update-password" element={<AgentUpdatePassword />} />

              <Route exact path="/seller/dashboard" element={<SellerDashboard />} />
              <Route exact path="/seller/update-profile" element={<SellerUpdateProfile />} />
              <Route exact path="/seller/update-password" element={<SellerUpdatePassword />} />
              <Route exact path="/seller/apartment-view" element={<SellerApartmentView />} />
              <Route exact path="/seller/add-apartment" element={<SellerAddApartment />} />

              <Route exact path="/admin/dashboard" element={<AdminDashboard />} />
              <Route exact path="/admin/update-profile" element={<AdminUpdateProfile />} />
              <Route exact path="/admin/update-password" element={<AdminUpdatePassword />} />
              <Route exact path="/admin/manage-users" element={<ViewUser />} />

              <Route exact path="/" element={<Home />} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/contactUs" element={<ContactUs />} />
              <Route exact path="/apartmentResult" element={<ApartementResult />} />
              <Route exact path="/property" element={<Property />} />
              <Route exact path="/receiver" element={<Receiver />} />
              <Route exact path="/chat" element={<Chat />} />
              <Route exact path="/agentResult" element={<AgentResult />} />
            </Routes>
          </Fragment>
        </BrowserRouter>
      </AlertState>
    </>
  );
}

export default App;
