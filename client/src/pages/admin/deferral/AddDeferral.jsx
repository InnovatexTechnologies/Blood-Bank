import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useGetApi, usePostApi } from "../../../utils/Customhooks/ApiCalls";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import Footer from "../../../components/footer/Footer";

const AddDeferral = () => {
  const navigate = useNavigate();

  const {
    isLoading: postloading,
    doPost,
    setUrl,
  } = usePostApi("/api/deferral");

  const [formData, setFormData] = useState({
    date: "",
    name: "",
    gender: "",
    address: "",
    mobno: "",
    reason: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleIssue = async (e) => {
    e.preventDefault();

    await doPost({
      Date:
        formData.date === ""
          ? Number(getCurrentDateInput().split("-").join(""))
          : Number(formData.date.split("-").join("")),
      Name: formData.name,
      Gender: formData.gender,
      Address: formData.address,
      MobileNo: formData.mobno,
      Reason: formData.reason,
    });

    if (!postloading) {
      navigate("/admin/deferral-donor");
    }
  };

  return (
    <>
      <Sidebar />
      <section
        className="push "
        style={{ position: "relative", transition: " margin-left .5s" }}
      >
        <div
          className=" py-4 "
          style={{
            position: "relative",
            transition: " margin-left .5s",
            backgroundColor: "#880808",
          }}
        >
          <div className="container text-white"></div>
        </div>
        <div className=" p-5 container" style={{minHeight:"80vh"}}>
          <div>
            <h1 className="Heading">Deferral Donor</h1>
          </div>

          <div className="p-2 ReferralLeadModal-Content">
            <form onSubmit={handleIssue}>
              <div
                className="row "
                style={{
                  rowGap: "8px",
                }}
              >
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Date
                  </label>
                  <div className="input-group ">
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      onChange={handleInputChange}
                      placeholder="Date"
                      defaultValue={getCurrentDateInput()}
                      required
                      aria-label="Recipient's name"
                      aria-describedby="basic-addon2"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                   Name
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      required
                      onChange={handleInputChange}
                      placeholder="Enter Name"
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Gender
                  </label>
                  <div className="input-group">
                    <select
                      name="gender"
                      class="form-select"
                      value={formData.gender}
                      required
                      onChange={handleInputChange}
                    >
                      <option value="" selected hidden>
                        Select Gender
                      </option>

                      <option value="Male">Male</option>
                      <option value="Female">Female</option>


                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                   Address
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      required
                      className="form-control"
                      name="address"
                      onChange={handleInputChange}
                      placeholder="Enter Adddress"
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>

                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Mob No.
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      min={0}
                      className="form-control"
                      name="mobno"
                      onChange={handleInputChange}
                      placeholder="Enter Mob No."
                      required
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                   Reason
                  </label>
                  <div className="input-group">
                    <select
                      name="reason"
                      class="form-select"
                      value={formData.reason}
                      required
                      onChange={handleInputChange}
                    >
                      <option value="" selected hidden>
                        Select Reason
                      </option>

                      <option value="Skin Problem">Skin Problem</option>
                      <option value="Anemic">Anemic</option>
                      <option value="Under Weight">Under Weight</option>
                      <option value="Medical Surgical Causes">Medical Surgical Causes</option>
                      <option value="High Risk History">High Risk History</option>
                      <option value="Other">Other</option>


                    </select>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    class="btn "
                    style={{
                      background: "#880808",
                      color: "white",
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default AddDeferral;
