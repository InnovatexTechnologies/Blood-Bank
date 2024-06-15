import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import { useDeleteApi, useGetApi } from "../../../utils/Customhooks/ApiCalls";
import Loader from "../../../components/loader/Loader";
import Footer from "../../../components/footer/Footer";

const BloodStockRegister = () => {
  const { data: allbloodGroup } = useGetApi("/api/bloodgroup");
  const { data: allbloodcomponents } = useGetApi("/api/bloodcomponent");

  const [startdate, setstartdate] = useState();
  const [enddate, setenddate] = useState();
  const [bloodGroup, setbloodGroup] = useState("");
  const [bloodComponent, setbloodComponent] = useState("");
  const [allstockregister, setallstockregister] = useState([]);

  const {
    data: getdata,
    isLoading,
    error,
    doFetch,
  } = useGetApi(
    `/api/BloodStockRegister?fromDate=${getCurrentDateInput()
      .split("-")
      .join("")}&toDate=${getCurrentDateInput().split("-").join("")}`
  );


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
        `/api/BloodStockRegister?fromDate=${start}&toDate=${end}&BloodGroup=${bloodGroup}&BloodComponent=${bloodComponent}`
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
              <div className="col-md-3">
                <label htmlFor="exampleInputEmail1">Blood Group</label>
                <div className="input-group">
                  <select
                    name="camptype"
                    class="form-select"
                    value={bloodGroup}
                    required
                    onChange={(e) => setbloodGroup(e.target.value)}
                  >
                    <option value="" selected>
                      Select Blood Group
                    </option>

                    {allbloodGroup &&
                      allbloodGroup.map((p) => (
                        <option value={p.id} key={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="col-md-3">
                <label htmlFor="exampleInputEmail1">Blood Components</label>
                <div className="input-group">
                  <select
                    name="camptype"
                    class="form-select"
                    value={bloodComponent}
                    required
                    onChange={(e) => setbloodComponent(e.target.value)}
                  >
                    <option value="" selected>
                      Select Blood Components
                    </option>

                    {allbloodcomponents &&
                      allbloodcomponents.map((p) => (
                        <option value={p.id}>{p.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="col-md-2 my-auto mt-4">
                <button className="btn mybtn">Submit</button>
              </div>
              {getdata && getdata.length !== 0 && (
                <>
                  <div className="col-md-12 text-end mt-4">
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      className="download-table-xls-button btn mybtn"
                      table="table-to-xls"
                      filename="Blood Stock Register"
                      sheet="tablexls"
                      buttonText="Download as XLS"
                    />
                  </div>
                </>
              )}
            </div>
          </form>

          <div>
            <div>
              <h1 className="Heading">Blood Stock Register</h1>
            </div>
          </div>

          { 
           isLoading ? (
            <>
              <Loader />
            </>
          ) : (
          
          
          getdata && getdata.length !== 0 && (
            <>
              <table class="table table-responsive" id="table-to-xls">
                <thead>
                  <tr>
                    {/* <th scope="col">Sr. No.</th> */}
                    {/* <th scope="col">Display Index</th> */}
                    <th scope="col">Date</th>
                    <th scope="col"> Trans Type</th>
                    {/* <th scope="col"> Blood Group</th> */}
                    {/* <th scope="col"> Plasma</th> */}
                    {/* <th scope="col">Blood Components Name</th> */}
                    <th scope="col">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    getdata &&
                    getdata.map((c, no) => (
                      <>
                        <tr key={c.id}>
                          <td>{`${c.date.toString().slice(6)}-${c.date
                            .toString()
                            .slice(4, 6)}-${c.date
                            .toString()
                            .slice(0, 4)}`}</td>
                          
                          <td>{c["transType"]}</td>
                          <td>{c.qty}</td>

                    
                        </tr>
                      </>
                    ))
                  }
                </tbody>
              </table>
            </>
          ))}
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default BloodStockRegister;
