import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { axiosInstance } from "../../../config";
import Sidebar from "../../../components/sidebar/Sidebar";
import Footer from "../../../components/footer/Footer";

const Disease = () => {
  const [blood, setblood] = useState();

  const [del, setdel] = useState(false);

  useEffect(() => {
    getdata();
  }, [!del]);

  const getdata = async () => {
    try {
      const { data } = await axiosInstance.get("/api/discard", {
        headers: {
          Auth: localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      });

      setblood(data);
    } catch (error) {
      
    }
  };

  const deleteblood = async (id, e) => {
    e.preventDefault();

    try {
      const answer = window.confirm("Are You Sure !");

      if (answer) {
        const res = await axiosInstance.delete(`/api/discard/${id}`, {
          headers: {
            Auth: localStorage.getItem("token"),
          },
        });

        

        if (res && res.status === 200) {
          setdel(!del);
        }
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
            <Link className="btn  mybtn " to="/admin/add-disease">
              Add Disease
            </Link>
          </div>
          <table class="table table-responsive">
            <thead>
              <tr>
                <th scope="col">Sr. No.</th>
                <th scope="col">Reason</th>
                <th scope="col">Display Index</th>
                {/* <th scope="col">City Name</th>
                                    <th scope="col">Place Name</th> */}

                <th scope="col" colspan="3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {blood &&
                blood.map((c, no) => (
                  <>
                    <tr>
                      <th scope="row">{no + 1}</th> 
                      {/* <td>{c.City.name}</td>
                                                <td>{c.Place.name}</td> */}
                      <td>{c.reason}</td>
                      <td>{c.displayIndex}</td>
                      <td>
                        <Link
                          className="btn  mybtn mx-2"
                          to={`/admin/edit-disease/${c.id}`}
                        >
                          {" "}
                          <FiEdit2 />{" "}
                        </Link>
                        <button
                          className="btn  mybtn"
                          onClick={(e) => deleteblood(c.id, e)}
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

export default Disease;
