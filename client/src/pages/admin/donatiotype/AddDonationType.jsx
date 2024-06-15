  import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../config';
import Sidebar from '../../../components/sidebar/Sidebar';
import { usePostApi } from '../../../utils/Customhooks/ApiCalls';
import Footer from '../../../components/footer/Footer';



const AddDonationType = () => {

    const { data, isLoading, error, doPost, setUrl } = usePostApi("api/donationtype")

    const [donationType, setdonationType] = useState("")
    const [DisplayIndex, setDisplayIndex] = useState("");

    const navigate = useNavigate();

    

    const handledonationType = async(e) =>{
        e.preventDefault();

       await doPost({
            "name":donationType,
            displayIndex:DisplayIndex === "" ?Number(0): Number(DisplayIndex),
        })

        if(!isLoading){
            navigate('/admin/donationtype')
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
            <h2>Add Donation Type</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">

              <form onSubmit={handledonationType}>
                <br />
                <div className="row">
                  <div class="col">
                    <label for="exampleInputEmail1" class="form-label">Donation Type</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" name="ProductName" onChange={(e) => setdonationType(e.target.value)} aria-describedby="emailHelp" />
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

export default AddDonationType