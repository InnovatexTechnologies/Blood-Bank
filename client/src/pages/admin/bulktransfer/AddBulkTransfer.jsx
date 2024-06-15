import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useGetApi, usePostApi } from "../../../utils/Customhooks/ApiCalls";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import Footer from "../../../components/footer/Footer";

const AddBulkTransfer = () => {
  const navigate = useNavigate();

  const { data: bloodgroup } = useGetApi("/api/bloodgroup");
  // const { data: camptype } = useGetApi("/api/camptype");
  // const { data: organization } = useGetApi("/api/organization");
  // const { data: bagtype } = useGetApi("/api/bagtype");
  // const { data: donortype } = useGetApi("/api/donortype");
  const { data: bloodcomponents } = useGetApi("/api/bloodcomponent");
  const { isLoading: postloading, doPost, setUrl } = usePostApi("/api/bulktransfer");

  const { data: hospital } = useGetApi("/api/Hospital");
  const { data: patientType } = useGetApi("/api/patientType");

  const [formData, setFormData] = useState({
    date: "",
    // supplyno: "",
    bloodgroup: "",
    BloodComponent: "",
    quantity: "",
    organisation: "",
    remark: "",
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
      BloodGroupId: Number(formData.bloodgroup),
      BloodComponentId: Number(formData.BloodComponent),
      Qty: Number(formData.quantity),
      Organisation_Company: formData.organisation,
      Remark: formData.remark,
    });

    if (!postloading) {
      // alert("Created Successfully");
      navigate("/admin/bulk-transfer");


      // setFormData({
      //   date: formData.date,
      //   // supplyno: "",
      //   PatientName: "",
      //   donornumber: "",
      //   bloodgroup: "",
      //   BloodComponent: "",
      //   doctor: "",
      //   Hospitaltype: "",
      //   PatientType: "",
      //   paymentmode: "",
      //   amount: "",
      //   receipt_number: "",
      //   againstDonar: "",
      // })
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
            <h1 className="Heading">Bulk Transfer</h1>
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
                      placeholder="Name"
                      defaultValue={getCurrentDateInput()}
                      required
                      aria-label="Recipient's name"
                      aria-describedby="basic-addon2"
                      autoFocus
                    />
                  </div>
                </div>
                {/* <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Supply Number *
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      name="supplyno"
                      required
                      onChange={handleInputChange}
                      placeholder="Supply Number"
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div> */}

                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Blood Group
                  </label>
                  <div className="input-group">
                    <select
                      name="bloodgroup"
                      class="form-select"
                      required
                      onChange={handleInputChange}
                    >
                      <option value="" disabled selected>
                        BloodGroup Type
                      </option>

                      {bloodgroup &&
                        bloodgroup.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Blood Component
                  </label>

                  <div className="input-group">
                    <select
                      name="BloodComponent"
                      class="form-select"
                      required
                      onChange={handleInputChange}
                    >
                      <option value="" selected hidden>
                        Blood Component
                      </option>

                      {bloodcomponents &&
                        bloodcomponents.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Quantity
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      onChange={handleInputChange}
                      placeholder="Enter Quantity"
                      required
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Organisation/Company
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      name="organisation"
                      onChange={handleInputChange}
                      placeholder="Enter Organisation/Company"
                      required
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Remark
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      name="remark"
                      onChange={handleInputChange}
                      placeholder="Enter Remark"
                      required
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
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

export default AddBulkTransfer;
