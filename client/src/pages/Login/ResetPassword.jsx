import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState();
  const [IsEmailSend, setIsEmailSend] = useState(false);
  const [Email, setEmail] = useState();
  const [Password, setPassword] = useState();
  const [Otp, setOtp] = useState();
  const sendResetMail = () => {
    if (!Email) {
      return alert("Please enter your Email Id");
    }
    setIsLoading(true);

    try {
      // API CALL

      setIsLoading(false);
      setIsEmailSend(true);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const UpdatePassword = async () => {
    setIsLoading(true);
    try {
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <section className="vh-100 login-container overflow-hidden">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div
          className="col-md-8  col-xl-5 offset-xl-1"
          style={{
            background: "hsla(0,0%,42%,.251)",
            borderRadius: "8px",
            padding: "1rem",
          }}
        >
          {!IsEmailSend ? (
            <>
              <div className="reset-password-section text-center boxShadow">
                {/* <h3><i className="fa fa-lock fa-4x"></i></h3> */}
                <h2 className="text-center">Forgot Password?</h2>
                <p>You can reset your password here.</p>
                <div className="panel-body">
                  <form>
                    <div className="form-group">
                      <span className="input-group-addon">
                        <i className="glyphicon glyphicon-envelope color-blue"></i>
                      </span>
                      <input
                        id="email"
                        name="email"
                        placeholder="email address"
                        className="form-control"
                        value={Email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                      />
                    </div>

                    <div className="form-group mt-2">
                      {!isLoading ? (
                        <button
                          onClick={() => sendResetMail()}
                          type="button"
                          className="btn btn-danger w-100"
                        >
                          Reset Password
                        </button>
                      ) : (
                        <button type="button" className=" btn btn-danger w-100">
                          loading....
                        </button>
                      )}
                      <p className="small fw-bold mt-2 pt-1 mb-0">
                        Remember your password ?{" "}
                        <Link to="/login" className="link-danger">
                          Login
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="reset-password-section text-center boxShadow">
                {/* <h3><i className="fa fa-lock fa-4x"></i></h3> */}
                <h2 className="text-center">Update password?</h2>
                <p>You can reset your password here.</p>
                <div className="panel-body">
                  <form>
                    <div className="form-group">
                      <input
                        value={Otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        className="form-control"
                        type="text"
                      />
                    </div>
                    <div className="form-group mt-3 mb-3">
                      <input
                        value={Password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Password"
                        className="form-control"
                        type="text"
                      />
                    </div>

                    <div className="form-group mt-2">
                      {!isLoading ? (
                        <button
                          onClick={() => UpdatePassword()}
                          type="button"
                          className="btn btn-danger"
                        >
                          Update Password
                        </button>
                      ) : (
                        <button type="button" className="btn bgYellow w-100">
                          Loading...
                        </button>
                      )}
                      <p className="small fw-bold mt-2 pt-1 mb-0">
                        Remember your password ?{" "}
                        <Link to="/login" className="link-danger">
                          Login
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
