import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { usePostApi, useGetApi } from "../../../utils/Customhooks/ApiCalls";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import Footer from "../../../components/footer/Footer";
import Select from "react-select";
import { BsDisplayport } from "react-icons/bs";

const AddDiscardStock = () => {
  const { data, isLoading, error, doPost, setUrl } =
    usePostApi("/api/discardblood");
  const { data: bloodgroup } = useGetApi("/api/bloodgroup");
  const { data: bagtype } = useGetApi("/api/bagtype");
  const { data: bloodcomponents } = useGetApi("/api/bloodcomponent");

  const [formData, setFormData] = useState({
    date: "",
    donorno: "",
    reason: "",
    BloodComponent: "",
    Bagtype: "",
    bloodgroup: "",
    // qty: "",
    discardType: "",
    // displayindex: "",
    basedon: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("ddddddddddddd", formData);

    await doPost({
      Date:
        formData.date === ""
          ? Number(getCurrentDateInput().split("-").join(""))
          : Number(formData.date.split("-").join("")),
      DonorNo: Number(formData.donorno),
      reason: formData.reason,
      discardType: formData.discardType,
      bagtypeId: formData.Bagtype !== "" ? Number(formData.Bagtype) : 0,
      bloodGroupId: Number(formData.bloodgroup),
      BloodComponentId:
        formData.BloodComponent !== ""
          ? Number(formData.BloodComponent)
          : Number(0),
      BasedOn: formData.basedon,
      // displayIndex:formData.displayindex === "" ? Number(0): Number(formData.displayindex),
      // qty: Number(formData.qty),
    });

    if (!isLoading) {
      navigate("/admin/discard-stock");
    }
  };

  const handleInputChange = (event) => {
    if (event && event.target) {
      const { name, value } = event.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } else {
    }
  };

  const handleInputChange2 = (event) => {
    const selectedOptionLabels = event.map((option) => option.value);

    setFormData((prevFormData) => ({
      ...prevFormData,
      ["discardType"]: selectedOptionLabels.join(","),
    }));
  };

  const discard = [
    {
      id: 1,
      name: "Damage",
    },
    {
      id: 2,
      name: "Hemolise",
    },
    {
      id: 3,
      name: "QNS",
    },
    {
      id: 4,
      name: "Expire",
    },
    {
      id: 5,
      name: "Other",
    },
  ];

  const Reactive = [
    {
      id: 1,
      name: "HCV",
    },
    {
      id: 2,
      name: "HBSAG",
    },
    {
      id: 3,
      name: "HIV",
    },
    {
      id: 4,
      name: "Malaria",
    },
    {
      id: 4,
      name: "Syphillis",
    },
  ];
  const options = formData.reason === "Discard" ? discard : Reactive;

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
        <div className="container " style={{ minHeight: "80vh" }}>
          <div className="text-center">
            <h2>Add Discard/Reactive</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">
              <form onSubmit={handleSubmit}>
                <br />
                <div className="row">
                  <div className="col-6">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Date
                    </label>
                    <div className="input-group ">
                      <input
                        type="date"
                        className="form-control"
                        name="date"
                        onChange={handleInputChange}
                        placeholder="Date"
                        defaultValue={getCurrentDateInput()}
                        required
                        aria-label="Recipient's name"
                        aria-describedby="basic-addon2"
                        autoFocus
                      />
                    </div>
                  </div>
                  <div class="col-6">
                    <label for="exampleInputEmail1" class="form-label">
                      Donor Number
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="exampleInputEmail1"
                      name="donorno"
                      onChange={handleInputChange}
                      aria-describedby="emailHelp"
                    />
                  </div>

                  <div className="col-6">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Reason
                    </label>

                    <div className="input-group">
                      <select
                        name="reason"
                        class="form-select"
                        onChange={handleInputChange}
                      >
                        <option selected hidden>
                          Select Reason
                        </option>
                        <option value="Discard">Discard</option>
                        <option value="Reactive">Reactive</option>
                      </select>
                    </div>
                  </div>
                  {formData.reason !== "" && (
                    <>
                      <div className="col-6">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Discard/Reactive
                        </label>

                        <div className="input-group">
                          <Select
                            isMulti
                            name="discardType"
                            options={options.map((p) => ({
                              value: p.name,
                              label: p.name,
                            }))}
                            onChange={handleInputChange2}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-6">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Based On
                    </label>

                    <div className="input-group">
                      <select
                        name="basedon"
                        class="form-select"
                        onChange={handleInputChange}
                      >
                        <option selected hidden>
                          Based On
                        </option>
                        <option value="BagType">Bag Type</option>
                        <option value="Component">Components</option>
                      </select>
                    </div>
                  </div>

                  {formData.basedon !== "" &&
                    formData.basedon === "BagType" && (
                      <div className="col-6">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Bag Type
                        </label>

                        <div className="input-group">
                          <select
                            name="Bagtype"
                            class="form-select"
                            onChange={handleInputChange}
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
                    )}

                  {formData.basedon !== "" &&
                    formData.basedon === "Component" && (
                      <div className="col-6">
                        <label
                          htmlFor="exampleInputEmail1"
                          className="form-label"
                        >
                          Blood Components
                        </label>

                        <div className="input-group">
                          <select
                            name="BloodComponent"
                            class="form-select"
                            onChange={handleInputChange}
                          >
                            <option selected hidden>
                              Blood Components
                            </option>

                            {bloodcomponents &&
                              bloodcomponents.map((p) => (
                                <option value={p.id}>{p.name}</option>
                              ))}
                          </select>
                        </div>
                      </div>
                    )}

                  <div className="col-6">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                      Blood Group
                    </label>
                    <div className="input-group">
                      <select
                        name="bloodgroup"
                        class="form-select"
                        required
                        onChange={handleInputChange}
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
                  {/* <div class="col-6">
                    <label for="exampleInputEmail1" class="form-label">
                      Quantity
                    </label>
                    <input
                      type="text"
                      class="form-control"
                      id="exampleInputEmail1"
                      name="qty"
                      onChange={handleInputChange}
                      aria-describedby="emailHelp"
                    />
                  </div> */}
                  {/* <div class="col-6">
                    <label for="exampleInputEmail1" class="form-label">Display Index</label>
                    <input type="number" min={0} class="form-control"  id="exampleInputEmail1" name="displayindex"  onChange={handleInputChange} aria-describedby="emailHelp" />
                  </div> */}
                </div>
                <div className="d-flex justify-content-center mt-5">
                  {/* {
                  loading ? <>
                    <button type="submit" class="btn mybtn  text-white mt-2 disabled">
                      <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </button>
                  </> : <button type="submit" class="btn mybtn  text-white mt-2">Submit</button>
                } */}

                  <button type="submit" class="btn mybtn  text-white mt-2">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default AddDiscardStock;
