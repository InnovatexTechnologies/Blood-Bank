// import React, { useState } from "react";
// import Sidebar from "../../../components/sidebar/Sidebar";
// import { useGetApi } from "../../../utils/Customhooks/ApiCalls";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
// import { getCurrentDateInput } from "../../../utils/func/datefunc";
// import Footer from "../../../components/footer/Footer";
// import { useRef } from "react";
// import ReactToPrint from "react-to-print";

// const ExpireReport = () => {
//   const {
//     data: getdata,
//     isLoading,
//     error,
//     doFetch,
//   } = useGetApi(
//     `/api/ExpireStock?FromDate=${getCurrentDateInput()
//       .split("-")
//       .join("")}&ToDate=${getCurrentDateInput().split("-").join("")}`
//   );

//   const [startdate, setstartdate] = useState("");
//   const [enddate, setenddate] = useState("");
//   let componentRef = useRef();

//   const handledata = (e) => {
//     e.preventDefault();
//     try {
//       let start, end;

//       if (startdate) {
//         start = startdate.split("-").join("");
//       } else {
//         start = getCurrentDateInput().split("-").join("");
//       }

//       if (enddate) {
//         end = enddate.split("-").join("");
//       } else {
//         end = getCurrentDateInput().split("-").join("");
//       }

//       doFetch(`/api/ExpireStock?FromDate=${start}&ToDate=${end}`);
//     } catch (error) {
//       alert(error.response.data.message);
//     }
//   };

//   return (
//     <>
//       <Sidebar />
//       <section
//         className="push "
//         style={{ position: "relative", transition: " margin-left .5s" }}
//       >
//         <div
//           className=" py-4 "
//           style={{
//             position: "relative",
//             transition: " margin-left .5s",
//             backgroundColor: "#880808",
//           }}
//         >
//           <div className="container text-white"></div>
//         </div>
//         <div className=" p-5 container" style={{ minHeight: "80vh" }}>
//           <form onSubmit={handledata}>
//             <div className="row my-2">
//               <div className="col-md-3">
//                 <label for="exampleInputEmail1"> Start Date</label>
//                 <input
//                   type="date"
//                   class="form-control"
//                   id="exampleInputEmail1"
//                   aria-describedby="emailHelp"
//                   defaultValue={getCurrentDateInput()}
//                   required
//                   onChange={(e) => setstartdate(e.target.value)}
//                 />
//               </div>

//               <div className="col-md-3">
//                 <label for="exampleInputEmail1"> End Date</label>
//                 <input
//                   type="date"
//                   class="form-control"
//                   id="exampleInputEmail1"
//                   aria-describedby="emailHelp"
//                   defaultValue={getCurrentDateInput()}
//                   required
//                   onChange={(e) => setenddate(e.target.value)}
//                 />
//               </div>

//               <div className="col-md-2 my-auto mt-4">
//                 <button className="btn mybtn">Submit</button>
//               </div>
//               {getdata && getdata.length !== 0 && (
//                 <>
//                   <div className="col-md-2 my-auto mt-4 text-end">
//                     <ReactToPrint
//                       trigger={() => <button className="btn mybtn">Print as PDF</button>}
//                       content={() => componentRef}
//                     />
//                   </div>
//                   <div className="col-md-2 my-auto mt-4 text-end">
//                     <ReactHTMLTableToExcel
//                       id="test-table-xls-button"
//                       className="download-table-xls-button btn mybtn"
//                       table="table-to-xls"
//                       filename="platlets Expire"
//                       sheet="tablexls"
//                       buttonText="Download as XLS"
//                     />
//                   </div>
//                 </>
//               )}
//             </div>
//           </form>
//           <div ref={(el) => (componentRef = el)}>
//             <div>
//               <div>
//                 <h1 className="Heading">Platelets Expire</h1>
//               </div>
//             </div>
//             <table
//               class="table table-responsive"
//               id="table-to-xls"

//             >
//               <thead>
//                 <tr>
//                   <th scope="col" style={{ textAlign: "left" }}>
//                     {" "}
//                     Sr. No.
//                   </th>
//                   <th scope="col" style={{ textAlign: "left" }}>
//                     {" "}
//                     Date of Donation
//                   </th>
//                   <th scope="col" style={{ textAlign: "left" }}>
//                     Expire Date
//                   </th>
//                   <th scope="col" style={{ textAlign: "left" }}>
//                     Donor Number
//                   </th>
//                   <th scope="col" style={{ textAlign: "left" }}>
//                     Name
//                   </th>
//                   <th scope="col" style={{ textAlign: "left" }}>
//                     Blood Group
//                   </th>
//                   <th scope="col" style={{ textAlign: "left" }}>
//                     Quantity
//                   </th>
//                   <th scope="col">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {getdata &&
//                   getdata.map((c, no) => (
//                     <>
//                       <tr style={{ textAlign: "left" }} key={c.id}>
//                         <td style={{ textAlign: "left" }}>{no + 1}</td>
//                         <td style={{ textAlign: "left" }}>{`${c.dod
//                           .toString()
//                           .slice(6)}-${c.dod.toString().slice(4, 6)}-${c.dod
//                           .toString()
//                           .slice(0, 4)}`}</td>
//                         <td style={{ textAlign: "left" }}>{`${c.exp
//                           .toString()
//                           .slice(6)}-${c.exp.toString().slice(4, 6)}-${c.exp
//                           .toString()
//                           .slice(0, 4)}`}</td>
//                         <td style={{ textAlign: "left" }}>{c.donorno}</td>
//                         <td style={{ textAlign: "left" }}>{c.name}</td>
//                         <td style={{ textAlign: "left" }}>{c.bloodGroupName}</td>
//                         <td style={{ textAlign: "left" }}>{c.qty}</td>
//                         <td>
//                         <button type="submit" class="btn mybtn  text-white mt-2">
//                     Discard
//                   </button>
//                         </td>
//                       </tr>
//                     </>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         <Footer />
//       </section>
//     </>
//   );
// };

// export default ExpireReport;

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useGetApi, usePostApi } from "../../../utils/Customhooks/ApiCalls";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import Footer from "../../../components/footer/Footer";
import ReactToPrint from "react-to-print";

const ExpireReport = () => {
  const [key, setKey] = useState(0); // Introduce a key for component reinitialization
  const {
    data: getdata,
    isLoading,
    error,
    doFetch,
  } = useGetApi(
    `/api/ExpireStock?FromDate=${getCurrentDateInput()
      .split("-")
      .join("")}&ToDate=${getCurrentDateInput().split("-").join("")}`
  );
  const [startdate, setstartdate] = useState("");
  const [enddate, setenddate] = useState("");
  const componentRef = useRef();
  useEffect(() => {
    // Load initial data
    doFetch(`/api/ExpireStock?FromDate=${startdate}&ToDate=${enddate}`);
  }, [startdate, enddate, key]);

  const handleData = (e) => {
    e.preventDefault();
    try {
      let start, end;

      // Date formatting utility function
      const formatDate = (date) => date.split("-").join("");

      start = startdate
        ? formatDate(startdate)
        : formatDate(getCurrentDateInput());
      end = enddate ? formatDate(enddate) : formatDate(getCurrentDateInput());

      doFetch(`/api/ExpireStock?FromDate=${start}&ToDate=${end}`);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleDiscard = async (id) => {
    try {
      const response = await fetch(`http://api2.easyblood.in/api/ExpireStock?Id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Auth": localStorage.getItem("token"),
        },
        body: JSON.stringify({ itemId: id }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        try {
          let start, end;
    
          // Date formatting utility function
          const formatDate = (date) => date.split("-").join("");
    
          start = startdate
            ? formatDate(startdate)
            : formatDate(getCurrentDateInput());
          end = enddate ? formatDate(enddate) : formatDate(getCurrentDateInput());
    
          doFetch(`/api/ExpireStock?FromDate=${start}&ToDate=${end}`);
        } catch (error) {
          alert(error.response.data.message);
        }
  
        // Update the key to reinitialize the component
        setKey((prevKey) => prevKey + 1);

      } else {
        console.error("Failed to discard item", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  return (
    <>
      <Sidebar />
      <section className="push" style={{ position: "relative", transition: "margin-left .5s" }}>
        <div className="py-4" style={{ position: "relative", transition: "margin-left .5s", backgroundColor: "#880808" }}>
          <div className="container text-white"></div>
        </div>
        <div className="p-5 container" style={{ minHeight: "80vh" }}>
          <form onSubmit={handleData}>
            <div className="row my-2">
              <div className="col-md-3">
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="startDate"
                  defaultValue={getCurrentDateInput()}
                  required
                  onChange={(e) => setstartdate(e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="endDate"
                  defaultValue={getCurrentDateInput()}
                  required
                  onChange={(e) => setenddate(e.target.value)}
                />
              </div>

              <div className="col-md-2 my-auto mt-4">
                <button type="submit" className="btn mybtn">
                  Submit
                </button>
              </div>
              {getdata && getdata.length !== 0 && (
                <>
                  <div className="col-md-2 my-auto mt-4 text-end">
                    <ReactToPrint
                      trigger={() => <button className="btn mybtn">Print as PDF</button>}
                      content={() => componentRef}
                    />
                  </div>
                  <div className="col-md-2 my-auto mt-4 text-end">
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      className="download-table-xls-button btn mybtn"
                      table="table-to-xls"
                      filename="platlets Expire"
                      sheet="tablexls"
                      buttonText="Download as XLS"
                    />
                  </div>
                </>
              )}
            </div>
          </form>
          <div ref={componentRef}>
            <div>
              <div>
                <h1 className="Heading">Platelets Expire</h1>
              </div>
            </div>
            <table className="table table-responsive" id="table-to-xls">
              <thead>
                <tr>
                  <th scope="col" style={{ textAlign: "left" }}>
                    Sr. No.
                  </th>
                  <th scope="col" style={{ textAlign: "left" }}>
                    Date of Donation
                  </th>
                  <th scope="col" style={{ textAlign: "left" }}>
                    Expire Date
                  </th>
                  <th scope="col" style={{ textAlign: "left" }}>
                    Donor Number
                  </th>
                  <th scope="col" style={{ textAlign: "left" }}>
                    Name
                  </th>
                  <th scope="col" style={{ textAlign: "left" }}>
                    Blood Group
                  </th>
                  <th scope="col" style={{ textAlign: "left" }}>
                    Quantity
                  </th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {getdata &&
                  getdata.map((c, no) => (
                    <tr style={{ textAlign: "left" }} key={c.id}>
                      <td style={{ textAlign: "left" }}>{no + 1}</td>
                      <td style={{ textAlign: "left" }}>{`${c.dod
                        .toString()
                        .slice(6)}-${c.dod.toString().slice(4, 6)}-${c.dod
                        .toString()
                        .slice(0, 4)}`}</td>
                      <td style={{ textAlign: "left" }}>{`${c.exp
                        .toString()
                        .slice(6)}-${c.exp.toString().slice(4, 6)}-${c.exp
                        .toString()
                        .slice(0, 4)}`}</td>
                      <td style={{ textAlign: "left" }}>{c.donorno}</td>
                      <td style={{ textAlign: "left" }}>{c.name}</td>
                      <td style={{ textAlign: "left" }}>{c.bloodGroupName}</td>
                      <td style={{ textAlign: "left" }}>{c.qty}</td>
                      <td>
                        <button
                          type="button"
                          className="btn mybtn text-white mt-2"
                          onClick={() => {
                            handleDiscard(c.id); // Set the selected item here
                          }}
                        >
                          Discard
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default ExpireReport;
