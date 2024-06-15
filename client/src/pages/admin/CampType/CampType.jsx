import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useDeleteApi, useGetApi } from "../../../utils/Customhooks/ApiCalls";
import Footer from "../../../components/footer/Footer";



const CampType = () => {
  const {
    data: getdata,
    isLoading,
    error,
    doFetch,
  } = useGetApi("/api/CampType");


  const {
    data: deletedata,
    isLoading: deleteloading,
    error: deleteerror,
    doDelete,
  } = useDeleteApi("/api/CampType");

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
            <Link className="btn  mybtn " to="/admin/add-CampType">
              Add CampType
            </Link>
          </div>
          <table class="table table-responsive">
            <thead>
              <tr>
                <th scope="col">Sr. No.</th>
                <th scope="col"> Name</th>
                <th scope="col">Display Index</th>
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
                      <th scope="row">{no + 1}</th>
                      <td>{c.name}</td>
                       <td>{c.displayIndex}</td>

                      <td>
                        <Link
                          className="btn mybtn text-white mx-1"
                          to={`/admin/edit-CampType/${c.id}`}
                        >
                          {" "}
                          <FiEdit2 />{" "}
                        </Link>
                        <button
                          className="btn mybtn text-white"
                          onClick={async(e) => {
                            await doDelete(`/api/CampType/${c.id}`);
                            await doFetch(`/api/CampType`);
                          }}
                        >
                          <AiTwotoneDelete />
                        </button>
                      </td>
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

export default CampType;
