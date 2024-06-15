import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useDeleteApi, useGetApi } from "../../../utils/Customhooks/ApiCalls";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Loader from "../../../components/loader/Loader";
import Footer from "../../../components/footer/Footer";

const BloodDonation = () => {
  const [startdate, setstartdate] = useState();
  const [enddate, setenddate] = useState();
  const { data: donortype } = useGetApi("/api/donortype");
  const { data: camptype } = useGetApi("/api/CampType");
  const { data: organisation } = useGetApi("/api/organization");
  const { data: donationtype } = useGetApi("/api/donationtype");
  const { data: allbloodgroup } = useGetApi("/api/bloodgroup");
  const { data: allbagtype } = useGetApi("/api/bagtype");

  const [newdonationtype, setdonationtype] = useState("");
  const [newdonortype, setnewdonortype] = useState("");
  const [gender, setgender] = useState("");
  const [camptypeid, setcamptypeid] = useState("");
  const [oraganisationId, setoraganisationId] = useState("");
  const [bloodgropuid, setbloodgroupid] = useState("");
  const [bagtypid, setbagtypeid] = useState("");
  const [donorId, setdonorId] = useState("");

  const {
    data: getdata,
    isLoading,
    error,
    doFetch,
  } = useGetApi(
    `/api/Donor?fromDate=${getCurrentDateInput()
      .split("-")
      .join("")}&toDate=${getCurrentDateInput().split("-").join("")}`
  );

  const {
    data: deletedata,
    isLoading: deleteloading,
    error: deleteerror,
    doDelete,
  } = useDeleteApi("/api/donor");

  //

  // useEffect(() => {
  //   doFetch(`/api/Donor?fromDate=${getCurrentDateInput().split("-").join("")}&toDate=${getCurrentDateInput().split("-").join("")}`)
  // }, [])

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
        `/api/donor?fromDate=${start}&toDate=${end}&Gender=${gender}&DonorType=${newdonortype}&DonationType=${newdonationtype}&CampType=${camptypeid}&Organisation=${oraganisationId}&bloodgroupid=${bloodgropuid}&BagTypeId=${bagtypid}&donorNo=${donorId}`
      );
    } catch (error) {}
  };

  const handleDelete = async (e, id) => {
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

      // let start = startdate.split("-").join("");
      // let end = enddate.split("-").join("");

      await doDelete(`/api/donor/${id}`);
      await doFetch(
        `/api/donor?fromDate=${start}&toDate=${end}&Gender=${gender}&DonorType=${newdonortype}&DonationType=${newdonationtype}&bloodgroupid=${bloodgropuid}`
      );
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
          <div className="container text-white"></div>
        </div>
        <div className=" p-5 container " style={{ minHeight: "80vh" }}>
          <div className="my-3">
            <div className="row">
              <div className="col-md-6">
                <Link className="btn  mybtn " to="/admin/add-BloodDonation">
                  Add BloodDonation
                </Link>
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
              <div className="row my-2 ">
                <div className="col-md-3 p-2">
                  <label for="exampleInputEmail1">Start Date</label>
                  <input
                    type="date"
                    class="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    required
                    defaultValue={getCurrentDateInput()}
                    onChange={(e) => setstartdate(e.target.value)}
                  />
                </div>
                <div className="col-md-3 p-2">
                  <label for="exampleInputEmail1">End Date</label>
                  <input
                    type="date"
                    class="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Enter email"
                    required
                    defaultValue={getCurrentDateInput()}
                    onChange={(e) => setenddate(e.target.value)}
                  />
                </div>
                <div className="col-3 p-2">
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

                <div className="col-3 p-2">
                  <label htmlFor="exampleInputEmail1">Donor Type</label>
                  <div className="input-group">
                    <select
                      name="donortype"
                      class="form-select"
                      value={newdonortype}
                      onChange={(e) => setnewdonortype(e.target.value)}
                    >
                      <option value="" selected>
                        Select Donar Type
                      </option>
                      {donortype &&
                        donortype.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-3">
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
                <div className="col-md-3">
                  <label htmlFor="exampleInputEmail1">Camp Type</label>
                  <div className="input-group">
                    <select
                      name="camptype"
                      class="form-select"
                      value={camptypeid}
                      onChange={(e) => setcamptypeid(e.target.value)}
                    >
                      <option value="" selected>
                        Select Camp Type
                      </option>

                      {camptype &&
                        camptype.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="exampleInputEmail1">Organisation</label>
                  <div className="input-group">
                    <select
                      name="organisation"
                      class="form-select"
                      value={oraganisationId}
                      onChange={(e) => setoraganisationId(e.target.value)}
                    >
                      <option value="" selected>
                        Select Organisation
                      </option>

                      {organisation &&
                        organisation.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <label htmlFor="exampleInputEmail1">Blood Group</label>
                  <div className="input-group">
                    <select
                      name="bloodgropu"
                      class="form-select"
                      value={bloodgropuid}
                      onChange={(e) => setbloodgroupid(e.target.value)}
                    >
                      <option value="" selected>
                        Select Blood Group
                      </option>

                      {allbloodgroup &&
                        allbloodgroup.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
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
                <div className="col-md-3">
                  <label htmlFor="exampleInputEmail1">Donor Number</label>
                  {/* <div className="input-group"> */}
                  <input
                    type="digit"
                    class="form-control"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                    placeholder="Enter Donor No."
                    onChange={(e) => setdonorId(e.target.value)}
                  />
                  {/* </div> */}
                </div>

                <div className="col-md-3 my-auto mt-4">
                  <button className="btn mybtn">Submit</button>
                </div>
                {getdata && getdata.length !== 0 && (
                  <>
                    <div className="col-md-3 my-auto mt-4 text-end">
                      <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button btn mybtn"
                        table="table-to-xls"
                        filename="blood donation"
                        sheet="tablexls"
                        buttonText="Download as XLS"
                      />
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>

          {isLoading ? (
            <>
              <Loader />
            </>
          ) : (
            getdata &&
            getdata.length !== 0 && (
              <div className="table-responsive">
                <table class="table  table-sm table-bordered" id="table-to-xls">
                  <thead>
                    <tr>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        Donation dt.
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        Name
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Gender
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Age
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Mobile
                      </th>
                      <th scope="col text-nowrap">
                        <div> Blood Group</div>
                      </th>
                      <th scope="col text-nowrap"> Bag-type</th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Donation-type
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Donor-type
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Camptype
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Organization
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        <div>Donor No.</div>
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        <div>Address</div>
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        <div>Plasma</div>
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        <div>RBC</div>
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        <div>Platelets</div>
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        <div>Whole Blood</div>
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        <div>DiscardReactive</div>
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        <div>BasedOn</div>
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        <div>Component</div>
                      </th>

                      {/* <th scope="col " style={{ whiteSpace: "nowrap" }}>Display Index</th> */}
                      <th scope="col" colspan="3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getdata &&
                      getdata.map((c, no) => (
                        <>
                          <tr>
                            <td>
                              {" "}
                              {`${c.dod.toString().slice(6)}-${c.dod
                                .toString()
                                .slice(4, 6)}-${c.dod.toString().slice(0, 4)}`}
                            </td>
                            <td> {c.name}</td>
                            <td> {c.gender}</td>
                            <td> {c.age}</td>
                            <td> {c.mobile}</td>
                            <td> {c.bloodGroupName}</td>
                            <td> {c.bagTypeName}</td>
                            <td> {c.donationTypeName}</td>

                            <td> {c.donorTypeName}</td>
                            <td> {c.campTypeName}</td>
                            <td> {c.organizationName}</td>
                            <td> {c.donorNo}</td>
                            <td> {c.address}</td>
                            <td> {c.plasma}</td>
                            <td> {c.rbc}</td>
                            <td> {c.platelets}</td>
                            <td> {c.wholeBlood}</td>
                            <td> {c.discardReactive}</td>
                            <td> {c.basedOn}</td>
                            <td> {c.component}</td>

                            {/* <td>{c.displayIndex}</td> */}
                            <td>
                              <div className="d-flex">
                                <Link
                                  className="btn mybtn text-white mx-1"
                                  to={`/admin/edit-BloodDonation/${c.id}`}
                                >
                                  {" "}
                                  <FiEdit2 />{" "}
                                </Link>
                                <button
                                  className="btn mybtn text-white"
                                  // onClick={async (e) => {
                                  //   await doDelete(`/api/donor/${c.id}`);

                                  //   let start = startdate.split("-").join("")
                                  //   let end = enddate.split("-").join("")

                                  //   await doFetch(`/api/donor?fromDate=${start}&toDate=${end}`)

                                  // }}

                                  onClick={(e) => handleDelete(e, c.id)}
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
              </div>
            )
          )}
        </div>
        <Footer />
      </section>
    </>
  );
};

export default BloodDonation;
