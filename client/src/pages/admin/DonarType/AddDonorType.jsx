import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../config';
import Sidebar from '../../../components/sidebar/Sidebar';
import { usePostApi } from '../../../utils/Customhooks/ApiCalls';
import Footer from '../../../components/footer/Footer';


const AddDonorType = () => {

  const { data, isLoading, error, doPost, setUrl } = usePostApi("/api/DonorType")

    const [AddDonorType, setAddDonorType ] = useState("")
    const [DisplayIndex, setDisplayIndex] = useState("");

    const navigate = useNavigate();

    

    const handleAddDonorType  = async(e) =>{
        e.preventDefault();

       await doPost({
            "name":AddDonorType,
            displayIndex:DisplayIndex === "" ?Number(0): Number(DisplayIndex),
        })

        if(!isLoading){
            navigate('/admin/DonorType')
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
            <h2>Add DonorType</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">

              <form onSubmit={handleAddDonorType}>
                <br />

                <div className="row">
                  <div class="col">
                    <label for="exampleInputEmail1" class="form-label">Donor Type </label>
                    <input type="text" class="form-control" id="exampleInputEmail1" name="type" onChange={(e)=>setAddDonorType(e.target.value)} aria-describedby="emailHelp" />
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
                <div className='d-flex justify-content-center mt-5'>
                  {/* {
                  loading ? <>
                    <button type="submit" class="btn mybtn  text-white mt-2 disabled">
                      <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                      </div>
                    </button>
                  </> : <button type="submit" class="btn mybtn  text-white mt-2">Submit</button>
                } */}

                  <button type="submit" class="btn mybtn  text-white mt-2">Submit</button>



                </div>



              </form>
            </div>
          </div>


        </div>
        <Footer/>
      </section>


    </>
  )
}

export default AddDonorType