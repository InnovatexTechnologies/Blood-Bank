import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '../../../config';
import Sidebar from '../../../components/sidebar/Sidebar';
import { useGetApi, usePutApi } from '../../../utils/Customhooks/ApiCalls';
import Footer from '../../../components/footer/Footer';




const EditDonationType = () => {

  const { id } = useParams();

  const navigate = useNavigate();
  const [donationtype, setdonationtype] = useState()
  const [DisplayIndex, setDisplayIndex] = useState("");



  useEffect(() => {
    fetchdata()
  }, [])


  const fetchdata = async () => {
    try {

      const { data } = await axiosInstance.get(`/api/donationtype/${id}`,
        {
          headers: {
            "Auth": localStorage.getItem("token")
          }
        })

      

      if (data) {
        setdonationtype(data.name)
        setDisplayIndex(data?.displayIndex || 0);
      }


    } catch (error) {
      

    }

  }


  const handlesubmit = async (e) => {
    e.preventDefault();
    try {

      const res = await axiosInstance.put(`/api/donationtype/${id}`, {
        "name": donationtype,
        displayIndex: DisplayIndex === "" ? Number(0) : Number(DisplayIndex),
      }, {
        headers: {
          "Auth": localStorage.getItem("token")
        }
      })


      if (res && res.status === 200) {
        alert("updated Successfully")

        navigate("/admin/donationtype")
      }

    } catch (error) {

    }
  }





















  return (
    <>
      <Sidebar />
      <section className="push " style={{ position: 'relative', transition: ' margin-left .5s' }}>
        <div className=" py-4 " style={{ position: 'relative', transition: ' margin-left .5s', backgroundColor: '#880808' }}>
          <div className="container text-white">
            {/* <h2>Blood Bank</h2> */}
          </div>
        </div>
         <div className="container " style={{minHeight:"80vh"}}>
          <div className="text-center">
            <h2>Edit Disease</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8">

              <form onSubmit={handlesubmit}>
                <br />
                <div className="row">
                  <div class="col">
                    <label for="exampleInputEmail1" class="form-label">Disease Name</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" name="name" value={donationtype} onChange={(e) => setdonationtype(e.target.value)} aria-describedby="emailHelp" />
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


                {/* {
                                    loader ? <>
                                        <button type="submit" class="btn mybtn  text-white mt-2 disabled">Updating Please Wait </button>

                                    </> : <>
                                        <button type="submit" class="btn mybtn  text-white mt-2">Submit</button>
                                    </>
                                } */}

                <button type="submit" class="btn mybtn  text-white mt-2">Submit</button>



              </form>
            </div>
          </div>


        </div>
        <Footer/>
      </section>



    </>
  )
}

export default EditDonationType