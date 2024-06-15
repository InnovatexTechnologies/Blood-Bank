import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useGetApi } from "../../../utils/Customhooks/ApiCalls";
import BloodComponentsComp from "../../../components/SetBloodComponents/BloodComponentsComp";
import BagConsumption from "../../../components/editbagconsumption/BagConsumption";
import Footer from "../../../components/footer/Footer";
// import BagConsumption from "../../../components/editbagconsumption/BagConsumption";

const EditBagType = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [DisplayIndex, setDisplayIndex] = useState();
  const [BagType, setBagType] = useState();
  const [components, setcomponents] = useState();
  const { data: stockitemdata } = useGetApi("api/StockItem");
  // const [selectedboxdata, setselectedboxdata] = useState([]);
  const [bloodcomponetdata, setbloodcomponetdata] = useState([]);
  const [bagtypeconsumption, setbagtypeconsumption] = useState();
  const [stockitem, setstockitem] = useState([]);
  const [loader, setloader] = useState(false);
  const [qty, setQty] = useState();

  useEffect(() => {
    fetchdata();
  }, []);

  const fetchdata = async () => {
    try {
      setloader(true);
      const { data } = await axiosInstance.get(`/api/BagType/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });

      if (data) {
        setBagType(data.name);
        setDisplayIndex(data?.displayIndex);
        setcomponents(data.components);
        setbagtypeconsumption(data.bagTypeConsumptions);
        setQty(data.qty);
      }
      setloader(false);
    } catch (error) {
      setloader(false);
      alert(error.response.data.message);
    }
  };

  const onChange = (id) => {
    const newdata = bloodcomponetdata.map((input) => {
      if (input.id == id) {
        //
        return {
          ...input,
          checked: !input.checked,
        };
      } else {
        return input;
      }
    });
    //

    setbloodcomponetdata(newdata);
  };

  const handlesubmit = async () => {
    //

    const newrr = [];

    const newdata = bloodcomponetdata.map((p) => {
      if (p.checked) {
        newrr.push(p.id);
      }
    });

    try {
      const res = await axiosInstance.put(
        `/api/BagType/${id}`,
        {
          name: BagType,
          displayIndex: Number(DisplayIndex),
          Components: newrr.toString(),
          bagTypeConsumptions: stockitem,
          qty:Number(qty)
        },
        {
          headers: {
            Auth: localStorage.getItem("token"),
          },
        }
      );

      if (res && res.status === 200) {
        alert("updated Successfully");

        navigate("/admin/BagType");
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
          <div className="container text-white">
            <h2> </h2>
          </div>
        </div>
         <div className="container " style={{minHeight:"80vh"}}>
          <div className="text-center">
            <h2>Edit Bag Type</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">
              <br />
              <div className="row">
                <div class="col">
                  <label for="exampleInputEmail1" class="form-label">
                    Bag Type Name
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="exampleInputEmail1"
                    name="bloodgroupname"
                    onChange={(e) => setBagType(e.target.value)}
                    aria-describedby="emailHelp"
                    value={BagType}
                  />
                </div>
                <div class="col">
                  <label for="exampleInputEmail1" class="form-label">
                    Quantity
                  </label>
                  <input
                    type="number"
                    class="form-control"
                    id="exampleInputEmail1"
                    name="type"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    aria-describedby="emailHelp"
                  />
                </div>
                <div class="col">
                  <label for="exampleInputEmail1" class="form-label">
                    Display Index
                  </label>
                  <input
                    type="number"
                    min={0}
                    class="form-control"
                    id="exampleInputEmail1"
                    name="ProductName"
                    value={DisplayIndex}
                    onChange={(e) => setDisplayIndex(e.target.value)}
                    aria-describedby="emailHelp"
                  />
                </div>
              </div>

              <hr />
              {components && (
                <BloodComponentsComp
                  components={components}
                  bloodcomponetdata={bloodcomponetdata}
                  setbloodcomponetdata={setbloodcomponetdata}
                  onChange={onChange}
                />
              )}

              <hr />
              <hr style={{ width: "10px", color: "red" }} />
              {!loader && bagtypeconsumption && stockitemdata && (
                <BagConsumption
                  key={stockitemdata.id}
                  bagtypeconsumption={bagtypeconsumption}
                  stockitemdata={stockitemdata}
                  stockitem={stockitem}
                  setstockitem={setstockitem}
                />
              )}

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

export default EditBagType;
