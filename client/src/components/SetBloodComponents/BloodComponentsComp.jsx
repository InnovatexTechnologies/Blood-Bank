import React, { useEffect } from "react";
import { axiosInstance } from "../../config";

const BloodComponentsComp = ({
  components,
  bloodcomponetdata,
  setbloodcomponetdata,
  onChange,
}) => {
  useEffect(() => {
    getbloodcomponents();
  }, []);

  const getbloodcomponents = async () => {
    try {
      const { data } = await axiosInstance.get("/api/bloodcomponent", {
        headers: {
          Auth: localStorage.getItem("token"),
        },
      });

      const newdata = data.map((p) => {
        if (components.includes(String(p.id))) {
          return {
            ...p,
            checked: true,
          };
        } else {
          return {
            ...p,
            checked: false,
          };
        }
      });

      setbloodcomponetdata(newdata);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      <div className="row">
        {bloodcomponetdata &&
          bloodcomponetdata.map((p) => (
            <>
              <Inputbox
                id={p.id}
                key={p.id}
                name={p.name}
                checked={p.checked}
                bloodcomponetdata={bloodcomponetdata}
                setbloodcomponetdata={setbloodcomponetdata}
                onChange={onChange}
              />
            </>
          ))}
      </div>
    </>
  );
};

const Inputbox = ({
  name,
  checked,
  key,
  id,
  bloodcomponetdata,
  setbloodcomponetdata,
  onChange,
}) => {
  
  return (
    <>
      <div className="col-md-3" key={key}>
        <div class="form-check">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => onChange(id)}
          /> &nbsp;

          <label class="form-check-label" for="flexCheckChecked">
            {name}
          </label>
        </div>
      </div>
    </>
  );
};

export default BloodComponentsComp;
