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
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import Footer from "../../../components/footer/Footer";

const EditDeferral = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [date, setdate] = useState("");
  const [name, setname] = useState("");
  const [gender, setgender] = useState("");
  const [address, setaddress] = useState("");
  const [mobno, setmobno] = useState("");
  const [reason, setreason] = useState("");

  const { isLoading: puloading, doPut } = usePutApi(`/api/deferral/${id}`);
  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/deferral/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });

      

      if (data) {
        setdate(
          `${data.date
            .toString().slice(0, 4)}-${data.date

            .toString()
            .slice(4, 6)}-${data.date
              .toString().slice(6)}`
        );
        setaddress(data.address)
        setname(data.name)
        setgender(data.gender)
        setmobno(data.mobileNo)
        setreason(data.reason)

        // setdisplayIndex(data.displayIndex)
      }
    } catch (error) {}
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await doPut({
        Date: Number(date.split("-").join("")),
        Name:name,
        Gender:gender,
        Address:address,
        MobileNo:mobno,
        Reason:reason
        // displayIndex: displayIndex === ""?Number(0):Number(displayIndex)
      });

      if (!puloading) {
        navigate("/admin/deferral-donor");
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
                      onChange={(e) => setdate(e.target.value)}
                      placeholder="Date"
                      value={date}
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
                      value={name}
                      onChange={(e) => setname(e.target.value)}
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
                      value={gender}
                      required
                      onChange={(e)=>setgender(e.target.value)}
                    >
                      <option selected hidden>
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
                      value={address}
                      onChange={(e)=>setaddress(e.target.value)}
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
                      value={mobno}
                      onChange={(e)=>setmobno(e.target.value)}
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
                      value={reason}
                      required
                      onChange={(e)=>setreason(e.target.value)}
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

export default EditDeferral;
