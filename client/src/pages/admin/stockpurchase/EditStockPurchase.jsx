import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import {
  useGetApi,
  usePostApi,
  usePutApi,
} from "../../../utils/Customhooks/ApiCalls";
import Footer from "../../../components/footer/Footer";

const EditStockPurchase = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const { data: stockitem } = useGetApi("/api/StockItem");
  const { isLoading: puloading, doPut } = usePutApi(`/api/stockpurchase/${id}`);

  const [Date, setDate] = useState("");
  const [Qty, setQty] = useState("");
  const [remarks, setremarks] = useState("");
  const [stockitems, setstockitems] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/stockpurchase/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });

      

      if (data) {
        setDate(
          `${data.date.toString().slice(0, 4)}-${data.date
            .toString()
            .slice(4, 6)}-${data.date.toString().slice(6)}`
        );
        setQty(data.qty);
        setstockitems(data.stockItemId);
        setremarks(data.remark);
      }
    } catch (error) {}
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    try {
      await doPut({
        Date:Number(Date.split("-").join("")),
        StockItemId: Number(stockitems),
        Qty: Number(Qty),
        Remark: remarks,
      });

      if (!puloading) {
        navigate("/admin/stock-purchase");
      }
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
          <div>
            <h1 className="Heading">Edit Stock Purchase</h1>
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
                      value={Date}
                      onChange={(e) => setDate(e.target.value)}
                      placeholder="Name"
                      aria-label="Recipient's name"
                      aria-describedby="basic-addon2"
                      autoFocus
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
                      value={stockitems}
                      required
                      onChange={(e) => setstockitems(e.target.value)}
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
                      value={Qty}
                      onChange={(e) => setQty(e.target.value)}
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
                      value={remarks}
                      onChange={(e) => setremarks(e.target.value)}
                      placeholder="Remarks"
                      aria-label="Recipient's name"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>

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

export default EditStockPurchase;
