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




const EditBulkTransfer = () => {

    const { id } = useParams();

    const navigate = useNavigate();
  
    const { data: bloodgroup } = useGetApi("/api/bloodgroup");
    // const { data: camptype } = useGetApi("/api/camptype");
    // const { data: organization } = useGetApi("/api/organization");
    // const { data: bagtype } = useGetApi("/api/bagtype");
    // const { data: donortype } = useGetApi("/api/donortype");
    const { data: bloodcomponents } = useGetApi("/api/bloodcomponent");
    // const { isLoading: postloading, doPost, setUrl } = usePostApi("/api/issue");
    const { isLoading: puloading, doPut } = usePutApi(`/api/bulktransfer/${id}`);
  
    const { data: hospital } = useGetApi("/api/Hospital");
    const { data: patientType } = useGetApi("/api/patientType");
  
    const [date, setdate] = useState("");
    // const [supplyno, setsupplyno] = useState("");
    const [bloodgroupdata, setbloodgroupdata] = useState("");
    const [BloodComponent, setBloodComponent] = useState("");
   
    const [quantity, setquantity] = useState("");
    const [organisation, setorganisation] = useState("");
    const [remark, setremark] = useState("");
    // const [paymentmode, setpaymentmode] = useState("");
    // const [amount, setamount] = useState("");
    // const [receipt_number, setreceipt_number] = useState("");
    // const [againstDonar, setagainstDonar] = useState("");
    // const [displayIndex, setdisplayIndex] = useState("");

    useEffect(() => {
      getData();
    }, []);
  
    const getData = async () => {
      try {
        const { data } = await axiosInstance.get(`/api/bulktransfer/${id}`, {
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
          setbloodgroupdata(data.bloodGroupId)
          setBloodComponent(data.bloodComponentId)
          setquantity(data.qty)
          setorganisation(data.organisation_Company)
          setremark(data.remark)
        
        }
      } catch (error) {
        alert(error.response.data.message)
      }
    };
  
    const handleIssue = async (e) => {
      e.preventDefault();
      try {
        await doPut({
          
          Date: Number(date.split("-").join("")),
          BloodGroupId:Number(bloodgroupdata),
          BloodComponentId:Number(BloodComponent),
          Qty:Number(quantity),
          Organisation_Company:organisation,
          Remark:remark
        });
  
        if (!puloading) {
          navigate("/admin/bulk-transfer");
        }
      } catch (error) {
        alert(error.response.data.message)
      }
    };
  
    // c
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
            <h1 className="Heading">Edit Bulk Transfer</h1>
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
                      name="doi"
                      value={date}
                      onChange={(e) => setdate(e.target.value)}
                      placeholder="Date"
                      aria-label="Recipient's name"
                      aria-describedby="basic-addon2"
                      autoFocus
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
                      onChange={(e)=>setbloodgroupdata(e.target.value)}
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
                      value={BloodComponent}
                      onChange={(e)=>setBloodComponent(e.target.value)}
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
                      value={quantity}
                      name="quantity"
                      onChange={(e)=>setquantity(e.target.value)}
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
                      value={organisation}
                      onChange={(e)=>setorganisation(e.target.value)}
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
                      value={remark}
                      onChange={(e)=>setremark(e.target.value)}
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
  )
}

export default EditBulkTransfer