import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useDeleteApi, useGetApi } from "../../../utils/Customhooks/ApiCalls";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Footer from "../../../components/footer/Footer";

const Deferral = () => {
  const [startdate, setstartdate] = useState();
  const [enddate, setenddate] = useState();

  const {
    data: getdata,
    isLoading,
    error,
    doFetch,
  } = useGetApi(
    `/api/deferral?fromDate=${getCurrentDateInput()
      .split("-")
      .join("")}&toDate=${getCurrentDateInput().split("-").join("")}`
  );

  const {
    data: deletedata,
    isLoading: deleteloading,
    error: deleteerror,
    doDelete,
  } = useDeleteApi("/api/deferral");

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

      doFetch(`/api/deferral?fromDate=${start}&toDate=${end}`);
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
      await doDelete(`/api/deferral/${id}`);
      await doFetch(`/api/deferral?fromDate=${start}&toDate=${end}`);
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
          <div className="my-3">
            <div className="row">
              <div className="col-md-6">
                <Link className="btn  mybtn " to="/admin/add-deferral-donor">
                  Add Deferral Donor
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
                <div className="col-md-3">
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
                <div className="col-md-3">
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
                <div className="col-md-3 my-auto mt-4">
                  <button className="btn mybtn">Submit</button>
                </div>
                {getdata && getdata.length !== 0 && (
                  <>
                    <div className="col-md-3 my-auto mt-4">
                      <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="download-table-xls-button btn mybtn"
                        table="table-to-xls"
                        filename="deferral"
                        sheet="tablexls"
                        buttonText="Download as XLS"
                      />
                    </div>
                  </>
                )}
              </div>
            </form>
          </div>

          {getdata && getdata.length !== 0 && (
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
                      Address
                    </th>
                    <th scope="col " style={{ whiteSpace: "nowrap" }}>
                      {" "}
                      Mobile
                    </th>
                    <th scope="col text-nowrap">
                      <div> Reason</div>
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
                            {`${c.date.toString().slice(6)}-${c.date
                              .toString()
                              .slice(4, 6)}-${c.date.toString().slice(0, 4)}`}
                          </td>
                          <td> {c.name}</td>
                          <td> {c.gender}</td>
                          <td> {c.address}</td>
                          <td> {c.mobileNo}</td>
                          <td> {c.reason}</td>

                          {/* <td>{c.displayIndex}</td> */}
                          <td>
                            <div className="d-flex">
                              <Link
                                className="btn mybtn text-white mx-1"
                                to={`/admin/edit-deferral-donor/${c.id}`}
                              >
                                {" "}
                                <FiEdit2 />{" "}
                              </Link>
                              <button
                                className="btn mybtn text-white"
                                // onClick={async (e) => {
                                //   await doDelete(`/api/deferral/${c.id}`);

                                //   let start = startdate.split("-").join("")
                                //   let end = enddate.split("-").join("")

                                //   await doFetch(`/api/deferral?fromDate=${start}&toDate=${end}`)

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
          )}
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default Deferral;
