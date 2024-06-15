import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useDeleteApi, useGetApi } from "../../../utils/Customhooks/ApiCalls";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import Footer from "../../../components/footer/Footer";

const DiscardStock = () => {
  const { data: allbloodgroup } = useGetApi("/api/bloodgroup");
  const { data: allbloodcomponents } = useGetApi("/api/bloodcomponent");
  const { data: allbagtype } = useGetApi("/api/bagtype");

  const [startdate, setstartdate] = useState("");
  const [enddate, setenddate] = useState("");
  const [reason, setreason] = useState("");
  const [discardtype, setdiscardtype] = useState("");
  const [gender, setgender] = useState("");
  const [newdonationtype, setdonationtype] = useState("");
  const { data: donationtype } = useGetApi("/api/donationtype");
  const [bloodgropuid, setbloodgroupid] = useState("");
  const [bloodcomponentsid, setcomponentsid] = useState("");
  const [bagtypid, setbagtypeid] = useState("");

  const {
    data: getdata,
    isLoading,
    error,
    doFetch,
  } = useGetApi("/api/discardblood");

  const {
    data: deletedata,
    isLoading: deleteloading,
    error: deleteerror,
    doDelete,
  } = useDeleteApi("/api/discardblood");

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

  const handledata = (e) => {
    e.preventDefault();
    try {
      let start, end;

      if (startdate) {
        start = startdate.split("-").join("");
      } else {
        start = getCurrentDateInput().split("-").join("");
      }

      if (enddate) {
        end = enddate.split("-").join("");
      } else {
        end = getCurrentDateInput().split("-").join("");
      }
      doFetch(
        `/api/DiscardBlood?fromDate=${start}&toDate=${end}&Gender=${gender}&DonationType=${newdonationtype}&DiscardType=${discardtype}&Reason=${reason}&bloodgroupid=${bloodgropuid}&BagTypeId=${bagtypid}&bloodcomponentId=${bloodcomponentsid}`
      );
    } catch (error) {
      console.log(error.response.data.message);
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
            <div className="row">
              <div className="col-md-6">
                <Link className="btn  mybtn " to="/admin/add-discard-stock">
                  Add Discard / Reactive
                </Link>
                {/* {process.env.REACT_APP_STATUS === "TESTING" && (
                  <>
                    <button
                      className="btn  mybtn m-2"
                      onClick={handleresavedata}
                    >
                      Resave
                    </button>
                  </>
                )} */}
              </div>
              {!isLoading && getdata && getdata.length !== 0 && (
                <>
                  <div className="col-md-6 my-auto text-end ">
                    <h6>
                      <span
                        className=" px-3 py-1 text-white "
                        style={{
                          borderRadius: "7px",
                          backgroundColor: "rgb(136,8,8)",
                        }}
                      >
                        Total Count :- {getdata.length}
                      </span>
                    </h6>
                  </div>
                </>
              )}
            </div>
            <form onSubmit={handledata}>
              <div className="row my-2">
                <div className="col-md-2">
                  <label for="exampleInputEmail1">Start Date</label>
                  <input
                    type="date"
                    class="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    defaultValue={getCurrentDateInput()}
                    required
                    onChange={(e) => setstartdate(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <label for="exampleInputEmail1">End Date</label>
                  <input
                    type="date"
                    class="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    defaultValue={getCurrentDateInput()}
                    required
                    onChange={(e) => setenddate(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <label for="exampleInputEmail1">Reason</label>
                  {/* <label htmlFor="exampleInputEmail1" className="form-label">
                    Reason
                  </label> */}

                  {/* <div className="input-group"> */}
                  <select
                    name="reason"
                    class="form-select"
                    value={reason}
                    onChange={(e) => setreason(e.target.value)}
                    required
                  >
                    <option selected hidden>
                      Select Reason
                    </option>
                    <option value="Discard">Discard</option>
                    <option value="Reactive">Reactive</option>
                  </select>
                  {/* </div> */}
                </div>
                <div className="col-md-2">
                  <label htmlFor="exampleInputEmail1">Gender</label>
                  <div className="input-group">
                    <select
                      name="gender"
                      class="form-select"
                      value={gender}
                      onChange={(e) => setgender(e.target.value)}
                    >
                      <option value="" selected>
                        Select Gender
                      </option>

                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-2">
                  <label htmlFor="exampleInputEmail1">Donation Type</label>
                  <div className="input-group">
                    <select
                      name="donationtype"
                      class="form-select"
                      value={newdonationtype}
                      onChange={(e) => setdonationtype(e.target.value)}
                    >
                      <option value="" selected>
                        Select Donation Type
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
                <div className="col-md-2">
                  <label htmlFor="exampleInputEmail1">
                   Blood Group
                  </label>
                  <div className="input-group">
                    <select
                      name="againstDonar"
                      class="form-select"
                      value={bloodgropuid}
                      onChange={(e) => setbloodgroupid(e.target.value)}
                    >
                      <option value="" selected>
                        Select Blood Group
                      </option>
                      {
                        allbloodgroup && allbloodgroup.map((p)=>(
                          <>
                          <option value={p.id}>{p.name}</option>
                          </>
                        ))
                      }
                      
                    </select>
                  </div>
                </div>
                <div className="col-md-2">
                  <label htmlFor="exampleInputEmail1">
                   Blood Component
                  </label>
                  <div className="input-group">
                    <select
                      name="againstDonar"
                      class="form-select"
                      value={bloodcomponentsid}
                      onChange={(e) => setcomponentsid(e.target.value)}
                    >
                      <option value="" selected>
                        Select Blood Components
                      </option>
                      {
                        allbloodcomponents && allbloodcomponents.map((p)=>(
                          <>
                          <option value={p.id}>{p.name}</option>
                          </>
                        ))
                      }
                      
                    </select>
                  </div>
                </div>
                <div className="col-md-2">
                  <label htmlFor="exampleInputEmail1">Bag Type</label>
                  <div className="input-group">
                    <select
                      name="bloodgropu"
                      class="form-select"
                      value={bagtypid}
                      onChange={(e) => setbagtypeid(e.target.value)}
                    >
                      <option value="" selected>
                        Select Bag Type
                      </option>

                      {allbagtype &&
                        allbagtype.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                {reason !== "" && (
                  <>
                    <div className="col-md-2">
                      <label htmlFor="exampleInputEmail1">
                        Discard/Reactive
                      </label>

                      <div className="input-group">
                        <select
                          name="discardType"
                          class="form-select"
                          value={discardtype}
                          onChange={(e) => setdiscardtype(e.target.value)}
                          required
                        >
                          <option selected hidden>
                            Select Discard/Reactive
                          </option>

                          {reason === "Discard" ? (
                            <>
                              {discard.map((p) => (
                                <option value={p.name} key={p.name}>
                                  {p.name}
                                </option>
                              ))}
                            </>
                          ) : (
                            <>
                              {Reactive.map((p) => (
                                <option value={p.name} key={p.name}>
                                  {p.name}
                                </option>
                              ))}
                            </>
                          )}
                        </select>
                      </div>
                    </div>
                  </>
                )}

                <div className="col-md-2 my-auto mt-4">
                  <button className="btn mybtn">Submit</button>
                </div>
                {getdata && getdata.length !== 0 && (
                  <>
                    <div className="col-md-2 text-end mt-4">
                      <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button btn mybtn"
                        table="table-to-xls"
                        filename="Discard/Reactive"
                        sheet="tablexls"
                        buttonText="Download as XLS"
                      />
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>


          {
            getdata && getdata.length !== 0 &&(
              <>
              <table class="table table-responsive" id="table-to-xls">
            <thead>
              <tr>
                <th scope="col">Sr. No.</th>
                <th scope="col">Date</th>
                <th scope="col">Donor Number</th>
                <th scope="col">Reason</th>
                <th scope="col">Discard Type</th>
                <th scope="col"> Blood Group</th>
                <th scope="col"> Based On</th>
                <th scope="col"> Bag Type </th>
                <th scope="col"> Donation Type </th>
                <th scope="col"> Blood Components  </th>
                
                <th scope="col">Name </th>
                <th scope="col">Gender </th>
                <th scope="col">Address </th>
                <th scope="col">Mobile </th>
                {/* <th scope="col">DOD </th> */}
                {/* <th scope="col"> Qty</th> */}
                {/* <th scope="col"> Display Index</th> */}
                <th scope="col" colspan="3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {getdata &&
                getdata.map((c, no) => (
                  <>
                    <tr key={c.id}>
                      <th scope="row">{no + 1}</th>
                      <td style={{ whiteSpace: "nowrap" }}>
                        {c.date &&
                          `${c.date.toString().slice(6)}-${c.date
                            .toString()
                            .slice(4, 6)}-${c.date.toString().slice(0, 4)}`}
                      </td>
                      <td>{c.donorno}</td>
                      <td>{c.reason}</td>
                      <td>{c.discardType}</td>
                      <td>{c.bloodGroupName}</td>
                      <td>{c.basedOn}</td>
                      <td>{c.bagTypeName}</td>
                      <td>{c.donationType}</td>
                      <td>{c.bloodComponentName}</td>
                      <td>{c.name}</td>
                      <td>{c.gender}</td>
                      <td>{c.address}</td>
                      <td>{c.mobile}</td>
                      {/* <td style={{ whiteSpace: "nowrap" }}>{c.dod &&
                          `${c.dod.toString().slice(6)}-${c.dod
                            .toString()
                            .slice(4, 6)}-${c.dod.toString().slice(0, 4)}`}</td> */}
                      {/* <td>{c.qty}</td> */}
                      {/* <td>{c.displayIndex}</td> */}

                      <td>
                        <div className="d-flex">
                          {" "}
                          <Link
                            className="btn mybtn text-white mx-1"
                            to={`/admin/edit-discard-stock/${c.id}`}
                          >
                            {" "}
                            <FiEdit2 />{" "}
                          </Link>
                          <button
                            className="btn mybtn text-white"
                            onClick={async (e) => {
                              await doDelete(`/api/discardblood/${c.id}`);
                              await doFetch(`/api/discardblood`);
                            }}
                          >
                            <AiTwotoneDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
              
              </>
            )

          }
          
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default DiscardStock;
