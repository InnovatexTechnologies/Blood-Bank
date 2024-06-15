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

const BloodIssue = () => {
  const [startdate, setstartdate] = useState("");
  const [enddate, setenddate] = useState("");

  const {
    data: getdata,
    isLoading,
    error,
    doFetch,
  } = useGetApi(
    `/api/issue?fromDate=${getCurrentDateInput()
      .split("-")
      .join("")}&toDate=${getCurrentDateInput().split("-").join("")}`
  );

  const { data: hospital } = useGetApi("/api/Hospital");
  const { data: patientType } = useGetApi("/api/patientType");
  const { data: allbloodgroup } = useGetApi("/api/bloodgroup");
  const { data: allbloodcomponents } = useGetApi("/api/bloodcomponent");

  const [hospitaltype, sethospitaltype] = useState("");
  const [patienttype, setpatienttype] = useState("");
  const [paymentmode, setpaymentmode] = useState("");
  const [replacement, setreplacement] = useState("");
  const [bloodgropuid, setbloodgroupid] = useState("");
  const [bloodcomponentsid, setcomponentsid] = useState("");

  const {
    data: deletedata,
    isLoading: deleteloading,
    error: deleteerror,
    doDelete,
    setondelete,
  } = useDeleteApi("/api/Issue");

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
        `/api/issue?fromDate=${start}&toDate=${end}&patientType=${patienttype}&hospitalType=${hospitaltype}&PaymentMode=${paymentmode}&Replacement=${replacement}&bloodgroupid=${bloodgropuid}&bloodcomponentId=${bloodcomponentsid}`
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
      await doDelete(`/api/issue/${id}`);
      await doFetch(
        `/api/issue?fromDate=${start}&toDate=${end}&patientType=${patienttype}&hospitalType=${hospitaltype}&PaymentMode=${paymentmode}&Replacement=${replacement}&bloodgroupid=${bloodgropuid}&bloodcomponentId=${bloodcomponentsid}`
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
        <div className=" p-5 container" style={{minHeight:"80vh"}}>
          <div>
            <div className="row">
              <div className="col-md-6">
                <Link className="btn  mybtn " to="/admin/add-BloodIssue">
                  Add BloodIssue
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
                  <label for="exampleInputEmail1">Hospital Type</label>
                  <div className="input-group">
                    <select
                      name="Hospitaltype"
                      class="form-select"
                      value={hospitaltype}
                      onChange={(e) => sethospitaltype(e.target.value)}
                    >
                      <option selected value="">
                        Select Hospital Type
                      </option>

                      {hospital &&
                        hospital.map((p) => (
                          <option value={p.id} key={p.id}>
                            {p.type}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-2">
                  <label for="exampleInputEmail1">Patient Type</label>
                  <select
                    name="PatientType"
                    class="form-select"
                    value={patienttype}
                    onChange={(e) => setpatienttype(e.target.value)}
                  >
                    <option selected value="">
                      Select Patient Type
                    </option>

                    {patientType &&
                      patientType.map((p) => (
                        <option value={p.id}>{p.name}</option>
                      ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <label htmlFor="exampleInputEmail1">Payment Mode</label>
                  <div className="input-group">
                    <select
                      name="paymentmode"
                      class="form-select"
                      value={paymentmode}
                      onChange={(e) => setpaymentmode(e.target.value)}
                    >
                      <option value="" selected>
                        Select Payment Mode
                      </option>
                      <option value="Free">Free</option>
                      <option value="Paid">Paid</option>
                      <option value="Free By CMS">Free By CMS</option>
                    </select>
                  </div>
                </div>
                

                <div className="col-md-2">
                  <label htmlFor="exampleInputEmail1">
                    Replacement/Without
                  </label>
                  <div className="input-group">
                    <select
                      name="againstDonar"
                      class="form-select"
                      value={replacement}
                      onChange={(e) => setreplacement(e.target.value)}
                    >
                      <option value="" selected>
                        Select Replacement/Without
                      </option>
                      <option value="Yes">Replacement</option>
                      <option value="No">Without</option>
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


                <div className="col-md-2 my-auto mt-4" >
                  <button className="btn mybtn" >Submit</button>
                </div>
                {getdata && getdata.length !== 0 && (
                  <>
                    <div className="col-md-6 text-end mt-4">
                      <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button btn mybtn"
                        table="table-to-xls"
                        filename="Blood Issue"
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
                      {/* <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        Sr. No.
                      </th> */}

                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Date of Issue
                      </th>
                      {/* <th scope="col " style={{whiteSpace:"nowrap"}}> bloodGroupId</th> */}
                      {/* <th scope="col " style={{whiteSpace:"nowrap"}}> bagTypeId</th> */}
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        Receipt No.
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        Patient Name
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Supply Number
                      </th>
                      {/* <th scope="col " style={{whiteSpace:"nowrap"}}> Address</th> */}
                      {/* <th scope="col " style={{whiteSpace:"nowrap"}}> donationTypeId</th> */}
                      {/* <th scope="col " style={{whiteSpace:"nowrap"}}> organizationId</th> */}
                      {/* <th scope="col " style={{whiteSpace:"nowrap"}}> campTypeId</th> */}
                      {/* <th scope="col " style={{whiteSpace:"nowrap"}}> donorTypeId</th> */}
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        <div>Donor No.</div>
                      </th>
                      <th scope="col text-nowrap">
                        <div> Blood Group</div>
                      </th>
                      <th scope="col text-nowrap"> Blood Components Name</th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Patient-type
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Hospital Type
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Institute/Doctor{" "}
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Against Donor
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Free/Paid
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Amount
                      </th>
                      <th scope="col " style={{ whiteSpace: "nowrap" }}>
                        {" "}
                        Remark
                      </th>
                      {/* <th scope="col " style={{ whiteSpace: "nowrap" }}>
                      Display Index
                    </th> */}
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
                            {/* <th scope="row">{no + 1}</th> */}
                            <td>
                              {" "}
                              {`${c.doi.toString().slice(6)}-${c.doi
                                .toString()
                                .slice(4, 6)}-${c.doi.toString().slice(0, 4)}`}
                            </td>
                            {/* <td> {c.bloodGroupId}</td> */}
                            <td> {c.receiptNo}</td>
                            <td> {c.patientName}</td>
                            <td> {c.supplyNo}</td>
                            {/* <td> {c.address}</td> */}
                            {/* <td> {c.donationTypeId}</td> */}
                            {/* <td> {c.organizationId}</td> */}
                            {/* <td> {c.campTypeId}</td> */}
                            {/* <td> {c.donorTypeId}</td> */}
                            <td> {c.donorNo}</td>
                            <td> {c.bloodGroupName}</td>
                            <td> {c.bloodComponentsName}</td>
                            <td> {c.patientTypeName}</td>
                            <td> {c.type}</td>
                            <td> {c.institution_Doctor}</td>
                            <td>
                              {" "}
                              {c.againstDonor === "Yes"
                                ? "Replacement"
                                : "Without"}
                            </td>
                            <td> {c.free_Paid}</td>
                            <td> {c.amount}</td>
                            <td> {c.remark}</td>
                            {/* <td>{c.displayIndex}</td> */}
                            <td>
                              <div className="d-flex">
                                <Link
                                  className="btn mybtn text-white mx-1"
                                  to={`/admin/edit-BloodIssue/${c.id}`}
                                >
                                  {" "}
                                  <FiEdit2 />{" "}
                                </Link>
                                <button
                                  className="btn mybtn text-white"
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
        <Footer/>
      </section>
    </>
  );
};

export default BloodIssue;
