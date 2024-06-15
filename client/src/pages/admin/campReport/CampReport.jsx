import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import { useDeleteApi, useGetApi } from "../../../utils/Customhooks/ApiCalls";
import Footer from "../../../components/footer/Footer";

const CampReport = () => {
  const {
    data: getdata,
    isLoading,
    error,
    doFetch,
  } = useGetApi(`/api/CampReport`);

  console.log("camptype", getdata);

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
        {getdata && getdata.length !== 0 && (
            <>
              <div className="col-md-12 text-end mb-1">
                <ReactHTMLTableToExcel
                  id="test-table-xls-button"
                  className="download-table-xls-button btn mybtn"
                  table="table-to-xls"
                  filename="Camp History"
                  sheet="tablexls"
                  buttonText="Download as XLS"
                />
              </div>
            </>
          )}
          
            <div>
              <h1 className="Heading">Camp History</h1>
            </div>
          
          

          <table class="table table-responsive" id="table-to-xls">
            <thead>
              <tr>
                {/* <th scope="col">Sr. No.</th> */}
                {/* <th scope="col">Display Index</th> */}
                <th scope="col " className="text-start">Organisation</th>
                <th scope="col" className="text-start"> Camp Type</th>
                <th scope="col" className="text-start">Date</th>
                {/* <th scope="col"> Blood Group</th> */}
                {/* <th scope="col"> Plasma</th> */}
                {/* <th scope="col">Blood Components Name</th> */}
                <th scope="col" className="text-start">Donations </th>
              </tr>
            </thead>
            <tbody>
              {getdata &&
                getdata.map((c, no) => (
                  <>
                    <tr key={c.id}>
                      <td className="text-start">{c.organizationName}</td>
                      <td className="text-start">{c.campTypeName}</td>
                      <td className="text-start">{`${c.dod.toString().slice(6)}-${c.dod
                        .toString()
                        .slice(4, 6)}-${c.dod.toString().slice(0, 4)}`}</td>

                      <td className="text-start">{c.donations}</td>
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default CampReport;
