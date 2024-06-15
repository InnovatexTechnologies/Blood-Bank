import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useGetApi, usePostApi } from "../../../utils/Customhooks/ApiCalls";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import Footer from "../../../components/footer/Footer";

const AddBloodDonation = () => {
  const [blood, setblood] = useState();

  const inputRef = useRef();



  const [del, setdel] = useState(false);

  
  const {
    data: donationtype,
    isLoading,
    error,
    doFetch,
  } = useGetApi("/api/donationtype");
  const { data: bloodgroup } = useGetApi("/api/bloodgroup");
  const { data: camptype } = useGetApi("/api/camptype");
  const { data: organization } = useGetApi("/api/organization");
  const { data: bagtype } = useGetApi("/api/bagtype");
  const { data: donortype } = useGetApi("/api/donortype");
  const {
    data,
    doPost,
    isLoading: bloodsuccess,
    setUrl,
  } = usePostApi("/api/donor");



  const [formData, setFormData] = useState({
    date: "",
    phone: "",
    name: "",
    donationtype: "",
    donornumber: "",
    bloodgroup: "",
    camptype: "",
    organization: "",
    donortype: "",
    bagtype: "",
    gender: "",
  });

  const [formErrors, setFormErrors] = useState({
    date: "",
    phone: "",
    name: "",
    donationtype: "",
    donornumber: "",
    bloodgroup: "",
    camptype: "",
    organization: "",
    donortype: "",
    bagtype: "",
    gender: "",
    age: "",
    address: "",
    // displayindex:""
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // 

    // perform validation and set error message
    switch (name) {
      case "date":
      // setFormErrors((prevFormErrors) => ({
      //   ...prevFormErrors,
      //   [name]: value.length === 0 ? "First name must be at least 3 characters long" : "",
      // }));
      // break;
      case "lastName":
        setFormErrors((prevFormErrors) => ({
          ...prevFormErrors,
          [name]:
            value.length < 3
              ? "Last name must be at least 3 characters long"
              : "",
        }));
        break;
      case "email":
        setFormErrors((prevFormErrors) => ({
          ...prevFormErrors,
          [name]: !/\S+@\S+\.\S+/.test(value) ? "Email address is invalid" : "",
        }));
        break;
      case "gender":
        setFormErrors((prevFormErrors) => ({
          ...prevFormErrors,
          [name]: value === "" ? "Gender is Required" : "",
        }));
        break;
      default:
        break;
    }
  };

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    try {
      event.preventDefault();

      // perform final validation
      const hasErrors = Object.values(formErrors).some((error) => error !== "");
      if (hasErrors) {
        alert("Please fix the errors in the form before submitting.");
        return;
      }

      

      const ss = getCurrentDateInput();

      if (
        formData.bagtype === "" ||
        formData.donationtype === "" ||
        formData.bloodgroup === "" ||
        formData.gender === "" ||
        formData.donortype === ""
      ) {
        alert("All the Selectbox data Required");
        return;
      }

      if (formData.donationtype == "3") {
        if (formData.organization === "") {
          alert("Organization Name Required");
          return;
        }
        if (formData.camptype === "") {
          alert("Camp Type Required");
          return;
        }
      }

      

      doPost({
        registrationNo: Number(formData.donornumber),
        // "dod": 20230418,
        dod:
          formData.date === ""
            ? Number(ss.split("-").join(""))
            : Number(formData.date.split("-").join("")),
        bloodGroupId: Number(formData.bloodgroup),
        BagTypeId: Number(formData.bagtype),
        Name: formData.name,
        Mobile: formData.phone,
        DonationTypeId: Number(formData.donationtype),
        OrganizationId:
          formData.donationtype === "3"
            ? Number(formData.organization)
            : Number(0),
        CampTypeId:
          formData.donationtype === "3" ? Number(formData.camptype) : Number(0),
        DonorTypeId: Number(formData.donortype),
        DonorNo: formData.donornumber,
        BloodGroupName: formData.bloodgroup,
        BagTypeName: formData.bagtype,
        DonationTypeName: formData.donationtype,
        OrganizationName: "Rotary Club",
        CampTypeName: "INDOOR",
        DonorTypeName: "First Time Donor",
        Gender: formData.gender,
        Age: Number(formData.age),
        Address: formData.address,
        // DisplayIndex:formData.displayindex === "" ?Number(0):Number(formData.displayindex)
      });

      if (!bloodsuccess) {
        alert("Created Successfully");
        // navigate("/admin/BloodDonation")

        setFormData({
          date: formData.date,
          phone: "",
          name: "",
          donationtype: "",
          donornumber: "",
          bloodgroup: "",
          camptype: "",
          organization: "",
          donortype: "",
          bagtype: "",
          gender: "",
          age: "",
          address: "",
        });
        inputRef.current?.focus();
      }
    } catch (error) {
      
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
            <h1 className="Heading">Add Blood Donation</h1>
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
                      name="date"
                      placeholder="Name"
                      aria-label="Recipient's name"
                      max={getCurrentDateInput()}
                      defaultValue={getCurrentDateInput()}
                      onChange={handleInputChange}
                      aria-describedby="basic-addon2"
                      autoFocus
                      ref={inputRef}
                    />
                  </div>
                </div>
                {/* <div className="col-6">
                <label htmlFor="exampleInputEmail1" className="form-label">
                Donar Number *
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    required
                    name="donornumber"
                    onChange={handleInputChange}
                    placeholder="Donar Number"
                    aria-label="Recipient's Number"
                    aria-describedby="basic-addon2"
                  />
                </div>
              </div> */}
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Donar Name
                  </label>
                  <div className="input-group ">
                    <input
                      type="text"
                      className="form-control"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
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
                      name="gender"
                      class="form-select"
                      value={formData.gender}
                      required
                      onChange={handleInputChange}
                    >
                      <option value="" selected hidden>
                        Select Gender
                      </option>

                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Donar Phone Number *
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      required
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
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
                      name="bloodgroup"
                      class="form-select"
                      required
                      value={formData.bloodgroup}
                      onChange={handleInputChange}
                    >
                      <option selected hidden>
                        BloodGroup Type
                      </option>
                      {bloodgroup &&
                        bloodgroup.map((p) => (
                          <option value={p.id} key={p.id}>
                            {p.name}
                          </option>
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
                    value={formData.age}
                    name="age"
                    onChange={handleInputChange}
                    aria-describedby="emailHelp"
                  />
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Bag Type
                  </label>
                  <div className="input-group">
                    <select
                      name="bagtype"
                      class="form-select"
                      value={formData.bagtype}
                      required
                      onChange={handleInputChange}
                    >
                      <option value="" selected hidden>
                        Bag Type
                      </option>
                      {bagtype &&
                        bagtype.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Donation Type
                  </label>
                  <div className="input-group">
                    <select
                      name="donationtype"
                      class="form-select"
                      value={formData.donationtype}
                      required
                      onChange={handleInputChange}
                    >
                      <option value="" selected hidden>
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

                {formData.donationtype === "3" && (
                  <>
                    <div className="col-6">
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        Camp Type
                      </label>
                      <div className="input-group">
                        <select
                          name="camptype"
                          class="form-select"
                          value={formData.camptype}
                          required
                          onChange={handleInputChange}
                        >
                          <option value="" selected hidden>
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
                      <label
                        htmlFor="exampleInputEmail1"
                        className="form-label"
                      >
                        Organization Name
                      </label>
                      <div className="input-group">
                        <select
                          name="organization"
                          class="form-select"
                          required
                          value={formData.organization}
                          onChange={handleInputChange}
                        >
                          <option value =" " selected hidden>
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
                )}

                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Donor Type
                  </label>
                  <div className="input-group">
                    <select
                      name="donortype"
                      class="form-select"
                      value={formData.donortype}
                      required
                      onChange={handleInputChange}
                    >
                      <option value ="" selected hidden>
                        Donar Type
                      </option>
                      {donortype &&
                        donortype.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
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
                      className="form-control"
                      // required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Address"
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>

                {bloodsuccess ? (
                  <>
                    <div>
                      <button
                       disabled
                        class="btn "
                        style={{
                          background: "#880808",
                          color: "white",
                        }}
                      >
                        Loading..
                      </button>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </form>
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default AddBloodDonation;
