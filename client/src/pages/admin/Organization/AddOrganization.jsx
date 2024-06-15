import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../config';
import Sidebar from '../../../components/sidebar/Sidebar';
import { usePostApi } from '../../../utils/Customhooks/ApiCalls';
import Footer from '../../../components/footer/Footer';


const CreateOrganization = () => {

  const { data, isLoading, error, doPost, setUrl } = usePostApi("/api/organization")

    const [donationType, setOrganization ] = useState("")
    const [displayIndex, setdisplayIndex ] = useState("")

    const navigate = useNavigate();

    

    const handleOrganization  = async(e) =>{
        e.preventDefault();

       await doPost({
            "name":donationType,
            "displayIndex":displayIndex === "" ?Number(0): Number(displayIndex),
        })

        if(!isLoading){
            navigate('/admin/Organization')
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
            <h2>Add Organization</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">

              <form onSubmit={handleOrganization}>
                <br />

                <div className="row">
                  <div class="col">
                    <label for="exampleInputEmail1" class="form-label">Organization Name</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" name="name" onChange={(e)=>setOrganization(e.target.value)} aria-describedby="emailHelp" />
                  </div>
                  <div class="col">
                    <label for="exampleInputEmail1" class="form-label">Display Index</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" name="" onChange={(e)=>setdisplayIndex(e.target.value)} aria-describedby="emailHelp" />
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

export default CreateOrganization