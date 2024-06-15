import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useGetApi, usePostApi } from "../../../utils/Customhooks/ApiCalls";
import { getCurrentDateInput } from "../../../utils/func/datefunc";
import Footer from "../../../components/footer/Footer";

const AddStockPurchase = () => {
  const navigate = useNavigate();
  // const { data: stockitem } = useGetApi("/api/stockitem");
  const { data: stockitem } = useGetApi("/api/StockItem");
  const {
    isLoading: postloading,
    doPost,
    setUrl,
  } = usePostApi("/api/stockpurchase");

  const [formData, setFormData] = useState({
    Date: "",
    Qty: "",
    remarks: "",
    stockitem: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleIssue = async (e) => {
    e.preventDefault();

    await doPost({
      Date:
        formData.Date === ""
          ? Number(getCurrentDateInput().split("-").join(""))
          : Number(formData.Date.split("-").join("")),
      StockItemId: Number(formData.stockitem),
      Qty: Number(formData.Qty),
      Remark: formData.remarks,
    });

    if (!postloading) {
      navigate("/admin/stock-purchase");
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
          <div>
            <h1 className="Heading">Stock Purchase</h1>
          </div>

          <div className="p-2 ReferralLeadModal-Content">
            <form onSubmit={handleIssue}>
              <div
                className="row "
                style={{
                  rowGap: "8px",
                }}
              >
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Date Of Purchase
                  </label>
                  <div className="input-group ">
                    <input
                      type="date"
                      className="form-control"
                      name="Date"
                      onChange={handleInputChange}
                      placeholder="Name"
                      defaultValue={getCurrentDateInput()}
                      required
                      autoFocus
                      aria-label="Recipient's name"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Stock Item
                  </label>
                  <div className="input-group">
                    <select
                      name="stockitem"
                      class="form-select"
                      required
                      onChange={handleInputChange}
                    >
                      <option value="" disabled selected>
                        Stock Item
                      </option>

                      {stockitem &&
                        stockitem.map((p) => (
                          <option value={p.id}>{p.name}</option>
                        ))}
                    </select>
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Quantity
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      name="Qty"
                      required
                      onChange={handleInputChange}
                      placeholder="Quantity"
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>
                <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Remarks
                  </label>
                  <div className="input-group ">
                    <input
                      type="text"
                      className="form-control"
                      name="remarks"
                      onChange={handleInputChange}
                      placeholder="Remarks"
                      aria-label="Recipient's name"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>

                {/* <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Display Index
                  </label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"

                      min={0}
                      name="displayindex"
                      onChange={handleInputChange}
                      placeholder="Display Index"
                      aria-label="Recipient's Number"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div> */}
                <div>
                  <button
                    type="submit"
                    class="btn "
                    style={{
                      background: "#880808",
                      color: "white",
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default AddStockPurchase;
