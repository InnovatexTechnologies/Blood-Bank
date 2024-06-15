import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import Footer from "../../../components/footer/Footer";

const AddBloodGroup = () => {
  const navigate = useNavigate();
  const [apicall, setapicall] = useState({
    loading: false,
    error: false,
  });

  const { loading } = apicall;

  const [bloodgroup, setbloodgroup] = useState();
  const [DisplayIndex, setDisplayIndex] = useState("");

  const handlebloodSubmit = async (e) => {
    e.preventDefault();
    setapicall({ ...apicall, loading: true });
    try {
      const res = await axiosInstance.post(
        `/api/bloodgroup`,
        {
          name: bloodgroup,
          displayIndex:DisplayIndex === "" ?Number(0): Number(DisplayIndex),
        },
        {
          headers: {
            Auth: localStorage.getItem("token"),
          },
        }
      );
      
      if (res && res.status === 200) {
        alert("Created Successfully");
        setapicall({ ...apicall, loading: false });
        navigate("/admin/bloodgroup");
      }
    } catch (error) {
      setapicall({ ...apicall, loading: false });
      
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
            {/* <h2>Blood Bank</h2> */}
          </div>
        </div>
         <div className="container " style={{minHeight:"80vh"}}>
          <div className="text-center">
            {/* <h2>Add Blood Group</h2> */}
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">
              <form onSubmit={handlebloodSubmit}>
                <br />
                <div className="row">
                  
                  <div class="col">
                    <label for="exampleInputEmail1" class="form-label">
                      Blood Group Name
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="exampleInputEmail1"
                      name="ProductName"
                      onChange={(e) => setbloodgroup(e.target.value)}
                      aria-describedby="emailHelp"
                    />
                  </div>
                  <div class="col">
                    <label for="exampleInputEmail1" class="form-label">
                      Display Index
                    </label>
                    <input
                      type="number"
                      min={0}
                      class="form-control"
                      id="exampleInputEmail1"
                      name="ProductName"
                      onChange={(e) => setDisplayIndex(e.target.value)}
                      aria-describedby="emailHelp"
                    />
                  </div>
                </div>

                {loading ? (
                  <>
                    <button
                      type="submit"
                      class="btn mybtn  text-white mt-2 disabled"
                    >
                      <div class="spinner-border" role="status">
                        {/* <span class="sr-only">Loading...</span> */}
                      </div>
                    </button>
                  </>
                ) : (
                  <button type="submit" class="btn mybtn  text-white mt-2">
                    Submit
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default AddBloodGroup;
