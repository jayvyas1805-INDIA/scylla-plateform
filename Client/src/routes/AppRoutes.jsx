import { Routes, Route } from "react-router-dom";


import Home from "../pages/landing/home/Home";
import AboutUs from "../pages/landing/about/AboutUs";
import ContactUs from "../pages/landing/contact/ContactUs";
import MotorsportPolicy from "../pages/landing/contact/MotorsportPolicy";
import NotFound from "../pages/landing/NotFound";

import TeamLayout from "../layouts/TeamLayout";


import TeamLogin from "../pages/team/TeamLogin";
import VendorLogin from "../pages/Vendor/VendorLogin";
import TeamRegister from "../pages/team/TeamRegister";
import VendorRegister from "../pages/Vendor/VendorRegister";

import TeamForgotPassword from "../pages/team/TeamForgotPassword";
import VendorForgotPassword from "../pages/Vendor/VendorForgotPassword";

import TeamHome from "../pages/team/TeamHome";
import TeamProfile from "../pages/team/TeamProfile";
import TeamMembers from "../pages/team/TeamMembers";
import VehicleModule from "../pages/team/VehicleModule";

// // ✅ TEAM MARKETPLACE IMPORTS

import Marketplace from "../pages/team//Marketplace";
// // import Events from "../pages/team/marketplace/Events";
import Messages from "../pages/team/marketplace/Messages";

import Profilee from "../pages/team/profile/Profile";
import TeamUpdate from "../pages/team/TeamProfileUpdate";

import SetMemberPassword from "../pages/team/SetMemberPassword";
import EditProfile from "../pages/team/profile/EditProfile";

// /* ===================== VENDOR PAGES ===================== */

import VendorHome from "../pages/Vendor/VendorHome";
import VendorProfile1 from "../pages/Vendor/VendorProfile1";
import VendorQuotes from "../pages/Vendor/VendorQuotes";
import ProductListing from "../pages/Vendor/ProductListing";
import VendorMyProfile from "../pages/Vendor/VendorMyProfile";
// import NotFound from "../pages/Vendor/NotFound";

// /* ===================== VENDOR EDIT PAGES ===================== */

import EditVendorProfile from "../pages/Vendor/edit-profile/EditVendorProfile";
import AddProductForm from "../pages/Vendor/AddProductForm";

// /* ===================== VENDOR FORMS (✅ FIXED PATHS) ===================== */

import EditAboutForm from "../pages/Vendor/forms/EditAboutForm";
import AddServiceForm from "../pages/Vendor/forms/AddServiceForm";
import AddProjectForm from "../pages/Vendor/forms/AddProjectForm";
import EditHoursForm from "../pages/Vendor/forms/EditHoursForm";
import UploadMediaForm from "../pages/Vendor/forms/UploadMediaForm";


function AppRoutes() {
  return (
    <Routes>


      {/* Landing Page Routes */}
    <Route>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/motorsport-policy" element={<MotorsportPolicy />} />
      <Route path="/teams" element={<TeamRegister/>} />
      <Route path="/vendor" element={<VendorRegister/>} />
      <Route path="*" element={<NotFound />} />
  </Route>




      {/* ===================== VENDOR ROUTES ===================== */}

      <Route path="/vendor/home" element={<VendorHome />} />

      <Route path="/vendor/profile" element={<VendorProfile1 />} />

      <Route path="/vendor/profile/edit" element={<EditVendorProfile />} />

      {/* 🔹 Vendor Profile Forms */}
      <Route path="/vendor/profile/edit/about" element={<EditAboutForm />} />
      <Route path="/vendor/profile/edit/services/add" element={<AddServiceForm />} />
      <Route path="/vendor/profile/edit/projects/add" element={<AddProjectForm />} />
      <Route path="/vendor/profile/edit/hours" element={<EditHoursForm />} />
      <Route path="/vendor/profile/edit/media/upload" element={<UploadMediaForm />} />

      <Route path="/vendor/quote" element={<VendorQuotes />} />

      <Route path="/vendor/product" element={<ProductListing />} />

      <Route path="/vendor/product/add" element={<AddProductForm />} />

      <Route path="/vendor/myProfile" element={<VendorMyProfile />} />

      {/* <Route path="/vendor/Not-Found" element={<NotFound />} /> */}

      <Route path="/member/set-password/:token" element={<SetMemberPassword />} />

      {/* ===================== PUBLIC ROUTES ===================== */}

      <Route>

        <Route path="/team/login" element={<TeamLogin />} />
        <Route path="/vendor/login" element={<VendorLogin />} />

        <Route path="/team/register" element={<TeamRegister />} />
        <Route path="/vendor/register" element={<VendorRegister />} />

        {/* <Route path="/admin/login" element={<AdminLogin />}/> */}

        <Route
          path="/team/forgot-password"
          element={<TeamForgotPassword />}
        />

        <Route
          path="/vendor/forgot-password"
          element={<VendorForgotPassword />}
          />

          </Route>
      

      {/* ===================== TEAM ROUTES ===================== */}

      <Route path="/team" element={<TeamLayout />}>

        <Route path="home" element={<TeamHome />} />
        <Route path="profile" element={<TeamProfile />} />
        <Route path="members" element={<TeamMembers />} />
        <Route path="profilee/edit" element={<EditProfile />} />
        <Route path="vehicles" element={<VehicleModule />} />
        <Route path="profilee" element={<Profilee />} />
        <Route path="profile/edit" element={<TeamUpdate />} />

        {/* <Route path="marketplace" element={<MarketplaceLayout />}> */}
        <Route path="marketplace" element={<Marketplace />} />
        {/* <Route path="events" element={<Events />} /> */}
        <Route path="messages" element={<Messages />} />
        {/* </Route> */}

      </Route>

    </Routes>
  );
}

export default AppRoutes;



// import { Routes, Route } from "react-router-dom";


// const AppRoutes = () => (
{/* <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<AboutUs />} />
    <Route path="/contact" element={<ContactUs />} />
    <Route path="/motorsport-policy" element={<MotorsportPolicy />} />
    <Route path="*" element={<NotFound />} />
  </Routes> */}
// );

// export default AppRoutes;


// import { Routes, Route } from "react-router-dom";

// import PublicLayout from "../layouts/PublicLayout";
// import TeamLayout from "../layouts/TeamLayout";

// import LandingPage from "../pages/landing/LandingPage";
// import TeamLogin from "../pages/team/TeamLogin";
// import VendorLogin from "../pages/Vendor/VendorLogin";
// import TeamRegister from "../pages/team/TeamRegister";
// import VendorRegister from "../pages/Vendor/VendorRegister";

// import TeamForgotPassword from "../pages/team/TeamForgotPassword";
// import VendorForgotPassword from "../pages/vendor/VendorForgotPassword";

// import TeamHome from "../pages/team/TeamHome";
// import TeamProfile from "../pages/team/TeamProfile";
// import TeamMembers from "../pages/team/TeamMembers";
// import VehicleModule from "../pages/team/VehicleModule";

// // ✅ TEAM MARKETPLACE IMPORTS (CASE FIXED)
// // import MarketplaceLayout from "../pages/team/marketplace/MarketplaceLayout";
// // import Marketplace from "../pages/team/marketplace/MarketPlace";
// // import Events from "../pages/team/marketplace/Events";
// // import Messages from "../pages/team/marketplace/Messages";
// import Profilee from "../pages/team/profile/Profile";
// import SetMemberPassword from "../pages/team/SetMemberPassword";
// import EditProfile from "../pages/team/profile/EditProfile"
// // import Marketplace from "../pages/team/Marketplace";


// import VendorHome from "../pages/Vendor/VendorHome"
// import VendorProfile1 from "../pages/Vendor/VendorProfile1"
// import ProductListing from "../pages/Vendor/ProductListing"
// import VendorMyProfile from "../pages/Vendor/VendorMyProfile"
// import VendorQuotes from "../pages/Vendor/VendorQuotes"
// import NotFound from "../pages/Vendor/NotFound"
// import EditVendorProfile from "../pages/Vendor/edit-profile/EditVendorProfile"
// import UploadMediaForm from "../pages/Vendor/forms/UploadMediaForm"
// import EditAboutForm from "../pages/Vendor/forms/EditAboutForm"
// import EditHoursForm from "../pages/Vendor/forms/EditHoursForm"



// function AppRoutes() {
//   return (
//     <Routes>

//       <Route path="/vendor/home" element={<VendorHome />} />
      
//       <Route path="/vendor/profile" element={<VendorProfile1 />} />
//       <Route path="/vendor/myProfile" element={<VendorMyProfile />} />
      
//       <Route path="/vendor/quote" element={<VendorQuotes />} />
      
//       <Route path="/vendor/product" element={<ProductListing />} />
                
//       <Route path="/vendor/Not-Found" element={<NotFound />} />

//       <Route path="/vendor/profile/edit" element={<EditVendorProfile />} />
      
//       <Route path="/vendor/profile/edit/media/upload" element={<UploadMediaForm />} />

//       <Route path="/vendor/profile/edit/about" element={<EditAboutForm/>} />

//       <Route path="/vendor/profile/edit/hours" element={<EditHoursForm/>} />


//       {/* <Route path="/vendor/profile/edit" element={<VendorProfileEdit />} /> */}
//       {/* <Route path="/vendor/myProfile" element={<VendorMyProfile />} /> */}
      
//       <Route path="/member/set-password/:token" element={<SetMemberPassword />} />
      



//       {/* 🔵 PUBLIC ROUTES */}
//       <Route element={<PublicLayout />}>


//         <Route path="/" element={<LandingPage />} />

//         <Route path="/team/login" element={<TeamLogin />} />
//         <Route path="/vendor/login" element={<VendorLogin />} />

//         <Route path="/team/register" element={<TeamRegister />} />
//         <Route path="/vendor/register" element={<VendorRegister />} />

//         {/* <Route path="/team/test" element={<TestTeamProfile />} /> */}


//         {/* 🔐 FORGOT PASSWORD ROUTES */}
//         <Route
//           path="/team/forgot-password"
//           element={<TeamForgotPassword />}
//         />

//         <Route
//           path="/vendor/forgot-password"
//           element={<VendorForgotPassword />}
//         />

//       </Route>

//       {/* 🟢 TEAM ROUTES (PROTECTED) */}
//       <Route path="/team" element={<TeamLayout />}>

//         <Route path="home" element={<TeamHome />} />

//         <Route path="profile" element={<TeamProfile />} />

//         <Route path="members" element={<TeamMembers />} />

//         <Route path="profilee/edit" element={<EditProfile />} />

//         <Route path="vehicles" element={<VehicleModule />} />

//         <Route path="profilee" element={<Profilee />} />
//         {/* <Route path="marketplace" element={<Marketplace />} /> */}
//         {/* <Route path="messages" element={<Messages />} /> */}
        

//         {/* <Route path="profile/edit" element={<TeamUpdate />} /> */}

//         {/* 🟣 TEAM MARKETPLACE ROUTES */}
//         {/* <Route path="marketplace" element={<MarketplaceLayout />}> */}

//           {/* <Route index element={<Marketplace />} /> */}

          


//         {/* </Route> */}
       

        

//       </Route>
      

//     </Routes >
//   );
// }

// export default AppRoutes;
