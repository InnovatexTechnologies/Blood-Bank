import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import Footer from "../../../components/footer/Footer";

const AddBloodComponents = () => {
  const navigate = useNavigate();
  const [bloodComponent, setBloodComponent] = useState();
  const [DisplayIndex, setDisplayIndex] = useState();

  const addBloodGroupComponent = async () => {
    try {
      const res = await axiosInstance.post(
        `/api/bloodcomponent`,
        {
          name: bloodComponent,
          displayIndex: Number(DisplayIndex),
        },
        {
          headers: {
            Auth: localStorage.getItem("token"),
          },
        }
      );
      if (res && res.status === 200) {
        alert("Created Successfully");
        navigate("/admin/blood-components");
      }

      

      // if (data) {
      //   alert("Blood Group Added Successfully")
      // }

      // if (data.success) {
      //   setapicall({ ...apicall, loading: false })
      //   alert(data.message)
      //   navigate("/admin/blood-components")
      // }
      // 
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
            <h2>Add Blood Components</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">
            
                <br />
                <div className="row">
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
                  <div class="col">
                    <label for="exampleInputEmail1" class="form-label">
                      Add Blood Components
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="exampleInputEmail1"
                    
                      onChange={(e) => setBloodComponent(e.target.value)}
                      value={bloodComponent}
                      aria-describedby="emailHelp"
                    />
                  </div>
                </div>

                <button type="Button" class="btn mybtn  text-white mt-2" onClick={addBloodGroupComponent}>
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

export default AddBloodComponents;
