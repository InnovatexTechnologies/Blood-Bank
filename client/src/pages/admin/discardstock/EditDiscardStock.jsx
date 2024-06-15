import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import Select from "react-select";
import {
  usePostApi,
  useGetApi,
  usePutApi,
} from "../../../utils/Customhooks/ApiCalls";
import Footer from "../../../components/footer/Footer";

const EditDiscardStock = () => {
  const { id } = useParams();

  const { isLoading: puloading, doPut } = usePutApi(`/api/discardblood/${id}`);
  const { data: discardstock } = useGetApi(`/api/discardblood/${id}`);
  const { data: bloodgroup } = useGetApi("/api/bloodgroup");
  const { data: bagtype } = useGetApi("/api/bagtype");
  const { data: bloodcomponents } = useGetApi("/api/bloodcomponent");

  const [reason, setreason] = useState("");
  const [donor, setdonor] = useState();
  const [BloodComponent, setBloodComponent] = useState();
  const [BagType, setBagType] = useState();
  const [bloodgroupdata, setbloodgroupdata] = useState();
  const [discardtype, setdiscardtype] = useState([]);
  const [date, setdate] = useState();
  const [basedon, setbasedon] = useState();

  const navigate = useNavigate();

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

  let options = [];
  if (reason === "Discard") {
    options = discard;
  } else {
    options = Reactive;
  }

  const selectedOptions = options.filter((option) =>
    discardtype.includes(option.name)
  );

  const handleInputChange2 = (event) => {
    const selectedOptionLabels = event.map((option) => option.value);

    setdiscardtype(selectedOptionLabels.join(","));
  };

  // const handleChange = (selectedOptions, { action, option }) => {
  //   switch (action) {
  //     case "select-option":
  //       if (option && option.name && !discardtype.includes(option.name)) {
  //         setdiscardtype([...discardtype, option.name]);
  //       }
  //       break;

  //     case "remove-value":
  //       if (option && option.name) {
  //         setdiscardtype(discardtype.filter((name) => name !== option.name));
  //       }
  //       break;

  //     case "clear":
  //       setdiscardtype([]);
  //       break;

  //     default:
  //       break;
  //   }
  // };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/discardblood/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });

      console.log("data", data);

      if (data) {
        setdate(
          `${data.date.toString().slice(0, 4)}-${data.date
            .toString()
            .slice(4, 6)}-${data.date.toString().slice(6)}`
        );
        setdonor(data.donorno);
        setreason(data.reason);
        setBagType(data.bagTypeId);
        setBloodComponent(data.bloodComponentId);

        setbloodgroupdata(data.bloodGroupId);
        const initialSelectedValues = data.discardType
          ? data.discardType.split(",")
          : [];
        setdiscardtype(initialSelectedValues);
        setbasedon(data.basedOn);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await doPut({
      DonorNo: Number(donor),
      reason: reason,
      discardType: discardtype,
      bagtypeId: basedon === "BagType" ? Number(BagType) : 0,
      bloodGroupId: Number(bloodgroupdata),
      Date: Number(date.split("-").join("")),
      BasedOn: basedon,
      BloodComponentId: basedon === "Component" ? Number(BloodComponent) : 0,
    });

    if (!puloading) {
      navigate("/admin/discard-stock");
    }
  };
  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;

  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [name]: value,
  //   }));
  // };

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
            <h2>Edit Discard/Reactive</h2>
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
                        value={date}
                        onChange={(e) => setdate(e.target.value)}
                        placeholder="Set Date"
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
                      value={donor}
                      onChange={(e) => setdonor(e.target.value)}
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
                        value={reason}
                        onChange={(e) => setreason(e.target.value)}
                      >
                        <option selected hidden>
                          Select Reason
                        </option>
                        <option value="Discard">Discard</option>
                        <option value="Reactive">Reactive</option>
                      </select>
                    </div>
                  </div>
                  {reason !== "" && (
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
                            value={selectedOptions.map((option) => ({
                              label: option.name,
                              value: option.name,
                            }))}
                            options={options.map((option) => ({
                              label: option.name,
                              value: option.name,
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
                        value={basedon}
                        onChange={(e) => setbasedon(e.target.value)}
                      >
                        <option selected hidden>
                          Based On
                        </option>
                        <option value="BagType">Bag Type</option>
                        <option value="Component">Components</option>
                      </select>
                    </div>
                  </div>

                  {basedon !== "" && basedon === "BagType" && (
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
                          value={BagType}
                          onChange={(e) => setBagType(e.target.value)}
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

                  {basedon !== "" && basedon === "Component" && (
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
                          value={BloodComponent}
                          onChange={(e) => setBloodComponent(e.target.value)}
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
                        value={bloodgroupdata}
                        onChange={(e) => setbloodgroupdata(e.target.value)}
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
                    <label for="exampleInputEmail1" class="form-label">Quantity</label>
                    <input type="text" class="form-control"  id="exampleInputEmail1" value={qty} name="qty" onChange={(e)=>setqty(e.target.value)} aria-describedby="emailHelp" />
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

export default EditDiscardStock;
