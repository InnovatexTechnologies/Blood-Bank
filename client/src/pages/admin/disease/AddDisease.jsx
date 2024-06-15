import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../config';
import Sidebar from '../../../components/sidebar/Sidebar';
import Footer from '../../../components/footer/Footer';



const AddDisease = () => {

  const navigate = useNavigate();


  const [apicall, setapicall] = useState({
    loading: false,
    error: false
  })


  const { loading } = apicall

  const [disease, setdisease] = useState()

  const [DisplayIndex, setDisplayIndex] = useState("");



  const handlegymSubmit = async (e) => {
    e.preventDefault();
    setapicall({ ...apicall, loading: true })
    try {
      const res = await axiosInstance.post(`/api/discard`, {
        "reason": disease,
        displayIndex: DisplayIndex === "" ? Number(0): Number(DisplayIndex),
      }, {
        headers: {
          "Auth": localStorage.getItem("token")
        }
      })

      if (res && res.status === 200) {
        alert("Created Successfully")
        setapicall({ ...apicall, loading: false })
        navigate("/admin/disease")
      }

    } catch (error) {
      setapicall({ ...apicall, loading: false })
      alert(error.response.data.message)
    }

  }

  return (
    <>
      <Sidebar />
      <section className="push " style={{ position: 'relative', transition: ' margin-left .5s' }}>
        <div className=" py-4 " style={{ position: 'relative', transition: ' margin-left .5s', backgroundColor: '#880808' }}>
          <div className="container text-white">
            <h2> </h2>
          </div>
        </div>
         <div className="container " style={{minHeight:"80vh"}}>
          <div className="text-center">
            <h2>Add Disease</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">

              <form onSubmit={handlegymSubmit}>
                <br />
                <div className="row">
                
                  <div class="col">
                    <label for="exampleInputEmail1" class="form-label">Disease Name</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" name="ProductName" onChange={(e) => setdisease(e.target.value)} aria-describedby="emailHelp" />
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
                      onChange={(e) => setDisplayIndex(e.target.value)}
                      aria-describedby="emailHelp"
                    />
                  </div>

                </div>

                {/* <div className="row">
                  <div class="col">
                    {
                      City !== "" && <>
                        <label for="exampleInputEmail1" class="form-label"> Place</label>
                        <select class="form-select" aria-label="Default select example" name="Place" onChange={onChange}>
                          <option selected>Select Place</option>
                          {
                            place && place.filter((cat) => cat.City._id === City).map((s) => (
                              <>
                                <option value={s._id}>{s.name}</option>
                              </>
                            ))
                          }
                          
                        </select>
                      </>
                    }

                  </div>

                </div> */}


                {/* 
                <div className="row">
                  <div class="col">
                    <label for="exampleInputEmail1" class="form-label">
                      Blood Group Description</label>
                    <textarea type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="ProductShortDescription" onChange={onChange} />
                  </div>
                </div> */}


                {/* {
                  loading ? <>
                    <button type="submit" class="btn mybtn  text-white mt-2 disabled">
                      <div class="spinner-border" role="status">
                       
                      </div>
                    </button>
                  </> : <button type="submit" class="btn mybtn  text-white mt-2">Submit</button>
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

export default AddDisease