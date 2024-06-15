import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import Footer from "../../../components/footer/Footer";

const EditStockItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [StockItem, setStockItem] = useState();
  const [openingstock, setopeningstock] = useState();
  const [date, setdate] = useState();
  

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      const { data } = await axiosInstance.get(`/api/StockItem/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });

      if (data) {
        setdate(
          `${data.date.toString().slice(0, 4)}-${data.date
            .toString()
            .slice(4, 6)}-${data.date.toString().slice(6)}`
        );
        setStockItem(data.name);
        setopeningstock(data.openingStock)
        // setDisplayIndex(data?.displayIndex || 0);
      }
    } catch (error) {
      
    }
  };

  const handlesubmit = async () => {
    try {
      const res = await axiosInstance.put(
        `/api/StockItem/${id}`,
        {
          name: StockItem,
          "openingStock":Number(openingstock),
          Date: Number(date.split("-").join("")),
        //   displayIndex: DisplayIndex === "" ? Number(0) : Number(DisplayIndex),
        },
        {
          headers: {
            Auth: localStorage.getItem("token"),
          },
        }
      );

      if (res && res.status === 200) {
        alert("updated Successfully");

        navigate("/admin/stock-item");
      }
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
          <div className="container text-white">
            <h2> </h2>
          </div>
        </div>
        <div className="container " style={{minHeight:"80vh"}}>
          <div className="text-center">
            <h2>Edit StockItem</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">
              <br />
              <div className="row">
              <div className="col-6">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Date
                  </label>
                  <div className="input-group ">
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={date}
                      onChange={(e) => setdate(e.target.value)}
                      placeholder="Set Date"
                      aria-label="Recipient's name"
                      aria-describedby="basic-addon2"
                    />
                  </div>
                </div>
                <div class="col-6">
                  <label for="exampleInputEmail1" class="form-label">
                    Stock Item
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    required
                    id="exampleInputEmail1"
                    name="bloodgroupname"
                    onChange={(e) => setStockItem(e.target.value)}
                    aria-describedby="emailHelp"
                    value={StockItem}
                  />
                </div>
                <div class="col-6">
                  <label for="exampleInputEmail1" class="form-label">
                   Blood Opening Stock
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    required
                    id="exampleInputEmail1"
                    name="bloodgroupname"
                    onChange={(e) => setopeningstock(e.target.value)}
                    aria-describedby="emailHelp"
                    value={openingstock}
                  />
                </div>
               
              </div>

              {/* 
                {
                  loading ? <>
                    <button type="submit" class="btn mybtn  text-white mt-2 disabled">
                      <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </button>
                  </> : <button type="submit" class="btn mybtn  text-white mt-2">Submit</button>
                } */}

              <button
                type="button"
                class="btn mybtn  text-white mt-2"
                onClick={() => handlesubmit()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default EditStockItem;
