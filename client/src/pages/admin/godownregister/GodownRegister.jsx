import React, { useState } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useGetApi } from "../../../utils/Customhooks/ApiCalls";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import Footer from "../../../components/footer/Footer";

const GodownRegister = () => {
  const {
    data: getdata,
    isLoading,
    error,
    doFetch,
  } = useGetApi(
    `/api/godown?Date=${getCurrentDateInput().split("-").join("")}`
  );

  const [startdate, setstartdate] = useState("");

  const handledata = (e) => {
    e.preventDefault();
    try {
      let start;

      if (startdate) {
        start = startdate.split("-").join("");
      } else {
        start = getCurrentDateInput().split("-").join("");
      }

      doFetch(`/api/godown?Date=${start}`);
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
          <div className="container text-white"></div>
        </div>
        <div className=" p-5 container" style={{ minHeight: "80vh" }}>
          <form onSubmit={handledata}>
            <div className="row my-2">
              <div className="col-md-3">
                <label for="exampleInputEmail1"> Date</label>
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

              <div className="col-md-2 my-auto mt-4">
                <button className="btn mybtn">Submit</button>
              </div>
              {getdata && getdata.length !== 0 && (
                <>
                  <div className="col-md-7 my-auto mt-4 text-end">
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      className="download-table-xls-button btn mybtn"
                      table="table-to-xls"
                      filename="godown stock"
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
              <h1 className="Heading">Godown Stock</h1>
            </div>
          </div>
          {/* <table class="table table-responsive" id="table-to-xls" >
            <thead>
              <tr>
                <th scope="col">Sr. No.</th>
                <th scope="col"> Blood Group</th>
                <th scope="col"> Blood Components</th>
                <th scope="col"> Total Quantity</th>
               
              </tr>
            </thead>
            <tbody>
              {openingstock &&
                openingstock.map((c, no) => (
                  <>
                    <tr>
                      <th scope="row">{no + 1}</th>
                      <td>{c.bloodGroupName}</td>
                      <td>{c.bloodComponentName}</td>
                      <td>{c.totalQty}</td>
                    </tr>
                  </>
                ))}
            </tbody>
          </table> */}
          <table class="table table-responsive" id="table-to-xls">
            <thead>
              <tr>
                <th scope="col" style={{ textAlign: "left" }}>
                  {" "}
                  Sr. No.
                </th>
                <th scope="col" style={{ textAlign: "left" }}>
                  {" "}
                  stock Item Name
                </th>
                <th scope="col" style={{ textAlign: "left" }}>
                  Total Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {getdata &&
                getdata.map((c, no) => (
                  <>
                    <tr style={{ textAlign: "left" }}>
                      <td style={{ textAlign: "left" }}>{no + 1}</td>
                      <td style={{ textAlign: "left" }}>{c.stockItemName}</td>
                      <td style={{ textAlign: "left" }}>
                        <b>{c.totalQty}</b>
                      </td>
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default GodownRegister;
