import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import Footer from "../../../components/footer/Footer";

const OpeningStock = () => {
  const [openingstock, setopeningstock] = useState([]);
  const [isLoading, setisLoading] = useState(false);

  const [del, setdel] = useState(false);

  useEffect(() => {
    getdata();
  }, [del]);

  const getdata = async () => {
    try {
      setisLoading(true)
      const { data } = await axiosInstance.get("/api/openingstock", {
        headers: {
          Auth: localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      });

      setopeningstock(data);
      setisLoading(false)
    } catch (error) {
      alert(error.response.data.message);
      setisLoading(false)
    }
  };
  const deleteopeningstock = async (id, e) => {
    e.preventDefault();

    try {
      const answer = window.confirm("Are You Sure !");

      if (answer) {
        const res = await axiosInstance.delete(`/api/openingstock/${id}`, {
          headers: {
            Auth: localStorage.getItem("token"),
          },
        });

        if (res && res.status === 200) {
          setdel(!del);
        }
      }
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
          <div>
            <div className="row">
              <div className="col-md-6">
              <Link className="btn  mybtn m-2" to="/admin/add-openingstock">
              Add Blood Opening Stock{" "}
            </Link>
            </div>
             {!isLoading && openingstock && openingstock.length !== 0 && (
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
                        Total Count :- {openingstock.length }
                      </span>
                    </h6>
                  </div>
                </>
              )}

              

            </div>
            
          </div>
          <table class="table table-responsive">
            <thead>
              <tr>
                <th scope="col">Sr. No.</th>
                <th scope="col">Date</th>
                <th scope="col"> Blood Group</th>
                <th scope="col"> Blood Components</th>
                <th scope="col"> Donor No.</th>
                {/* <th scope="col">Display Index</th> */}
                {/* <th scope="col">City Name</th>
                                    <th scope="col">Place Name</th> */}

                <th scope="col" colspan="3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {openingstock &&
                openingstock.map((c, no) => (
                  <>
                    <tr>
                      <th scope="row">{no + 1}</th>
                      {/* {
                        c.date && <>
                        
                        </>
                      } */}

                      <td>
                        {c.date &&
                          `${c?.date?.toString().slice(6)}-${c?.date
                            ?.toString()
                            .slice(4, 6)}-${c?.date?.toString().slice(0, 4)}`}
                      </td>
                      <td>{c.bloodGroupName}</td>
                      <td>{c.bloodComponentName}</td>
                      <td>{c.donorNo}</td>
                      {/* <td>{c.displayIndex}</td> */}
                      {/* <td>{c.City.name}</td>
                                                <td>{c.Place.name}</td> */}
                      {/* <td>{c?.Category?.name}</td>
                                            <td>{c.openingstockShortDescription}</td> */}
                      <td>
                        <Link
                          className="btn  mybtn mx-2 text-white"
                          to={`/admin/edit-openingstock/${c.id}`}
                        >
                          {" "}
                          <FiEdit2 />{" "}
                        </Link>
                        <button
                          className="btn  mybtn text-white"
                          onClick={(e) => deleteopeningstock(c.id, e)}
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

export default OpeningStock;
