import { Link } from 'react-router-dom';
import Sidebar from '../../../components/sidebar/Sidebar';
import { AiTwotoneDelete } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import { useGetApi, useDeleteApi } from '../../../utils/Customhooks/ApiCalls';
import { useEffect, useState } from 'react';
import Footer from '../../../components/footer/Footer';

const DonationType = () => {
    const { data: getdata, isLoading, error, doFetch } = useGetApi("/api/donationtype")
    const { data: deletedata, isLoading: deleteloading, error: deleteerror, doDelete } = useDeleteApi("/api/donationtype")




    return (
        <>
            <Sidebar />
            <section className="push " style={{ position: 'relative', transition: ' margin-left .5s' }}>
                <div className=" py-4 " style={{ position: 'relative', transition: ' margin-left .5s', backgroundColor: '#880808' }}>
                    <div className="container text-white">

                    </div>
                </div>
                <div className=" p-5 container" style={{minHeight:"80vh"}}>
                    <div>
                        <Link className="btn  mybtn " to="/admin/add-donationtype">Add Donation Type</Link>
                    </div>
                    <table class="table table-responsive">
                        <thead>
                            <tr>
                                <th scope="col">Sr. No.</th>
                                <th scope="col">Name</th>
                <th scope="col">Display Index</th>
                                {/* <th scope="col">City Name</th>
                                    <th scope="col">Place Name</th> */}

                                <th scope="col" colspan="3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                getdata && getdata.map((c, no) => (
                                    <>
                                        <tr>
                                            <th scope="row">{no + 1}</th> 

                                            <td>{c.name}</td>
                                            <td>{c.displayIndex}</td>


                                            <td>
                                                <Link className="btn  mybtn mx-2" to={`/admin/edit-donationtype/${c.id}`} > <FiEdit2 /> </Link>

                                                {
                                                    deleteloading ? <button className="btn  mybtn" >loading</button> : <button className="btn  mybtn" onClick={async(e) => {
                                                      await  doDelete(`/api/donationtype/${c.id}`)
                                                       await doFetch(`/api/donationtype`)
                                                    }}><AiTwotoneDelete /></button>
                                                }
                                            </td>
                                        </tr>
                                    </>

                                ))
                            }
                        </tbody>
                    </table>
                </div>
                <Footer/>
            </section>



        </>
    )
}

export default DonationType