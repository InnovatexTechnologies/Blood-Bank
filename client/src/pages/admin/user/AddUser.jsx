import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../../config';
import Sidebar from '../../../components/sidebar/Sidebar';
import Footer from '../../../components/footer/Footer';


const AddUser = () => {

  const navigate = useNavigate();


  const [apicall, setapicall] = useState({
    loading: false,
    error: false
  })


  const { loading } = apicall


  const [user, setuser] = useState({
    name: "",
    password: "",
  })



  const onChange = (e) => {
    setuser({ ...user, [e.target.name]: e.target.value })
  }


  const handlegymSubmit = async (e) => {
    e.preventDefault();
    setapicall({ ...apicall, loading: true })
    try {
      const res = await axiosInstance.post(`/api/user`, {
        "name": user.name,
        "password": user.password
      }, {
        headers: {
          "Auth": localStorage.getItem("token")
        }
      })
      if (res && res.status === 200) {
        alert("Created Successfully")
        setapicall({ ...apicall, loading: false })
        navigate("/admin/user")
      }

      // 

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
            <h2>Add User</h2>
          </div>
          <div className="row justify-content-center py-2">
            <div className="col-lg-8 ">

              <form onSubmit={handlegymSubmit}>
                <br />

                <div className="row">
                  <div class="col">
                    <label for="exampleInputEmail1" class="form-label"> Name</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" name="name" onChange={onChange} aria-describedby="emailHelp" />
                  </div>

                </div>
                <div className="row">
                  <div class="col">
                    <label for="exampleInputEmail1" class="form-label">Password</label>
                    <input type="text" class="form-control" id="exampleInputEmail1" name="password" onChange={onChange} aria-describedby="emailHelp" />
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

export default AddUser