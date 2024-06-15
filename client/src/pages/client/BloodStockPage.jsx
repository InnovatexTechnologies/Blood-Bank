import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getCurrentDateInput } from "../../utils/func/datefunc";
import { axiosInstance } from "../../config";
import Footer from "../../components/footer/Footer";

const BloodStockPage = () => {
  const [openingstock, setopeningstock] = useState();
  const [newopeningStock, setnewopeningStock] = useState();

  useEffect(() => {
    getdata(
      `/api/stockreport?Date=${getCurrentDateInput().split("-").join("")}`
    );
  }, []);

  setTimeout(() => {
    getdata(
      `/api/stockreport?Date=${getCurrentDateInput().split("-").join("")}`
    );
  }, 60000); //Api Calling in 1 Minutes



  const getdata = async (url) => {
    try {
      const { data } = await axiosInstance.get(url, {
        headers: {
          Auth: localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*",
        },
      });

      const newarr = [];

      data.map((p) => {
        const index = newarr.findIndex(
          (item) => item.bloodGroupName === p.bloodGroupName
        );
        if (index !== -1) {
          newarr[index] = {
            ...newarr[index],
            [p["bloodComponentName"]]: p.totalQty,
          };
        } else {
          newarr.push({
            bloodGroupName: p.bloodGroupName,
            [p["bloodComponentName"]]: p.totalQty,
          });
        }
      });

      //

      setnewopeningStock(newarr);

      setopeningstock(data);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const sumcomponents = (objects) => {
    let totalsum =
      Number(objects["Plasma (FFP)"] || 0) +
      Number(objects["RBC"] || 0) +
      Number(objects["Whole Blood"] || 0) +
      Number(objects["Platelets"] || 0);

    return totalsum;
  };

  const reducedata = (name) => {
    const totalsum =
      newopeningStock &&
      newopeningStock.reduce(
        (total, item) => total + Number(item[name] || 0),
        0
      );

    //
    return totalsum;
  };

  const overAllSum = () => {
    const overallSum =
      openingstock &&
      openingstock.reduce(
        (total, item) => total + Number(item["totalQty"] || 0),
        0
      );

    // totalQty

    return overallSum;
  };

  return (
    <>
      <div className="container mt-5">
        <h1 className="Heading">Available Stock</h1>

        <div className="row">
          <table
            class="table table-responsive table-bordered"
            id="table-to-xls"
          >
            <thead>
              <tr>
                {/* <th scope="col">Sr. No.</th> */}
                {/* <th scope="col">Display Index</th> */}
                <th scope="col"> Blood Group</th>
                {/* <th scope="col"> Plasma</th> */}
                <th scope="col">Whole Blood</th>
                <th scope="col">RBC</th>
                <th scope="col"> Plasma (FFP)</th>
                <th scope="col"> Platelets</th>
                <th scope="col"> Total </th>
              </tr>
            </thead>
            <tbody>
              {newopeningStock &&
                newopeningStock.map((c, no) => (
                  <>
                    <tr>
                      {/* <th scope="row">{no + 1}</th> */}
                      {/* <td>{c.displayIndex}</td> */}
                      <td>{c.bloodGroupName}</td>
                      <td>{c["Whole Blood"] || 0}</td>
                      <td>{c["RBC"] || 0}</td>
                      <td>{c["Plasma (FFP)"] || 0}</td>
                      <td>{c["Platelets"] || 0}</td>
                      {/* <td>{Number(c["Whole Blood"] ||0) + Number(c["Whole Blood"] ||0) + Number(c["Platelets"]) + Number(c["Plasma (FFP)"])}</td> */}
                      <th>{sumcomponents(c)}</th>
                    </tr>
                  </>
                ))}
              <tr>
                <th>Total</th>
                <th>{reducedata("Whole Blood")}</th>
                <th>{reducedata("RBC")}</th>
                <th>{reducedata("Plasma (FFP)")}</th>
                <th>{reducedata("Platelets")}</th>
                <th>{overAllSum()}</th>
              </tr>
            </tbody>
          </table>
          <Footer/>
        </div>
      </div>
    </>
  );
};

export default BloodStockPage;
