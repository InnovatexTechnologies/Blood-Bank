import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import BloodGroup from "./pages/admin/bloodgroup/BloodGroup";
import AddBloodGroup from "./pages/admin/bloodgroup/AddBloodGroup";
import Login from "./pages/Login/Login";
import ResetPassword from "./pages/Login/ResetPassword";
// Admin Pages
import DonationType from "./pages/admin/donatiotype/DonationType";
import AddDonationType from "./pages/admin/donatiotype/AddDonationType";
import EditDonationType from "./pages/admin/donatiotype/EditDonationType";

import BloodComponents from "./pages/admin/bloodcomponents/BloodComponents";
import AddBloodComponents from "./pages/admin/bloodcomponents/AddBloodComponents";
import Disease from "./pages/admin/disease/Disease";
import AddDisease from "./pages/admin/disease/AddDisease";
import User from "./pages/admin/user/User";
import AddUser from "./pages/admin/user/AddUser";
import EditUSer from "./pages/admin/user/EditUSer";
import EditDisease from "./pages/admin/disease/EditDisease";
import EditBloodComponents from "./pages/admin/bloodcomponents/EditBloodComponents";
import Patient from "./pages/admin/Patient/Patient";
import CreatePatient from "./pages/admin/Patient/CreatePatient";
import EditPatient from "./pages/admin/Patient/EditPatient";
import Organization from "./pages/admin/Organization/Organization";
import CreateOrganization from "./pages/admin/Organization/AddOrganization";
import EditOrganization from "./pages/admin/Organization/EditOrganization";
import BloodIssue from "./pages/admin/BloodIssue/BloodIssue";
import Hospital from "./pages/admin/Hospital/Hospital";
import CreateHospital from "./pages/admin/Hospital/AddHospital";
import EditHospital from "./pages/admin/Hospital/EditHospital";
import CampType from "./pages/admin/CampType/CampType";
import EditCampType from "./pages/admin/CampType/EditCampType";
import AddCampType from "./pages/admin/CampType/AddCampType";
import BagType from "./pages/admin/BagType/BagType";
import EditBagType from "./pages/admin/BagType/EditBagType";
import AddBagType from "./pages/admin/BagType/AddBagType";
import DonorType from "./pages/admin/DonarType/DonorType";
import AddDonorType from "./pages/admin/DonarType/AddDonorType";
import EditDonorType from "./pages/admin/DonarType/EditDonorType";
import AddBloodIssue from "./pages/admin/BloodIssue/AddBloodIssue";
import EditBloodIssue from "./pages/admin/BloodIssue/EditBloodIssue";
import BloodDonation from "./pages/admin/BloodDonation/BloodDonation";
import AddBloodDonation from "./pages/admin/BloodDonation/AddBloodDonation";
import EditBloodGroup from "./pages/admin/bloodgroup/EditBloodGroup";
import OpeningStock from "./pages/admin/openingstock/OpeningStock";
import AddOpeningStock from "./pages/admin/openingstock/AddOpeningStock";
import EditOpeningStock from "./pages/admin/openingstock/EditOpeningStock";
import StockRegister from "./pages/admin/stockregister/StockRegister";
import EditBloodDonation from "./pages/admin/BloodDonation/EditBloodDonation";

import DiscardStock from "./pages/admin/discardstock/DiscardStock";
import AddDiscardStock from "./pages/admin/discardstock/AddDiscardStock";
import EditDiscardStock from "./pages/admin/discardstock/EditDiscardStock";
import { useEffect, useState } from "react";


import StockItem from "./pages/admin/stockitem/StockItem";
import AddStockItem from "./pages/admin/stockitem/AddStockItem";
import EditStockItem from "./pages/admin/stockitem/EditStockItem";
import BloodReturn from "./pages/admin/BloodReturn/BloodReturn";
import AddBloodReturn from "./pages/admin/BloodReturn/AddBloodReturn";
import EditBloodReturn from "./pages/admin/BloodReturn/EditBloodReturn";
import StockPurchase from "./pages/admin/stockpurchase/StockPurchase";
import EditStockPurchase from "./pages/admin/stockpurchase/EditStockPurchase";
import AddStockPurchase from "./pages/admin/stockpurchase/AddStockPurchase";
import GodownRegister from "./pages/admin/godownregister/GodownRegister";
import Stocklost from "./pages/admin/stocklost/Stocklost";
import AddStocklost from "./pages/admin/stocklost/AddStocklost";
import EditStocklost from "./pages/admin/stocklost/EditStocklost";
import Deferral from "./pages/admin/deferral/Deferral";
import AddDeferral from "./pages/admin/deferral/AddDeferral";
import EditDeferral from "./pages/admin/deferral/EditDeferral";
import BulkTransfer from "./pages/admin/bulktransfer/BulkTransfer";
import AddBulkTransfer from "./pages/admin/bulktransfer/AddBulkTransfer";
import EditBulkTransfer from "./pages/admin/bulktransfer/EditBulkTransfer";
import TransfusionReaction from "./pages/admin/transfusion-reaction/TransfusionReaction";
import AddTransfusionReaction from "./pages/admin/transfusion-reaction/AddTransfusionReaction";
import EditTransfusionReaction from "./pages/admin/transfusion-reaction/EditTransfusionREaction";
import IssueReport from "./pages/admin/issueReport/IssueReport";
import BloodStockPage from "./pages/client/BloodStockPage";
import BloodStockRegister from "./pages/admin/bloodstockregister/BloodStockRegister";
import CampReport from "./pages/admin/campReport/CampReport";
import ExpireReport from "./pages/admin/expireReport/ExpireReport";


// Stock Purchase












function App() {
  const [auth, setauth] = useState(localStorage.getItem("token"));

 
  



  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/available-stock" element={<BloodStockPage />} />

          {auth && (
            <>
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Admin Blood group */}
              <Route path="/admin/bloodgroup" element={<BloodGroup />} />
              <Route path="/admin/add-bloodgroup" element={<AddBloodGroup />} />
              <Route
                path="/admin/edit-bloodgroup/:id"
                element={<EditBloodGroup />}
              />

              {/* Blood Components Page */}
              <Route
                path="/admin/blood-components"
                element={<BloodComponents />}
              />
              <Route
                path="/admin/addblood-components"
                element={<AddBloodComponents />}
              />
              <Route
                path="/admin/blood-components/:id"
                element={<EditBloodComponents />}
              />

              {/* BloodDonation */}
              <Route path="/admin/BloodDonation" element={<BloodDonation />} />
              <Route
                path="/admin/add-BloodDonation"
                element={<AddBloodDonation />}
              />
              <Route
                path="/admin/edit-BloodDonation/:id"
                element={<EditBloodDonation />}
              />

              {/* BloodIssue */}

              <Route path="/admin/BloodIssue" element={<BloodIssue />} />
              <Route path="/admin/add-BloodIssue" element={<AddBloodIssue />} />
              <Route
                path="/admin/edit-BloodIssue/:id"
                element={<EditBloodIssue />}
              />

              {/* Disease Page */}
              <Route path="/admin/disease" element={<Disease />} />
              <Route path="/admin/add-disease" element={<AddDisease />} />
              <Route path="/admin/edit-disease/:id" element={<EditDisease />} />

              {/* User Page */}
              <Route path="/admin/user" element={<User />} />
              <Route path="/admin/add-user" element={<AddUser />} />
              <Route path="/admin/edit-user/:id" element={<EditUSer />} />

              {/* Patient Page */}
              <Route path="/admin/Patient" element={<Patient />} />
              <Route path="/admin/add-Patient" element={<CreatePatient />} />
              <Route path="/admin/edit-Patient/:id" element={<EditPatient />} />

              {/* Organization Page */}

              <Route path="/admin/Organization" element={<Organization />} />
              <Route
                path="/admin/add-Organization"
                element={<CreateOrganization />}
              />
              <Route
                path="/admin/edit-Organization/:id"
                element={<EditOrganization />}
              />

              {/* Hospital */}

              <Route path="/admin/Hospital" element={<Hospital />} />
              <Route path="/admin/add-Hospital" element={<CreateHospital />} />
              <Route
                path="/admin/edit-Hospital/:id"
                element={<EditHospital />}
              />
              {/* CampType */}

              <Route path="/admin/CampType" element={<CampType />} />
              <Route path="/admin/add-CampType" element={<AddCampType />} />
              <Route
                path="/admin/edit-CampType/:id"
                element={<EditCampType />}
              />
              {/* Donation Type */}

              <Route path="/admin/donationtype" element={<DonationType />} />
              <Route
                path="/admin/add-donationtype"
                element={<AddDonationType />}
              />
              <Route
                path="/admin/edit-donationtype/:id"
                element={<EditDonationType />}
              />
              {/* BagType Type */}

              <Route path="/admin/BagType" element={<BagType />} />
              <Route path="/admin/add-BagType" element={<AddBagType />} />
              <Route path="/admin/edit-BagType/:id" element={<EditBagType />} />
              {/* DonorType Type */}

              <Route path="/admin/DonorType" element={<DonorType />} />
              <Route path="/admin/add-DonorType" element={<AddDonorType />} />
              <Route
                path="/admin/edit-DonorType/:id"
                element={<EditDonorType />}
              />

              <Route path="/admin/openingstock" element={<OpeningStock />} />
              <Route
                path="/admin/add-openingstock"
                element={<AddOpeningStock />}
              />
              <Route
                path="/admin/edit-openingstock/:id"
                element={<EditOpeningStock />}
              />

              {/* Blood Stock Register */}
              <Route path="/admin/stock" element={<StockRegister />} />

              {/* Discard Register */}
              <Route path="/admin/discard-stock" element={<DiscardStock />} />
              <Route
                path="/admin/add-discard-stock"
                element={<AddDiscardStock />}
              />
              <Route
                path="/admin/edit-discard-stock/:id"
                element={<EditDiscardStock />}
              />


              {/* Stock Item */}
              <Route path="/admin/stock-item" element={<StockItem />} />
              <Route path="/admin/add-stock-item" element={<AddStockItem />} />
              <Route path="/admin/edit-stock-item/:id" element={<EditStockItem />} />


              {/* Return Blood */}
              <Route path="/admin/blood-return" element={<BloodReturn />} />
              <Route path="/admin/add-blood-return" element={<AddBloodReturn />} />
              <Route path="/admin/edit-blood-return/:id" element={<EditBloodReturn />} />

              {/* Stock Purchase */}
              <Route path="/admin/stock-purchase" element={<StockPurchase />} />
              <Route path="/admin/add-stock-purchase" element={<AddStockPurchase />} />
              <Route path="/admin/edit-stock-purchase/:id" element={<EditStockPurchase />} />
              {/* Stock lost */}
              <Route path="/admin/stock-lost" element={<Stocklost />} />
              <Route path="/admin/add-stock-lost" element={<AddStocklost />} />
              <Route path="/admin/edit-stock-lost/:id" element={<EditStocklost />} />

              {/* Deferral Donor */}
              <Route path="/admin/deferral-donor" element={<Deferral />} />
              <Route path="/admin/add-deferral-donor" element={<AddDeferral />} />
              <Route path="/admin/edit-deferral-donor/:id" element={<EditDeferral />} />

              {/* Bulk Transfer */}
              <Route path="/admin/bulk-transfer" element={<BulkTransfer />} />
              <Route path="/admin/add-bulk-transfer" element={<AddBulkTransfer />} />
              <Route path="/admin/edit-bulk-transfer/:id" element={<EditBulkTransfer />} />

              {/* Transfusion Reaction */}
              <Route path="/admin/transfusion-reaction" element={<TransfusionReaction />} />
              <Route path="/admin/add-transfusion-reaction" element={<AddTransfusionReaction />} />
              <Route path="/admin/edit-transfusion-reaction/:id" element={<EditTransfusionReaction />} />



              {/* Godown Register */}
              <Route path="/admin/godown-register" element={<GodownRegister />} />
              <Route path="/admin/issue-register" element={<IssueReport />} />
              <Route path="/admin/blood-stock-register" element={<BloodStockRegister />} />
              <Route path="/admin/camp-report" element={<CampReport />} />
              <Route path="/admin/expire-report" element={<ExpireReport />} />



              







            </>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
