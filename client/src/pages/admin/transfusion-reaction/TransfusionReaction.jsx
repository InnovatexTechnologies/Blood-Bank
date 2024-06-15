import React from "react";
import { Link } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useDeleteApi, useGetApi } from "../../../utils/Customhooks/ApiCalls";
import Footer from "../../../components/footer/Footer";

const TransfusionReaction = () => {
  const {
    data: getdata,
    isLoading,
    doFetch,
  } = useGetApi(`/api/Transfusion`);

  const {
    doDelete,
  } = useDeleteApi("/api/Transfusion");

  const handleDelete = async (e, id) => {
    e.preventDefault();
    try {
      // let start = startdate.split("-").join("");
      // let end = enddate.split("-").join("");

      await doDelete(`/api/Transfusion/${id}`);
      await doFetch(`/api/Transfusion`);
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
        <div className=" p-5 container" style={{minHeight:"80vh"}}>
          <div className="mb-3">
            <div className="row">
              <div className="col-md-6">
                <Link
                  className="btn  mybtn"
                  to="/admin/add-transfusion-reaction"
                >
                  Add Transfusion/Reaction
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
          </div>

          {getdata && getdata.length !== 0 && (
            <div className="table-responsive">
              <table class="table  table-sm table-bordered" id="table-to-xls">
                <thead>
                  <tr>
                    <th scope="col " style={{ whiteSpace: "nowrap" }}>
                      Date of Trans/React
                    </th>

                    <th scope="col " style={{ whiteSpace: "nowrap" }}>
                      {" "}
                      Supply No
                    </th>
                    {/* <th scope="col " style={{whiteSpace:"nowrap"}}> bloodGroupId</th> */}
                    {/* <th scope="col " style={{whiteSpace:"nowrap"}}> bagTypeId</th> */}
                    <th scope="col " style={{ whiteSpace: "nowrap" }}>
                      Hospital Name
                    </th>

                    <th scope="col " style={{ whiteSpace: "nowrap" }}>
                      {" "}
                      <div>Previous Donor No.</div>
                    </th>
                    <th scope="col " style={{ whiteSpace: "nowrap" }}>
                      {" "}
                      <div>New Donor No.</div>
                    </th>

                    <th scope="col " style={{ whiteSpace: "nowrap" }}>
                      {" "}
                      Previous Component
                    </th>

                    <th scope="col " style={{ whiteSpace: "nowrap" }}>
                      {" "}
                      New Component
                    </th>
                    <th scope="col " style={{ whiteSpace: "nowrap" }}>
                      {" "}
                      Blood Group Name
                    </th>
                    <th scope="col " style={{ whiteSpace: "nowrap" }}>
                      {" "}
                      Reason
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
                          <td>
                            {c.date &&
                              `${c.date.toString().slice(6)}-${c.date
                                .toString()
                                .slice(4, 6)}-${c.date.toString().slice(0, 4)}`}
                          </td>
                          <td>{c.supplyNo}</td>
                          <td> {c.hospitalName}</td>
                          <td> {c.previousDonorNo}</td>
                          <td> {c.newDonorNo}</td>
                          <td> {c.previousComponentName}</td>
                          <td> {c.newComponentName}</td>
                          <td> {c.bloodGroupName}</td>
                          <td> {c.reason}</td>

                          {/* <td> </td> */}

                          <td>
                            <div className="d-flex">
                              <Link
                                className="btn mybtn text-white mx-1"
                                to={`/admin/edit-transfusion-reaction/${c.id}`}
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
          )}
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default TransfusionReaction;
