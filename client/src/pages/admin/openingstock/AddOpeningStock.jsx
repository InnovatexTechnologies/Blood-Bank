import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { usePostApi, useGetApi } from "../../../utils/Customhooks/ApiCalls";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import Footer from "../../../components/footer/Footer";

const AddOpeningStock = () => {
  const navigate = useNavigate();

  const { data: bloodgroup } = useGetApi("/api/bloodgroup");
  const { data: bloodcomponents } = useGetApi("/api/bloodcomponent");

  const {
    data,
    doPost,
    isLoading: bloodsuccess,
    setUrl,
  } = usePostApi("/api/openingstock");

  const [formData, setFormData] = useState({
    bloodGroupName: "",
    bloodComponentName: "",
    donorNo: "",
    date: "",
    // displayIndex: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleOpeningStock = (event) => {
    event.preventDefault();

    // perform final validation
    // const hasErrors = Object.values(formErrors).some((error) => error !== "");
    // if (hasErrors) {
    //   alert("Please fix the errors in the form before submitting.");
    //   return;
    // }

    const currentdate = getCurrentDateInput();

    doPost({
      bloodGroupId: Number(formData.bloodGroupName),
      bloodComponentId: Number(formData.bloodComponentName),
      donorNo: formData.donorNo,
      date:
        formData.date === ""
          ? Number(currentdate.split("-").join(""))
          : Number(formData.date.split("-").join("")),

      // date:Number(formData.date)
      // date:formData.
      // displayIndex: Number(formData.displayIndex),
    });

    if (!bloodsuccess) {
      alert("Created Successfull");
      navigate("/admin/openingstock");
    }

    // submit the form data
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
            <h2>Add Blood Opening Stock</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">
              <form onSubmit={handleOpeningStock}>
                <br />

                <div className="row">
                  {/* <div class="col-6">
                                        <label for="exampleInputEmail1" class="form-label">Display Index</label>
                                        <input type="number" class="form-control" id="exampleInputEmail1" name="displayIndex" onChange={handleInputChange} aria-describedby="emailHelp" />
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
                        name="date"
                        placeholder="Name"
                        aria-label="Recipient's name"
                        //   max={getCurrentDateInput()}
                        defaultValue={getCurrentDateInput()}
                        onChange={handleInputChange}
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
                      onChange={handleInputChange}
                    >
                      <option selected hidden value="">
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
                      onChange={handleInputChange}
                    >
                      <option selected hidden value="">
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
                      type="number"
                      class="form-control"
                      id="exampleInputEmail1"
                      required
                      name="donorNo"
                      onChange={handleInputChange}
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

export default AddOpeningStock;
