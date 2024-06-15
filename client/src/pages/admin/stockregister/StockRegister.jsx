import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import "./stockregister.css";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import { useGetApi } from "../../../utils/Customhooks/ApiCalls";
import Footer from "../../../components/footer/Footer";

const StockRegister = () => {

  // const {
  //   data: getstockdata,
  //   isLoading,
  //   error,
  //   doFetch,
  // } = useGetApi(
  //   `/api/stockreport?Date=${getCurrentDateInput()
  //     .split("-")
  //     .join("")}}`
  // );










  const [openingstock, setopeningstock] = useState();
  const [newopeningStock, setnewopeningStock] = useState();
  const [startdate, setstartdate] = useState("");

  const [del, setdel] = useState(false);

  useEffect(() => {
    getdata(`/api/stockreport?Date=${getCurrentDateInput()
      .split("-")
      .join("")}`);
  }, []);

  const getdata = async (url) => {
    try {

      // const { data } = await axiosInstance.get("/api/stockreport", {
      const { data } = await axiosInstance.get(url, {
        headers: {
          Auth: localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      });

      const newarr = [];

      data.map((p) => {
        const index = newarr.findIndex(
          (item) => item.bloodGroupName === p.bloodGroupName
        );
        if (index !== -1) {
          newarr[index] = {
            ...newarr[index],
            [p["bloodComponentName"]]: p.totalQty,
          };
        } else {
          newarr.push({
            bloodGroupName: p.bloodGroupName,
            [p["bloodComponentName"]]: p.totalQty,
          });
        }
      });

      //

      setnewopeningStock(newarr);

      setopeningstock(data);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const sumcomponents = (objects) => {
    let totalsum =
      Number(objects["Plasma (FFP)"] || 0) +
      Number(objects["RBC"] || 0) +
      Number(objects["Whole Blood"] || 0) +
      Number(objects["Platelets"] || 0);

    return totalsum;
  };

  const reducedata = (name) => {
    const totalsum =
      newopeningStock &&
      newopeningStock.reduce(
        (total, item) => total + Number(item[name] || 0),
        0
      );

    //
    return totalsum;
  };

  const overAllSum = () => {
    const overallSum =
      openingstock &&
      openingstock.reduce(
        (total, item) => total + Number(item["totalQty"] || 0),
        0
      );

    // totalQty

    return overallSum;
  };

  const handledata = (e) => {
    e.preventDefault();
    try {
      let start

      if (startdate) {
        start = startdate.split("-").join("");
      } else {
        start = getCurrentDateInput().split("-").join("");
      }

      getdata(`/api/stockreport?Date=${start}`)
      // doFetch(
      //   `/api/issue?Date=${start}`
      // );
    } catch (error) {
      alert(error.response.data.message)
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
                      filename="Blood Stock Register"
                      sheet="tablexls"
                      buttonText="Download as XLS"
                    />
                  </div>
                </>
              )}
            </div>
          </form>

          {/* <div className="d-flex justify-content-end mb-1"></div> */}
          <div>
            <div>
              <h1 className="Heading">Blood Stock Register</h1>
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
                {/* <th scope="col">Sr. No.</th> */}
                {/* <th scope="col">Display Index</th> */}
                <th scope="col"> Blood Group</th>
                {/* <th scope="col"> Plasma</th> */}
                <th scope="col">Whole Blood</th>
                <th scope="col">RBC</th>
                <th scope="col"> Plasma (FFP)</th>
                <th scope="col"> Platelets</th>
                <th scope="col"> Total </th>
              </tr>
            </thead>
            <tbody>
              {newopeningStock &&
                newopeningStock.map((c, no) => (
                  <>
                    <tr>
                      {/* <th scope="row">{no + 1}</th> */}
                      {/* <td>{c.displayIndex}</td> */}
                      <td>{c.bloodGroupName}</td>
                      <td>{c["Whole Blood"] || 0}</td>
                      <td>{c["RBC"] || 0}</td>
                      <td>{c["Plasma (FFP)"] || 0}</td>
                      <td>{c["Platelets"] || 0}</td>
                      {/* <td>{Number(c["Whole Blood"] ||0) + Number(c["Whole Blood"] ||0) + Number(c["Platelets"]) + Number(c["Plasma (FFP)"])}</td> */}
                      <th>{sumcomponents(c)}</th>
                    </tr>
                  </>
                ))}
              <tr>
                <th>Total</th>
                <th>{reducedata("Whole Blood")}</th>
                <th>{reducedata("RBC")}</th>
                <th>{reducedata("Plasma (FFP)")}</th>
                <th>{reducedata("Platelets")}</th>
                <th>{overAllSum()}</th>
              </tr>
            </tbody>
          </table>
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default StockRegister;
