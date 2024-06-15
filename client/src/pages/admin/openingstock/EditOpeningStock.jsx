import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { usePostApi, useGetApi } from "../../../utils/Customhooks/ApiCalls";
import Footer from "../../../components/footer/Footer";

const EditOpeningStock = () => {
  const { id } = useParams();

  const { data: bloodgroup } = useGetApi("/api/bloodgroup");
  const { data: bloodcomponents } = useGetApi("/api/bloodcomponent");

  const [loader, setloader] = useState(false);

  const navigate = useNavigate();
  const [bloodGroupName, setbloodGroupName] = useState();
  const [bloodComponentName, sebloodComponentName] = useState();
  const [donorNo, setdonorNo] = useState();
  const [date, setdate] = useState("");
  // const [displayIndex, setdisplayIndex] = useState()

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/openingstock/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });

      console.log("dd", data);

      if (data) {
        setbloodGroupName(data.bloodGroupId);
        // setdisplayIndex(data.displayIndex)
        sebloodComponentName(data.bloodComponentId);
        setdonorNo(data.donorNo);
        setdate( `${data.date.toString().slice(0, 4)}-${data.date
            .toString()
            .slice(4, 6)}-${data.date.toString().slice(6)}`);

        // setbloodGroupName(data.)
      }
    } catch (error) {}
  };

  const handleOpeningStock = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(
        `/api/OpeningStock/${id}`,
        {
          bloodGroupId: Number(bloodGroupName),
          bloodComponentId: Number(bloodComponentName),
          donorNo: donorNo,
          date: Number(date.split("-").join("")),
          // displayIndex:Number(displayIndex)
        },
        {
          headers: {
            Auth: localStorage.getItem("token"),
          },
        }
      );

      if (res && res.status === 200) {
        alert("updated Successfully");

        navigate("/admin/openingstock");
      }
    } catch (error) {
      alert(error.response.data.message);
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
          <div className="container text-white">
            <h2> </h2>
          </div>
        </div>
         <div className="container " style={{minHeight:"80vh"}}>
          <div className="text-center">
            <h2>Edit Blood Opening Stock</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">
              <form onSubmit={handleOpeningStock}>
                <br />

                <div className="row">
                  {/* <div class="col-6">
                                        <label for="exampleInputEmail1" class="form-label">Display Index</label>
                                        <input type="number" class="form-control" min={0} id="exampleInputEmail1" name="displayIndex" value={displayIndex} onChange={(e)=>setdisplayIndex(e.target.value)} aria-describedby="emailHelp" />
                                    </div> */}
                  <div className="col-6">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Date
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
                  <div class="col-6">
                    <label for="exampleInputEmail1" class="form-label">
                      Blood Group Name
                    </label>
                    <select
                      name="bloodGroupName"
                      class="form-select"
                      required
                      value={bloodGroupName}
                      onChange={(e) => setbloodGroupName(e.target.value)}
                    >
                      <option selected hidden>
                        Blood Group Name
                      </option>
                      {bloodgroup &&
                        bloodgroup.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>
                  <div class="col-6">
                    <label for="exampleInputEmail1" class="form-label">
                      Blood Components Name
                    </label>
                    <select
                      name="bloodComponentName"
                      class="form-select"
                      required
                      value={bloodComponentName}
                      onChange={(e) => sebloodComponentName(e.target.value)}
                    >
                      <option selected hidden>
                        Blood Components Name
                      </option>
                      {bloodcomponents &&
                        bloodcomponents.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>
                  <div class="col-6">
                    <label for="exampleInputEmail1" class="form-label">
                    Donor No.
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="exampleInputEmail1"
                      name="donorNo"
                      value={donorNo}
                      onChange={(e) => setdonorNo(e.target.value)}
                      aria-describedby="emailHelp"
                    />
                  </div>
                </div>
                <button type="submit" class="btn mybtn  text-white mt-2">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default EditOpeningStock;
