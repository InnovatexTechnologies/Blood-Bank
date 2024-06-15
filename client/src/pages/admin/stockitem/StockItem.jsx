import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useDeleteApi, useGetApi } from "../../../utils/Customhooks/ApiCalls";
import Footer from "../../../components/footer/Footer";

const StockItem = () => {
  const {
    data: getdata,
    isLoading,
    error,
    doFetch,
  } = useGetApi("api/StockItem");
  const {
    data: deletedata,
    isLoading: deleteloading,
    error: deleteerror,
    doDelete,
  } = useDeleteApi("api/StockItem");

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
            <Link className="btn  mybtn " to="/admin/add-stock-item">
              Add Stock Item
            </Link>
          </div>
          <table class="table table-responsive">
            <thead>
              <tr>
                <th scope="col">Sr. No.</th>
                <th scope="col">Date</th>
                <th scope="col"> Name</th>
                <th scope="col">Blood Opening Stock</th>
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
                      <th scope="row">{no + 1}</th>
                      <td>
                        {c.date &&
                          `${c.date.toString().slice(6)}-${c.date
                            .toString()
                            .slice(4, 6)}-${c.date.toString().slice(0, 4)}`}
                      </td>
                      <td>{c.name}</td>
                      <td>{c.openingStock}</td>

                      <td>
                        <Link
                          className="btn mybtn text-white mx-1"
                          to={`/admin/edit-stock-item/${c.id}`}
                        >
                          {" "}
                          <FiEdit2 />{" "}
                        </Link>
                        <button
                          className="btn mybtn text-white"
                          onClick={async (e) => {
                            await doDelete(`/api/StockItem/${c.id}`);
                            await doFetch(`/api/StockItem`);
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

export default StockItem;
