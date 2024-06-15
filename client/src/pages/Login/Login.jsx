import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import bloodIcon from "../../assets/loginPageImg/blood-donation.png";
import { axiosInstance } from "../../config";

const Login = () => {
  const navigate = useNavigate();

  const [Email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const loginHandler = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/login", {
        headers: {
          UserName: Email,
          Password: password,
        },
      });

      localStorage.setItem("token", data.authorization);

      if (data && data.authorization) {
        // alert("Login Successfully")
        window.location.href = "/admin/bloodgroup";

        //This is bug

        // navigate("/admin/bloodgroup")
      } else {
        alert("Authentication Failed");
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  return (
    <div
      className="login-container"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="row   "
        style={{
          borderRadius: "10px",
          // border: "2px solid gray",
          background: "rgb(133 132 132 / 56%)",
          width: "600px",
          padding: "1rem",
          height: "400px",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "end",
            gap: "10px",
          }}
        >
          <img
            src={bloodIcon}
            alt=""
            style={{
              width: "70px",
              height: "70px",
            }}
          />
          <h6
            style={{
              textAlign: "center",
              color: "#fff",
              padding: "4px 10px",
              backgroundColor: "#BB2D3B",
              borderRadius: "8px",
              // fontSize: "50px",
              // fontWeight: 700,
              // fontWeight: "bold",
            }}
          >
            <div className="py-1">Swami Kalyan Dev District Hospital Muzaffarnagar</div>
            <div className="text-start py-1">License Number :- 37/SC/P/1997</div>
          </h6>
        </div>

        {/* <hr/> */}

        <input
          class="form-control"
          type="email"
          placeholder=" admin123@gmail.com"
          onChange={(e) => setEmail(e.target.value)}
          value={Email}
        />

        <input
          type="password"
          class="form-control"
          placeholder="  **********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {loading ? (
          <button type="button" class="btn btn-danger">
            Loading...
          </button>
        ) : (
          <button type="button" class="btn btn-danger" onClick={loginHandler}>
            Login
          </button>
        )}

        <div class="d-flex justify-content-between align-items-center">
          {/* <div class="form-check mb-0"> */}
          <Link to="/available-stock">Available Stock</Link>

          {/* <input
              class="form-check-input me-2"
              type="checkbox"
              id="form2Example3"
              value=""
            />
            <label class="form-check-label" for="form2Example3">
              Remember me
            </label> */}
          {/* </div> */}
          <Link class="L-Affiliate-Tagged" to="/reset-password">
            Forgot password?
          </Link>
         
        </div>
        <div className=" text-dark bg-white text-center py-1" style={{borderRadius:"6px"}}>
          <h6>
          EasyBlood: Engineered by Faspi Enterprises Pvt Ltd, Marketed by Rajvanshi Trading Company
          </h6>
        </div>
        <div className=" text-dark bg-white text-center py-1" style={{borderRadius:"6px"}}>
          <h6>
          For Sales/Support contact us : +91 73513 60366
          </h6>
        </div>
      </div>
    </div>
  );
};

export default Login;
