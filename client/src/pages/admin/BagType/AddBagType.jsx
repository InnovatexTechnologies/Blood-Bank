import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import { useGetApi, usePostApi } from "../../../utils/Customhooks/ApiCalls";
import Footer from "../../../components/footer/Footer";
// import { CiLight } from "react-icons/ci";

const AddBagType = ({}) => {
  const [DisplayIndex, setDisplayIndex] = useState();
  const {  isLoading, doPost,  } = usePostApi("/api/BagType");
  const { data: bloodcomponetdata } = useGetApi("/api/bloodcomponent/");
  const { data: stockitemdata } = useGetApi("api/StockItem");

  // 

  const [BagType, setBagType] = useState("");
  const [qty, setQty] = useState();
  const [selectedboxdata, setselectedboxdata] = useState([]);
  // const [stockdata, setstockdata] = useState([]);
  const [inputboxdata, setinputboxdata] = useState([]);

  const navigate = useNavigate();

  const onChange = (id) => {
    if (selectedboxdata.includes(id)) {
      setselectedboxdata((boxdata) => boxdata.filter((p) => p !== id));
    } else {
      setselectedboxdata((boxdata) => [...boxdata, id]);
    }
  };


  

  const handleBagType = async (e) => {
    e.preventDefault();

    const ss = Object.keys(inputboxdata).map((p)=>{
      return{
        "stockItemId":Number(p),
        "qty":Number(inputboxdata[p])
      }
    })

    const bagconsumption = ss.filter((p)=>p.qty !== 0)


    await doPost({
      name: BagType,
      displayIndex: DisplayIndex === "" ? Number(0) : Number(DisplayIndex),
      Components: selectedboxdata.toString(),
      bagTypeConsumptions:bagconsumption,
      qty:Number(qty)
    });

    if (!isLoading) {
      navigate("/admin/BagType");
    }
  };


  const handleChange = (e) =>{
    const {name,value} = e.target;


  // setinputboxdata((prev)=>{
  //   prev.map((p)=>{
  //     if(p.name)
  //   })
  // })


    setinputboxdata((prev)=>(
      {
        ...prev,
        [name]:value
      }
    ))
    

    

  }

  // const handleAdd = (e,quantity) =>{
  //   e.preventDefault();

  //   const newobj = [];


    


  // }

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
            <h2>Add Bag Type</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">
              <form onSubmit={handleBagType}>
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
                      name="type"
                      onChange={(e) => setBagType(e.target.value)}
                      aria-describedby="emailHelp"
                      
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

                <div className="row">
                  {bloodcomponetdata &&
                    bloodcomponetdata.map((p) => (
                      <>
                        <div className="col-md-3">
                          <div class="form-check">
                            <input
                              type="checkbox"
                              checked={p.checked}
                              onChange={() => onChange(p.id)}
                            /> &nbsp;

                            <label
                              class="form-check-label"
                              for="flexCheckChecked"
                            >
                              {p.name}
                            </label>
                          </div>
                        </div>
                      </>
                    ))}
                </div>
                <hr style={{ width: "10px", color: "red" }} />

                <div className="mt-5">
                  <div className="d-flex justify-content-between w-100 border p-3 ">
                    <h6> Item Name</h6>
                    <div></div>
                    <h6>Quantity</h6>
                    {/* <button className="btn btn-secondary">Action</button> */}
                  </div>
                  {stockitemdata &&
                    stockitemdata.map((p) => (
                      <>
                        <div className="d-flex justify-content-between align-items-center w-100 border p-3 ">
                          {/* <div style={{ flex: 1 }}> */}
                            <h6>{p.name}</h6>
                          {/* </div> */}
                          {/* <div style={{ flex: 1 }}> */}
                            <input type="number" placeholder="Enter Quantity" name={p.id} onChange={handleChange}/>
                          {/* </div> */}
                          {/* <div
                            style={{
                              flex: 1,
                            }}
                          > */}
                            {/* <div className="text-center">
                              <button
                                className="btn btn-secondary text-center"
                                style={{ flex: 1 }}
                                type="button"
                                onClick={(e)=>handleAdd(e,p.id)}
                              >
                                Add Stock
                              </button>
                            </div> */}
                          {/* </div> */}
                        </div>
                      </>
                    ))}
                </div>
               

                <div className="d-flex justify-content-center mt-5">
                  {/* {
                  loading ? <>
                    <button type="submit" class="btn mybtn  text-white mt-2 disabled">
                      <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </button>
                  </> : <button type="submit" class="btn mybtn  text-white mt-2">Submit</button>
                } */}

                  <button type="submit" class="btn mybtn  text-white mt-2">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer/>
      </section>
    </>
  );
};

export default AddBagType;
