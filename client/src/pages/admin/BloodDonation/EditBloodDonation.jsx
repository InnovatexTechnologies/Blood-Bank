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

const EditBloodDonation = () => {
  const { id } = useParams();

  const navigate = useNavigate()

  const {
    data: donationtype,
    isLoading,
    error,
  } = useGetApi("/api/donationtype");
  const { data: bloodgroup } = useGetApi("/api/bloodgroup");
  const { data: camptype } = useGetApi("/api/camptype");
  const { data: organization } = useGetApi("/api/organization");
  const { data: bagtype } = useGetApi("/api/bagtype");
  const { data: donortype } = useGetApi("/api/donortype");
  const { data: particulardata, doFetch } = useGetApi("/api/donor");
  const { isLoading: puloading, doPut } = usePutApi(`/api/donor/${id}`);


  


  const [name, setname] = useState("");
  const [date, setdate] = useState("");
  const [phone, setphone] = useState("");
  const [donationtypevalue, setdonationtypevalue] = useState("");
  const [donornumber, setdonornumber] = useState("");
  const [bloodgroupdata, setbloodgroup] = useState("");
  const [camptypedata, secamptypedata] = useState("");
  const [organizationdata, setorganizationdata] = useState("");
  const [donortypedata, sedonortypedata] = useState("");
  const [bagtypedata, setbagdata] = useState("");
  const [gender, setgender] = useState("");
  const [age, setage] = useState();
  const [address, setaddress] = useState();
  // const [displayIndex, setdisplayIndex] = useState("");


  


  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/donor/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });


      
      



      if (data) {
        setname(data.name);
        setdate(data.dod);
        setphone(data.mobile);
        setdonationtypevalue(data.donationTypeId);
        setdonornumber(data.donorNo);
        setbloodgroup(data.bloodGroupId);
        secamptypedata(data.campTypeId);
        setorganizationdata(data.organizationId);
        sedonortypedata(data.donorTypeId);
        setbagdata(data.bagTypeId);
        setdate(`${data.dod.toString().slice(0, 4)}-${data.dod.toString().slice(4, 6)}-${data.dod.toString().slice(6)}`);
        setgender(data.gender)
        setage(data.age)
        setaddress(data.address)
        // setdisplayIndex(data.displayIndex)
      }
    } catch (error) {
      console.log(error,"wwww")
      
      console.log("ssss",error.response.data.message)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      await doPut({
        dod: Number(date.split("-").join("")),
        bloodGroupId: Number(bloodgroupdata),
        bagTypeId: Number(bagtypedata),
        name: name,
        mobile: phone,
        donationTypeId:  Number(donationtypevalue) ,
        organizationId: donationtypevalue == 3 ? Number(organizationdata) : Number(0),
        campTypeId:  donationtypevalue == 3 ?  Number(camptypedata) : Number(0)    ,
        donorTypeId: Number(donortypedata),
        donorNo: donornumber,
        Gender:gender,
        Age:Number(age),
        Address:address
        // displayIndex: displayIndex === "" ? Number(0) : Number(displayIndex)
      })

      if (!puloading) {
        navigate("/admin/BloodDonation")
      }









    } catch (error) {
      console.log(error,"wwww")
      
      console.log("ssss",error)

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
            <h1 className="Heading">Edit Blood Donation</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="p-2 ReferralLeadModal-Content">
              <div
                className="row "
                style={{
                  rowGap: "8px",
                }}
              >
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Date Of Donation
                  </label>
                  <div className="input-group ">
                    <input
                      type="date"
                      className="form-control"
                      required
                      value={date}
                      name="date"
                      placeholder="Name"
                      aria-label="Recipient's name"
                      onChange={(e) => setdate(e.target.value)}
                      aria-describedby="basic-addon2"
                      autoFocus
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Donor Name
                  </label>
                  <div className="input-group ">
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={name}
                      name="name"
                      onChange={(e) => setname(e.target.value)}
                      placeholder="Name"
                      aria-label="Recipient's name"
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
                      value={gender}
                      name="bagtype"
                      class="form-select"
                      required
                      onChange={(e) => setgender(e.target.value)}
                    >
                      <option selected hidden>
                        Gender
                      </option>
                      
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Donor Phone Number *
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      required
                      name="phone"
                      value={phone}
                      onChange={(e) => setphone(e.target.value)}
                      placeholder="Phone Number"
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
                      value={bloodgroupdata}
                      name="bloodgroup"

                      class="form-select"
                      required
                      onChange={(e) => setbloodgroup(e.target.value)}
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
                <div class="col-6">
                    <label for="exampleInputEmail1" class="form-label">
                      Age
                    </label>
                    <input
                      type="number"
                      min={0}
                      class="form-control"
                      id="exampleInputEmail1"
                      required
                      value={age}
                      name="age"
                      onChange={(e)=>setage(e.target.value)}
                      aria-describedby="emailHelp"
                    />
                  </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Bag Type
                  </label>
                  <div className="input-group">
                    <select
                      value={bagtypedata}
                      name="bagtype"
                      class="form-select"
                      required
                      onChange={(e) => setbagdata(e.target.value)}
                    >
                      <option selected hidden>
                        Bag Type
                      </option>
                      {bagtype &&
                        bagtype.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>
                </div>

{/* 
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Donor Number *
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={donornumber}
                      name="donornumber"
                      readOnly
                      onChange={(e) => setdonornumber(e.target.value)}
                      placeholder="Donor Number"
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>
                */}
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Donation Type
                  </label>
                  <div className="input-group">
                    <select
                      name="donationtype"
                      class="form-select"
                      required
                      value={donationtypevalue}
                      onChange={(e) => setdonationtypevalue(e.target.value)}
                    >
                      <option selected hidden>
                        Donation Type
                      </option>
                      {donationtype &&
                        donationtype.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                      {/* <option selected hidden>
                    Donation Type
                    </option> */}
                    </select>
                  </div>
                </div>
                

                {
                  donationtypevalue == 3 && <>
                    <div className="col-6">
                      <label htmlFor="exampleInputEmail1" className="form-label">
                        Camp Type
                      </label>
                      <div className="input-group">
                        <select
                          name="camptype"
                          class="form-select"
                          required
                          value={camptypedata}
                          onChange={(e) => secamptypedata(e.target.value)}
                        >
                          <option selected hidden>
                            Camp Type
                          </option>

                          {camptype &&
                            camptype.map((p) => (
                              <option value={p.id}>{p.name}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-6">
                      <label htmlFor="exampleInputEmail1" className="form-label">
                        Organization Name
                      </label>
                      <div className="input-group">
                        <select
                          value={organizationdata}
                          name="organization"
                          onChange={(e) => setorganizationdata(e.target.value)}
                          class="form-select"
                          required

                        >
                          <option selected hidden>
                            Organization Name
                          </option>
                          {organization &&
                            organization.map((p) => (
                              <option value={p.id}>{p.name}</option>
                            ))}
                        </select>
                      </div>
                    </div>


                  </>
                }

                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Donor Type
                  </label>
                  <div className="input-group">
                    <select
                      value={donortypedata}
                      name="donortype"
                      class="form-select"
                      required
                      onChange={(e) => sedonortypedata(e.target.value)}
                    >
                     
                      <option  selected disabled>
                        Donor Type
                      </option>
                      {donortype &&
                        donortype.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                    </select>
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
                      value={displayIndex}
                      onChange={(e) => setdisplayIndex(e.target.value)}
                      placeholder="Display Index"
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div> */}

                
<div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                   Address
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      // required
                      value={address}
                      name="address"
                     
                      onChange={(e) => setaddress(e.target.value)}
                      placeholder="Enter Address"
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
            </div>
          </form>
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default EditBloodDonation;
