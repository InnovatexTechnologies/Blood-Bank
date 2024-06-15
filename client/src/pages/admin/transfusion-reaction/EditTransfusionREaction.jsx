import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import Select from "react-select";

import {
  useGetApi,
  usePostApi,
  usePutApi,
} from "../../../utils/Customhooks/ApiCalls";
import Footer from "../../../components/footer/Footer";

const EditTransfusionReaction = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { data: hospital } = useGetApi("/api/Hospital");
  const { data: patientTypedata } = useGetApi("/api/patientType");
  const { data: bloodcomponents } = useGetApi("/api/bloodcomponent");
  const { data: bloodgroup } = useGetApi("/api/bloodgroup");

  const { isLoading: puloading, doPut } = usePutApi(`/api/Transfusion/${id}`);

  const [supplyNo, setsupplyNo] = useState();
  const [hospitalname, sethospitalname] = useState();
  const [hospitalType, sethospitalType] = useState();
  const [patientType, setpatientType] = useState();
  const [previousDonorNo, setpreviousDonorNo] = useState();
  const [previousComponent, setpreviousComponent] = useState();
  const [newdonorNumber, setnewdonorNumber] = useState();
  const [newcomponent, setnewcomponent] = useState();
  const [reason, setreason] = useState();
  const [bloodgroupId, setbloodgroupId] = useState();
  const [date, setdate] = useState();

  const [selectedReason, setSelectedReason] = useState({});

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

  console.log("ddd", selectedReason);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/Transfusion/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });

      if (data) {
        setdate(
          `${data.date.toString().slice(0, 4)}-${data.date
            .toString()
            .slice(4, 6)}-${data.date.toString().slice(6)}`
        );
        setsupplyNo(data.supplyNo);
        sethospitalname(data.hospitalName);
        sethospitalType(data.hospitalType);
        setpatientType(data.patientType);
        setpreviousDonorNo(data.previousDonorNo);
        setpreviousComponent(data.previousComponentId);
        setnewdonorNumber(data.newDonorNo);
        setnewcomponent(data.newComponentId);
        // setreason(data.reason);
        console.log("sssss",data.reason)
        let resonfind = resoncombo.find((p) => p.value === data.reason);
        console.log("12345678", resonfind);
        setSelectedReason(resonfind);

        // console.log("data.reason", data.reason);

        setbloodgroupId(data.bloodGroupId);
      }
    } catch (error) {}
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await doPut({
        SupplyNo: supplyNo,
        HospitalName: hospitalname,
        HospitalType: Number(hospitalType),
        PatientType: Number(patientType),
        PreviousDonorNo: Number(previousDonorNo),
        PreviousComponentId: Number(previousComponent),
        NewDonorNo: Number(newdonorNumber),
        NewComponentId: Number(newcomponent),
        Reason: selectedReason.value,
        bloodGroupId: Number(bloodgroupId),
        Date: Number(date.split("-").join("")),
      });

      if (!puloading) {
        navigate("/admin/transfusion-reaction");
      }
    } catch (error) {}
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
                      value={date}
                      onChange={(e) => setdate(e.target.value)}
                      placeholder="Set Date"
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
                      value={supplyNo}
                      onChange={(e) => setsupplyNo(e.target.value)}
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
                      value={hospitalname}
                      onChange={(e) => sethospitalname(e.target.value)}
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
                      value={hospitalType}
                      onChange={(e) => sethospitalType(e.target.value)}
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
                      value={patientType}
                      onChange={(e) => setpatientType(e.target.value)}
                    >
                      <option value="" selected hidden>
                        Patient Type
                      </option>

                      {patientType &&
                        patientTypedata.map((p) => (
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
                      value={previousDonorNo}
                      onChange={(e) => setpreviousDonorNo(e.target.value)}
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
                      value={previousComponent}
                      required
                      onChange={(e) => setpreviousComponent(e.target.value)}
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
                      value={newdonorNumber}
                      onChange={(e) => setnewdonorNumber(e.target.value)}
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
                      value={newcomponent}
                      required
                      onChange={(e) => setnewcomponent(e.target.value)}
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
                      value={bloodgroupId}
                      required
                      onChange={(e) => setbloodgroupId(e.target.value)}
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
                      value={selectedReason}
                      // defaultValue={selectedReason}
                      onChange={setSelectedReason}
                      options={resoncombo}
                    />

                    {/* <select
                      name="reason"
                      class="form-select"
                      value={reason}
                      required
                      onChange={(e) => setreason(e.target.value)}
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
                      onChange={(e)=>setpreviousComponent(e.target.value)}
                      placeholder="Display Index"
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div> */}

                {puloading ? (
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

export default EditTransfusionReaction;
