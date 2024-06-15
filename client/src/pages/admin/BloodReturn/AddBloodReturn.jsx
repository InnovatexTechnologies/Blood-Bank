import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useGetApi, usePostApi } from "../../../utils/Customhooks/ApiCalls";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import Footer from "../../../components/footer/Footer";


const AddBloodReturn = () => {
  const navigate = useNavigate()

  
  const {
    data: donationtype,
    isLoading,
    error,
    doFetch,
  } = useGetApi("/api/donationtype");


  

  const { data: bloodgroup } = useGetApi("/api/bloodgroup");
  const { data: camptype } = useGetApi("/api/camptype");
  const { data: organization } = useGetApi("/api/organization");
  const { data: bagtype } = useGetApi("/api/bagtype");
  const { data: donortype } = useGetApi("/api/donortype");
  const { data: bloodcomponents } = useGetApi("/api/bloodcomponent");
  const { isLoading: postloading, doPost, setUrl,data } = usePostApi("/api/returnstock");

  const { data: hospital } = useGetApi("/api/Hospital");
  const { data: patientType } = useGetApi("/api/patientType");

  const [formData, setFormData] = useState({
    dor: "",
    supplyno: "",
    PatientName: "",
    donornumber: "",
    bloodgroup: "",
    BloodComponent: "",
    doctor: "",
    Hospitaltype: "",
    PatientType: "",
    paymentmode: "",
    amount: "",
    receipt_number: "",
    againstDonar: "",
    // displayindex: ""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };


  let componentsprice = 0

  if (bloodcomponents && formData.BloodComponent !== " ") {
    
    const findamount = bloodcomponents.find((p) => p.id === Number(formData.BloodComponent))
    componentsprice = findamount?.price 
  }

  
  const handleIssue = async (e) => {
    e.preventDefault();

    await doPost({
      "dor":  formData.dor === ""?Number(getCurrentDateInput().split("-").join("")):Number(formData.dor.split("-").join("")),
      // patientName: formData.PatientName,
      // amount: formData.paymentmode === "Paid" ? Number(componentsprice):Number(0),
      SupplyNo: Number(formData.supplyno),
      donorNo: formData.donornumber,
      // receiptNo: Number(formData.receipt_number),
      // againstDonor: formData.againstDonar,
      // free_Paid: formData.paymentmode,
      // hospitalId: Number(formData.Hospitaltype),
      bloodGroupId: Number(formData.bloodgroup),
      bloodComponentId: Number(formData.BloodComponent),
      // patientTypeId: Number(formData.PatientType),
      // displayIndex: 2,
      // institution_Doctor: formData.doctor,
      // DisplayIndex: formData.displayindex === "" ? Number(0) : Number(formData.displayindex)
    })

    


    if (!postloading) {
      navigate("/admin/blood-return")
    }


  }



  
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
            <h1 className="Heading">Blood Return</h1>
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
                      name="dor"
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
                <div className="col-6">
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
                </div>
                {/* <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Patient Name
                  </label>
                  <div className="input-group ">
                    <input
                      type="text"
                      required
                      className="form-control"
                      name="PatientName"
                      onChange={handleInputChange}
                      placeholder="Patient Name"
                      aria-label="Recipient's name"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div> */}
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Donar Number *
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      required
                      className="form-control"
                     
                      name="donornumber"
                      onChange={handleInputChange}
                      placeholder="Donar Number"
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>
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
                      <option value=""  disabled selected  >
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
                      <option value=""  selected hidden>
                        Blood Component
                      </option>

                      {bloodcomponents &&
                        bloodcomponents.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>
                </div>
                {/* <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Doctor/Institute *
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      name="doctor"
                      onChange={handleInputChange}
                      placeholder="Doctor"
                      required
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div> */}
                {/* <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Hospital Type
                  </label>
                  <div className="input-group">
                    <select
                      name="Hospitaltype"
                      class="form-select"
                      required
                      onChange={handleInputChange}
                    >
                      <option selected hidden value="">
                        Hospital Type
                      </option>

                      {hospital &&
                        hospital.map((p) => (
                          <option value={p.id}>{p.type}</option>
                        ))}
                    </select>
                  </div>
                </div> */}
                {/* <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Patient Type
                  </label>
                  <div className="input-group">
                    <select
                      name="PatientType"
                      class="form-select"
                      required
                      onChange={handleInputChange}
                    >
                      <option value=""  selected hidden>
                        Patient Type
                      </option>

                      {patientType &&
                        patientType.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>
                </div> */}
                {/* <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Payment Mode
                  </label>
                  <div className="input-group">
                    <select
                      name="paymentmode"
                      class="form-select"
                      required
                      onChange={handleInputChange}
                    >
                      <option value="" selected hidden>
                        Select Payment Mode
                      </option>
                      <option value="Free">Free</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div> */}

                {/* {
                  formData.paymentmode === "Paid" && (
                    <>
                      <div className="col-6">
                        <label htmlFor="exampleInputEmail1" className="form-label">
                          Amount
                        </label>
                        <div className="input-group ">
                          <input
                            type="number"
                            className="form-control"
                            min={0}
                            value={componentsprice}
                            name="amount"
                            // onChange={handleInputChange}
                            placeholder="Amount"
                            readOnly
                            aria-label="Recipient's name"
                            aria-describedby="basic-addon2"
                          />
                        </div>
                      </div>
                      <div className="col-6">
                        <label htmlFor="exampleInputEmail1" className="form-label">
                          Receipt Number
                        </label>
                        <div className="input-group ">
                          <input
                            type="number"
                            className="form-control"
                            min={0}
                            required
                            name="receipt_number"
                            onChange={handleInputChange}
                            placeholder="Receipt Number"
                            aria-label="Recipient's name"
                            aria-describedby="basic-addon2"
                          />
                        </div>
                      </div>


                    </>


                  )
                } */}

                {/* <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Against Donar
                  </label>
                  <div className="input-group">
                    <select
                      name="againstDonar"
                      class="form-select"
                      required
                      onChange={handleInputChange}
                    >
                      <option value="" selected hidden>
                        Against Donar
                      </option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div> */}

                {/* <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Display Index
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"

                      min={0}
                      name="displayindex"
                      onChange={handleInputChange}
                      placeholder="Display Index"
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div> */}
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
  )
}

export default AddBloodReturn