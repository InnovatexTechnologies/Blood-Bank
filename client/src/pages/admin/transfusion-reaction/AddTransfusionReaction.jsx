import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import Select from "react-select";

import {
  useDeleteApi,
  useGetApi,
  usePostApi,
} from "../../../utils/Customhooks/ApiCalls";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import Footer from "../../../components/footer/Footer";

const AddTransfusionReaction = () => {
  const navigate = useNavigate();

  const { data: hospital } = useGetApi("/api/Hospital");
  const { data: patientType } = useGetApi("/api/patientType");
  const { data: bloodcomponents } = useGetApi("/api/bloodcomponent");
  const { data: bloodgroup } = useGetApi("/api/bloodgroup");

  const {
    isLoading: postloading,
    doPost,
    setUrl,
  } = usePostApi("/api/Transfusion");

  const [selectedReason, setSelectedReason] = useState(null);


  console.log("ddd",selectedReason)

  const [formData, setFormData] = useState({
    supplyno: "",
    hospitalname: "",
    hospitalType: "",
    patientType: "",
    previousDonorNo: "",
    previousComponent: "",
    newdonorNumber: "",
    newcomponent: "",
    // reason: "",
    bloodgroupId: "",
    date: "",
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
      SupplyNo: formData.supplyno,
      HospitalName: formData.hospitalname,
      HospitalType: Number(formData.hospitalType),
      PatientType: Number(formData.patientType),
      PreviousDonorNo: Number(formData.previousDonorNo),
      PreviousComponentId: Number(formData.previousComponent),
      NewDonorNo: Number(formData.newdonorNumber),
      NewComponentId: Number(formData.newcomponent),
      Reason: selectedReason.value,
      bloodgroupId: Number(formData.bloodgroupId),
      Date:
        formData.date === ""
          ? Number(getCurrentDateInput().split("-").join(""))
          : Number(formData.date.split("-").join("")),
    });

    if (!postloading) {
      alert("Created Successfully");
      navigate("/admin/transfusion-reaction");
    }
  };

  const resoncombo = [
    {
      id: 1,
      label: " ( IMMUNOLOGIC {< 24 HRS})    HEMOLYTIC TRASANSFUSION REACTION ",
      value: " ( IMMUNOLOGIC {< 24 HRS})    HEMOLYTIC TRASANSFUSION REACTION ",
    },
    {
      id: 2,
      label:
        "( IMMUNOLOGIC {< 24 HRS})   FEBRILE NON HEMOLYTIC TRASANSFUSION REACTION ",
      value:
        "( IMMUNOLOGIC {< 24 HRS})   FEBRILE NON HEMOLYTIC TRASANSFUSION REACTION ",
    },
    {
      id: 3,
      label: " ( IMMUNOLOGIC {< 24 HRS})   ALLERGIC",
      value: " ( IMMUNOLOGIC {< 24 HRS})   ALLERGIC",
    },
    {
      id: 4,
      label: " ( IMMUNOLOGIC {< 24 HRS})  ANAPHYLAXIS",
      value: " ( IMMUNOLOGIC {< 24 HRS})  ANAPHYLAXIS",
    },
    {
      id: 5,
      label: " ( IMMUNOLOGIC {< 24 HRS})  TRALI ",
      value: " ( IMMUNOLOGIC {< 24 HRS})  TRALI ",
    },
    {
      id: 6,
      label:
        " ( IMMUNOLOGIC {> 24 HRS}) ALLO IMMUNIZATION TO RBC,WBC,PT,PLASMA,HLA  ",
      value:
        " ( IMMUNOLOGIC {> 24 HRS}) ALLO IMMUNIZATION TO RBC,WBC,PT,PLASMA,HLA  ",
    },
    {
      id: 7,
      label: " ( IMMUNOLOGIC {> 24 HRS}) HAEMOLYTIC ",
      value: " ( IMMUNOLOGIC {> 24 HRS}) HAEMOLYTIC ",
    },
    {
      id: 8,
      label: " ( IMMUNOLOGIC {> 24 HRS}) TAGvHD ",
      value: " ( IMMUNOLOGIC {> 24 HRS}) TAGvHD ",
    },
    {
      id: 9,
      label: "  ( IMMUNOLOGIC {> 24 HRS}) POST TRANSFUSION REACTION ",
      value: "  ( IMMUNOLOGIC {> 24 HRS}) POST TRANSFUSION REACTION ",
    },
    {
      id: 10,
      label: "  ( IMMUNOLOGIC {> 24 HRS}) POST TRANSFUSION REACTION",
      value: "  ( IMMUNOLOGIC {> 24 HRS}) POST TRANSFUSION REACTION",
    },
    {
      id: 11,
      label: "  ( NONIMMUNOLOGIC {< 24 HRS}) MARKED FEVER WITH SHOCK",
      value: "  ( NONIMMUNOLOGIC {< 24 HRS}) MARKED FEVER WITH SHOCK",
    },
    {
      id: 12,
      label:
        "  ( NONIMMUNOLOGIC {< 24 HRS}) ATYPICAL REACTION WITH HYPOTENSION",
      value:
        "  ( NONIMMUNOLOGIC {< 24 HRS}) ATYPICAL REACTION WITH HYPOTENSION",
    },
    {
      id: 13,
      label: "  ( NONIMMUNOLOGIC {< 24 HRS}) AIR EMBOLISM",
      value: "  ( NONIMMUNOLOGIC {< 24 HRS}) AIR EMBOLISM",
    },
    {
      id: 14,
      label: "  ( NONIMMUNOLOGIC {< 24 HRS}) HYPOCALCAEMIA",
      value: "  ( NONIMMUNOLOGIC {< 24 HRS}) HYPOCALCAEMIA",
    },
    {
      id: 15,
      label: "   ( NONIMMUNOLOGIC {< 24 HRS}) HYPOTHERMIA",
      value: "   ( NONIMMUNOLOGIC {< 24 HRS}) HYPOTHERMIA",
    },
    {
      id: 16,
      label: " ( NONIMMUNOLOGIC {< 24 HRS}) HYPOKALEMIA AND HYPERKALEMIA",
      value: " ( NONIMMUNOLOGIC {< 24 HRS}) HYPOKALEMIA AND HYPERKALEMIA",
    },
    {
      id: 17,
      label: " ( NONIMMUNOLOGIC {> 24 HRS}) IRON OVERLOAD",
      value: " ( NONIMMUNOLOGIC {> 24 HRS}) IRON OVERLOAD",
    },
    {
      id: 18,
      label: " ( NONIMMUNOLOGIC {> 24 HRS}) TRANSFUSION TRANSMITTED DISEASES",
      value: " ( NONIMMUNOLOGIC {> 24 HRS}) TRANSFUSION TRANSMITTED DISEASES",
    },
  ];

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
            <h1 className="Heading">Transfusion/Reaction</h1>
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
                    Supply No.
                  </label>
                  <div className="input-group ">
                    <input
                      type="text"
                      required
                      className="form-control"
                      name="supplyno"
                      value={formData.supplyno}
                      onChange={handleInputChange}
                      placeholder="Enter Supply No."
                      aria-label="Recipient's name"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Hospital Name
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      required
                      className="form-control"
                      name="hospitalname"
                      value={formData.hospitalname}
                      onChange={handleInputChange}
                      placeholder="Enter Hospital Name"
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Hospital Type
                  </label>
                  <div className="input-group">
                    <select
                      name="hospitalType"
                      class="form-select"
                      required
                      value={formData.hospitalType}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled hidden>
                        Select Hospital Type
                      </option>

                      {hospital &&
                        hospital.map((p) => (
                          <option value={p.id}>{p.type}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Patient Type
                  </label>

                  <div className="input-group">
                    <select
                      name="patientType"
                      class="form-select"
                      required
                      value={formData.patientType}
                      onChange={handleInputChange}
                    >
                      <option value="" selected hidden>
                        Patient Type
                      </option>

                      {patientType &&
                        patientType.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Previous Donor Number
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      name="previousDonorNo"
                      value={formData.previousDonorNo}
                      onChange={handleInputChange}
                      placeholder="Previous Donor Number"
                      required
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Previous Component
                  </label>
                  <div className="input-group">
                    <select
                      name="previousComponent"
                      class="form-select"
                      value={formData.previousComponent}
                      required
                      onChange={handleInputChange}
                    >
                      <option selected hidden value="">
                        Previous Component
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
                    New Donor No.
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      required
                      className="form-control"
                      name="newdonorNumber"
                      value={formData.newdonorNumber}
                      onChange={handleInputChange}
                      placeholder="Enter New Donor No."
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>

                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    New Component
                  </label>
                  <div className="input-group">
                    <select
                      name="newcomponent"
                      class="form-select"
                      value={formData.newcomponent}
                      required
                      onChange={handleInputChange}
                    >
                      <option selected hidden value="">
                        New Component
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
                    Blood Group
                  </label>
                  <div className="input-group">
                    <select
                      name="bloodgroupId"
                      class="form-select"
                      value={formData.bloodgroupId}
                      required
                      onChange={handleInputChange}
                    >
                      <option selected hidden value="">
                        Select Blood Group
                      </option>

                      {bloodgroup &&
                        bloodgroup.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="col-12">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Reason
                  </label>
                  <div className="input-group">
                      <Select
                      className="col-12"
                        defaultValue={selectedReason}
                        onChange={setSelectedReason}
                        options={resoncombo}
                      />

                    {/* <select
                      name="reason"
                      class="form-select"
                      value={formData.reason}
                      required
                      onChange={handleInputChange}
                    >
                      <option selected hidden value="">
                        Select Reason
                      </option>

                      {resoncombo &&
                        resoncombo.map((p) => (
                          <>
                            <option value={p.value} key={p.id}>
                              {p.name}
                            </option>
                          </>
                        ))}

                  
                    </select> */}
                  </div>
                </div>

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

                {postloading ? (
                  <>
                    <div>
                      <button
                        class="btn "
                        disabled
                        style={{
                          background: "#880808",
                          color: "white",
                        }}
                      >
                        Loading...
                      </button>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default AddTransfusionReaction;
