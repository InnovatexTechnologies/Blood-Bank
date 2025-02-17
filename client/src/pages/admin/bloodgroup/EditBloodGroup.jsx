import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import Footer from "../../../components/footer/Footer";

const EditBloodGroup = () => {
  const { id } = useParams();
  const [DisplayIndex, setDisplayIndex] = useState("");
  const [loader, setloader] = useState(false);

  const navigate = useNavigate();
  const [bloodgroup, setbloodgroup] = useState();

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/bloodgroup/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });
      
      if (data) {
        setbloodgroup(data?.name);
        setDisplayIndex(data?.displayIndex || 0);
      }
    } catch (error) {
      
    }
  };

  const handlegymSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(
        `/api/bloodgroup/${id}`,
        {
          name: bloodgroup,
          displayIndex: DisplayIndex === "" ?Number(0): Number(DisplayIndex),
        },
        {
          headers: {
            Auth: localStorage.getItem("token"),
          },
        }
      );

      if (res && res.status === 200) {
        alert("updated Successfully");

        navigate("/admin/bloodgroup");
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
            {/* <h2>Blood Bank</h2> */}
          </div>
        </div>
         <div className="container " style={{minHeight:"80vh"}}>
          <div className="text-center">
            <h2>Edit Blood Group</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8">
              <form onSubmit={handlegymSubmit}>
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
                      value={bloodgroup}
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
                      value={DisplayIndex}
                      onChange={(e) => setDisplayIndex(e.target.value)}
                      aria-describedby="emailHelp"
                    />
                  </div>
                </div>
                {loader ? (
                  <>
                    <button
                      type="submit"
                      class="btn mybtn  text-white mt-2 disabled"
                    >
                      Updating Please Wait{" "}
                    </button>
                  </>
                ) : (
                  <>
                    <button type="submit" class="btn mybtn  text-white mt-2">
                      Submit
                    </button>
                  </>
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

export default EditBloodGroup;
