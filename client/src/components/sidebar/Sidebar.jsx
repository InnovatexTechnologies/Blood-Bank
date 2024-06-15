import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GiBlood,
  GiBloodyStash,
  GiBrightExplosion,
  GiCardDiscard,
  GiCardPlay,
  GiGooSpurt,
  GiHamburgerMenu,
  GiMasterOfArms,
  GiPerson,
  GiReturnArrow,
  GiTempleGate,
  GiTransparentTubes,
} from "react-icons/gi";
import { BiDonateBlood } from "react-icons/bi";
import { MdBloodtype, MdOutlineBackup, MdSensorOccupied } from "react-icons/md";
import { SiWorldhealthorganization } from "react-icons/si";
import { BsBagPlusFill, BsPersonFillAdd } from "react-icons/bs";
import { TfiShoppingCartFull } from "react-icons/tfi";
import { ImBasecamp } from "react-icons/im";
import { FcExpired } from "react-icons/fc";
import "./sidebar.css";
import {
  FaAmbulance,
  FaCampground,
  FaDisease,
  FaHospitalAlt,
  FaHospitalUser,
  FaUserAlt,
} from "react-icons/fa";
import { TbReport } from "react-icons/tb";
import { CiHospital1 } from "react-icons/ci";
import { AiOutlineTransaction } from "react-icons/ai";


const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    alert("Logout Successfully");

    setTimeout(() => {
      navigate("/");
    }, 200);
  };

  const myfun = () => {
    // --------- Toggle Side Nav --------

    const sideNav = document.querySelector("#side-nav");
    const push = document.querySelector(".push");

    console.log("sideNav.style.width", sideNav.style.width);

    if (sideNav.style.width === "5.6rem" || sideNav.style.width === "") {
      sideNav.style.width = "16rem";
      push.style.marginLeft = "16rem";
    } else {
      // close side nav
      sideNav.style.width = "5.6rem";
      push.style.marginLeft = "0rem";
      // close all opened sub menus
      document
        .querySelectorAll(".nav__drop")
        .forEach((drop) => (drop.style.height = "0px"));
    }
  };

  return (
    <>
      <div>
        <div class="sidenav-container" id="side-nav">
          <nav class="nav overflow-hidden">
            <div class="nav__brand">
              <div
                class="nav__icon nav__icon--menu text-white"
                id="nav-toggle"
                onClick={myfun}
              >
                <GiHamburgerMenu />
                {/* <ion-icon name="menu-outline" onClick={myfun} ></ion-icon> */}
              </div>
              <span href="#" class="nav__brand-logo">
                Blood Bank v23.06.22
              </span>
            </div>

            <hr />

            <ul class="nav__list px-0">
              <li className=" nav__item">
                <Link
                  to="/admin/bloodgroup"
                  class="nav__link"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseExampletwo"
                  aria-expanded="false"
                  aria-controls="collapseExampletwo"
                >
                  <GiMasterOfArms color="white" />
                  {/* <ion-icon name="earth-outline" class="nav__icon" style={{color:"#ffffff"}}></ion-icon> */}
                  <span
                    class="nav__name text-white"
                    style={{ color: "#ffffff" }}
                  >
                    {" "}
                    Master »
                  </span>
                </Link>
                <div
                  class="collapse text-start"
                  id="collapseExampletwo"
                  style={{ paddingLeft: "20px" }}
                >
                  <Link to="/admin/bloodgroup" class="nav__link">
                    <MdBloodtype color="white" />
                    {/* <ion-icon name="earth-outline" class="nav__icon" style={{color:"#ffffff"}}></ion-icon> */}
                    <span
                      class="nav__name text-white"
                      style={{ color: "#ffffff" }}
                    >
                      {" "}
                      Blood Group
                    </span>
                  </Link>

                  <Link to="/admin/blood-components" class="nav__link">
                    <GiBloodyStash color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Blood Components
                    </span>
                  </Link>
                  <Link to="/admin/user" class="nav__link">
                    <FaUserAlt color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      User
                    </span>
                  </Link>
                  {/* <Link to="/admin/Patient" class="nav__link">
                  <FaHospitalUser color="white" />
                  <span class="nav__name" style={{ color: "#ffffff" }}>
                    Patient Type
                  </span>
                </Link> */}
                  <Link to="/admin/Organization" class="nav__link">
                    <SiWorldhealthorganization color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Organization
                    </span>
                  </Link>
                  <Link to="/admin/Patient" class="nav__link">
                    <FaHospitalUser color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Patient Type
                    </span>
                  </Link>
                  <Link to="/admin/CampType" class="nav__link">
                    <FaCampground color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Camp Type
                    </span>
                  </Link>
                  <Link to="/admin/BagType" class="nav__link">
                    <BsBagPlusFill color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Bag Type
                    </span>
                  </Link>
                  <Link to="/admin/DonorType" class="nav__link">
                    <BsPersonFillAdd color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Donor Type
                    </span>
                  </Link>

                  <Link to="/admin/disease" class="nav__link">
                    <FaDisease color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Discard{" "}
                    </span>
                  </Link>
                  <Link to="/admin/donationtype" class="nav__link">
                    <BiDonateBlood color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Donation Type
                    </span>
                  </Link>
                  <Link to="/admin/Hospital" class="nav__link">
                    <CiHospital1 color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Hospital
                    </span>
                  </Link>
                  <Link to="/admin/stock-item" class="nav__link">
                    <GiTempleGate color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Stock Item
                    </span>
                  </Link>
                </div>
              </li>

              <li className=" nav__item">
                <Link
                  to="/admin/bloodgroup"
                  class="nav__link"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseExamplethree"
                  aria-expanded="false"
                  aria-controls="collapseExamplethree"
                >
                  <AiOutlineTransaction color="#fff" />

                  <span
                    class="nav__name text-white"
                    style={{ color: "#ffffff" }}
                  >
                    {" "}
                    Transaction »
                  </span>
                </Link>
                <div
                  class="collapse text-start"
                  id="collapseExamplethree"
                  style={{ paddingLeft: "20px" }}
                >
                  <Link to="/admin/openingstock" class="nav__link">
                    <FaHospitalUser color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Blood Opening Stock
                    </span>
                  </Link>
                  <Link to="/admin/BloodDonation" class="nav__link">
                    <BiDonateBlood color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Blood Donation{" "}
                    </span>
                  </Link>
                  <Link to="/admin/BloodIssue" class="nav__link">
                    <GiBlood color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Blood Issue{" "}
                    </span>
                  </Link>
                  <Link to="/admin/blood-return" class="nav__link">
                    <GiReturnArrow color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Blood Return{" "}
                    </span>
                  </Link>
                  <Link to="/admin/stock-purchase" class="nav__link">
                    <GiGooSpurt color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Stock Purchase
                    </span>
                  </Link>
                  <Link to="/admin/stock-lost" class="nav__link">
                    <GiBrightExplosion color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Lost/Transfer/Issue
                    </span>
                  </Link>
                  <Link to="/admin/deferral-donor" class="nav__link">
                    <GiPerson color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Deferral Donor
                    </span>
                  </Link>

                  <Link to="/admin/discard-stock" class="nav__link">
                    <GiCardDiscard color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Discard / Reactive
                    </span>
                  </Link>
                  <Link to="/admin/bulk-transfer" class="nav__link">
                    <FaAmbulance color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Bulk Transfer
                    </span>
                  </Link>
                  <Link to="/admin/transfusion-reaction" class="nav__link">
                    <GiTransparentTubes color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      TransFusion/Reaction
                    </span>
                  </Link>
                </div>
              </li>

              <li className=" nav__item">
                <Link
                  to="/admin/bloodgroup"
                  class="nav__link"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseExampleone"
                  aria-expanded="false"
                  aria-controls="collapseExampleone"
                >
                  <TbReport color="white" />

                  <span
                    class="nav__name text-white"
                    style={{ color: "#ffffff" }}
                  >
                    {" "}
                    Report »
                  </span>
                </Link>
                <div
                  class="collapse text-start"
                  id="collapseExampleone"
                  style={{ paddingLeft: "20px" }}
                >
                  <Link to="/admin/stock" class="nav__link">
                    <MdSensorOccupied color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Blood Stock
                    </span>
                  </Link>
                  <Link to="/admin/godown-register" class="nav__link">
                    <FaHospitalAlt color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Godown Stock
                    </span>
                  </Link>
                  <Link to="/admin/issue-register" class="nav__link">
                    <BiDonateBlood color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Blood Issue
                    </span>
                  </Link>
                  <Link to="/admin/blood-stock-register" class="nav__link">
                    <TfiShoppingCartFull color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Blood Stock Register
                    </span>
                  </Link>
                  <Link to="/admin/camp-report" class="nav__link">
                    <ImBasecamp color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Camp History
                    </span>
                  </Link>
                  <Link to="/admin/expire-report" class="nav__link">
                    <GiCardPlay color="white" />
                    <span class="nav__name" style={{ color: "#ffffff" }}>
                      Platelets Expire
                    </span>
                  </Link>
                </div>
              </li>

              <li className=" nav__item">
                <a
                  // href="http://api2.easyblood.in/Backup/DownloadFile"
                  href="http://api2.easyblood.in/Backup/DownloadFile"
                  rel="noreferrer"
                  target="_blank"
                  class="nav__link"
                >
                  <MdOutlineBackup color="white" />
                  <span class="nav__name" style={{ color: "#ffffff" }}>
                    Backup
                  </span>
                </a>
              </li>
            </ul>
            <hr />

            <div class="nav__user" onClick={logout}>
              <div class="nav__user-image">
                {/* <img src="https://wallpapercave.com/uwp/uwp358219.jpeg" width="100%" alt="profile" loading="lazy" /> */}
                <img
                  src="https://bizimages.withfloats.com/actual/5eee1a8b80874b00010e5294.jpg"
                  width="100%"
                  alt="profile"
                  loading="lazy"
                />
              </div>

              <div class="nav__user-info">
                <div class="nav__user-info-name">Blood Bank</div>
                <div class="nav__user-info-email">Log out</div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
