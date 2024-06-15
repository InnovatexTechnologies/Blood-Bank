import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import Footer from "../../../components/footer/Footer";

const BloodComponents = () => {
  const [blood, setblood] = useState();

  const [del, setdel] = useState(false);

  useEffect(() => {
    getdata();
  }, [del]);

  const getdata = async () => {
    try {
      const { data } = await axiosInstance.get("/api/bloodcomponent", {
        headers: {
          Auth: localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      });

      

      setblood(data);
    } catch (error) {
      
    }
  };

  const deletebloodcomponents = async (id, e) => {
    e.preventDefault();
    
    try {
      const res = await axiosInstance.delete(`/api/bloodcomponent/${id}`, {
        headers: {
          Auth: localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      });

      
      if (res.statusText === "OK") {
        getdata();
        alert("delete successfully");
      }
    } catch (error) {
      alert("Something Went Wrong Fromthe server");
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
            {/* <Link className="btn  mybtn " to="/admin/addblood-components">
              Add Blood Components
            </Link> */}
          </div>
          <table class="table  mt-2 table-responsive">
            <thead>
              <tr>
                <th scope="col">Sr. No.</th>
                <th scope="col">Blood Components Name</th>
                <th scope="col">Exp. Date</th>
                <th scope="col">Display Index</th>
                {/* <th scope="col">City Name</th>
                                    <th scope="col">Place Name</th> */}

                {/* <th scope="col" colspan="3">
                  Action
                </th> */}
              </tr>
            </thead>
            <tbody>
              {blood &&
                blood.map((c, no) => (
                  <>
                    <tr>
                      <th scope="row">{no + 1}</th> 
                      <td >{c.name}</td>
                      <td >{c.expireDays}</td>
                      <td >{c.displayIndex}</td>
                      {/* <td>{c.City.name}</td>
                                                <td>{c.Place.name}</td> */}

                      {/* <td>
                        <Link
                          className="btn  mybtn mx-2"
                          to={`/admin/blood-components/${c.id}`}
                        >
                          {" "}
                          <FiEdit2 />{" "}
                        </Link>
                        <button
                          className="mybtn btn"
                          onClick={(e) => deletebloodcomponents(c.id, e)}
                        >
                          <AiTwotoneDelete />
                        </button>
                      </td> */}
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

export default BloodComponents;
