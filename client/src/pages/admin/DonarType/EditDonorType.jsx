import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import Footer from "../../../components/footer/Footer";

const EditDonorType = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [DonorType, setDonorType] = useState();
  const [DisplayIndex, setDisplayIndex] = useState("");

  useEffect(() => {
    fetchdata();
  }, []);
  

  const fetchdata = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/DonorType/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });

    

      if (data) {
        setDonorType(data.name);
        setDisplayIndex(data?.displayIndex || 0);
      }
    } catch (error) {
      
    }
  };

  const handlesubmit = async () => {
   
    try {
      const res = await axiosInstance.put(
        `/api/DonorType/${id}`,
        {
          name: DonorType,
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

        navigate("/admin/DonorType");
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
          <div className="container text-white">
            <h2> </h2>
          </div>
        </div>
         <div className="container " style={{minHeight:"80vh"}}>
          <div className="text-center">
            <h2>Edit DonorType</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">
              <br />
              <div className="row">
                <div class="col">
                  <label for="exampleInputEmail1" class="form-label">
                    Donor Type
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="exampleInputEmail1"
                    name="bloodgroupname"
                    onChange={(e) => setDonorType(e.target.value)}
                    aria-describedby="emailHelp"
                    value={DonorType}
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

              {/* 
                {
                  loading ? <>
                    <button type="submit" class="btn mybtn  text-white mt-2 disabled">
                      <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </button>
                  </> : <button type="submit" class="btn mybtn  text-white mt-2">Submit</button>
                } */}

              <button
                type="button"
                class="btn mybtn  text-white mt-2"
                onClick={()=>handlesubmit()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default EditDonorType;
