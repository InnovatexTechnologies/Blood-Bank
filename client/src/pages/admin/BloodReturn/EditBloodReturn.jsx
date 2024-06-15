import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import {
  useGetApi,
  usePostApi,
  usePutApi,
} from "../../../utils/Customhooks/ApiCalls";
import Footer from "../../../components/footer/Footer";


const EditBloodReturn = () => {
  const { id } = useParams();

  const navigate = useNavigate()


  const { data: bloodgroup } = useGetApi("/api/bloodgroup");
  const { data: camptype } = useGetApi("/api/camptype");
  const { data: organization } = useGetApi("/api/organization");
  const { data: bagtype } = useGetApi("/api/bagtype");
  const { data: donortype } = useGetApi("/api/donortype");
  const { data: bloodcomponents } = useGetApi("/api/bloodcomponent");
  const { isLoading: postloading, doPost, setUrl } = usePostApi("/api/returnstock");
  const { isLoading: puloading, doPut } = usePutApi(`/api/returnstock/${id}`);

  const { data: hospital } = useGetApi("/api/Hospital");
  const { data: patientType } = useGetApi("/api/patientType");


  const [dor, setdor] = useState("");
  const [supplyno, setsupplyno] = useState("");
  const [PatientName, setPatientName] = useState("");
  const [donornumber, setdonornumber] = useState("");
  const [bloodgroupdata, setbloodgroupdata] = useState("");
  const [BloodComponent, setBloodComponent] = useState("");
  const [doctor, setdoctor] = useState("");
  const [Hospitaltype, setHospitaltype] = useState("");
  const [PatientType, setPatientType] = useState("");
  const [paymentmode, setpaymentmode] = useState("");
  const [amount, setamount] = useState("");
  const [receipt_number, setreceipt_number] = useState("");
  const [againstDonar, setagainstDonar] = useState("");
  // const [displayIndex, setdisplayIndex] = useState("");



  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/returnstock/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });

      


      if (data) {
        setdor(`${data.dor.toString().slice(0, 4)}-${data.dor.toString().slice(4, 6)}-${data.dor.toString().slice(6)}`)
        setsupplyno(data.supplyNo)
        setPatientName(data.patientName)
        setdonornumber(data.donorNo)
        setbloodgroupdata(data.bloodGroupId)
        setBloodComponent(data.bloodComponentId)
        setdoctor(data.institution_Doctor)
        setHospitaltype(data.hospitalId)
        setPatientType(data.patientTypeId)
        setpaymentmode(data.free_Paid)
        setamount(data.amount)
        setreceipt_number(data.receiptNo)
        setagainstDonar(data.againstDonor)
        // setdisplayIndex(data.displayIndex)
      }
    } catch (error) {
      alert(error.response.data.message)
      
    }
  };


  
  let componentsprice = 0

  if (bloodcomponents && BloodComponent !== " ") {
    
    const findamount = bloodcomponents.find((p) => p.id === Number(BloodComponent))
    componentsprice = findamount?.price
  }


  const handleReturn = async (e) => {
    e.preventDefault();
    try {

      await doPut({
        // againstDonor: againstDonar,
        // amount: paymentmode === "Paid" ? Number(componentsprice) : Number(0),
        bloodComponentId: Number(BloodComponent),
        bloodGroupId: Number(bloodgroupdata),
        // displayIndex:Number(displayIndex),
        dor: Number(dor.split("-").join("")),
        donorNo: donornumber,
        // free_Paid: paymentmode,
        // hospitalId: Number(Hospitaltype),
        // institution_Doctor: doctor,
        // patientName: PatientName,
        // patientTypeId: Number(PatientType),
        // receiptNo: Number(receipt_number),
        supplyNo: Number(supplyno),
        // displayIndex: displayIndex === ""?Number(0):Number(displayIndex)
      })

      if (!puloading) {
        navigate("/admin/blood-return")
      }


    } catch (error) {

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
            <h1 className="Heading">Edit Blood Return</h1>
          </div>

          <div className="p-2 ReferralLeadModal-Content">
            <form onSubmit={handleReturn}>
              <div
                className="row "
                style={{
                  rowGap: "8px",
                }}
              >

                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Date Of Return
                  </label>
                  <div className="input-group ">
                    <input
                      type="date"
                      className="form-control"
                      name="dor"
                      value={dor}
                      onChange={(e) => setdor(e.target.value)}
                      placeholder="Name"
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
                      value={supplyno}
                      onChange={(e) => setsupplyno(e.target.value)}
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
                      className="form-control"
                      name="PatientName"
                      value={PatientName}
                      required
                      onChange={(e) => setPatientName(e.target.value)}
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
                      className="form-control"
                      required
                      name="donornumber"
                      value={donornumber}
                      onChange={(e) => setdonornumber(e.target.value)}
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
                      value={bloodgroupdata}
                      required
                      onChange={(e) => setbloodgroupdata(e.target.value)}
                    >
                      <option selected hidden>
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
                      value={BloodComponent}
                      onChange={(e) => setBloodComponent(e.target.value)}
                    >
                      <option selected hidden>
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
                      value={doctor}
                      onChange={(e) => setdoctor(e.target.value)}
                      placeholder="Doctor"
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
                      value={Hospitaltype}
                      onChange={(e) => setHospitaltype(e.target.value)}
                    >
                      <option selected hidden>
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
                      value={PatientType}
                      onChange={(e) => setPatientType(e.target.value)}
                    >
                      <option selected hidden>
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
                      value={paymentmode}
                      onChange={(e) => setpaymentmode(e.target.value)}
                    >
                      <option selected hidden>
                        Select Payment Mode
                      </option>
                      <option value="Free">Free</option>
                      <option value="Paid">Paid</option>
                    </select>
                  </div>
                </div> */}

                {/* {
                  paymentmode === "Paid" && (
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
                            name="amount"
                            value={componentsprice}
                            readOnly
                            onChange={(e) => setamount(e.target.value)}
                            placeholder="Amount"
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
                            name="receipt_number"
                            value={receipt_number}
                            onChange={(e) => setreceipt_number(e.target.value)}
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
                      value={againstDonar}
                      onChange={(e) => setagainstDonar(e.target.value)}
                    >
                      <option selected hidden>
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
                      value={displayIndex}
                      onChange={(e) => setdisplayIndex(e.target.value)}
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

export default EditBloodReturn