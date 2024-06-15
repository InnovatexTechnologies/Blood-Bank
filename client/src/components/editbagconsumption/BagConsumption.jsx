import React, { useEffect } from "react";

const BagConsumption = ({
  stockitemdata,
  bagtypeconsumption,
  stockitem,
  setstockitem,
}) => {
  useEffect(() => {
    const newarr = stockitemdata.map((p) => {
      const item2 = bagtypeconsumption.find(
        (bagconsumption) => bagconsumption.stockItemId === p.id
      );
      if (item2) {
        return { ...p, ...item2 };
      } else {
        return { ...p, stockItemId: p.id, qty: 0 };
      }
    });
    setstockitem(newarr);
  }, []);

  // const handleRemove = (id) => {
  //   setstockitem((prev) =>
  //     prev.map((p) => (p.stockItemId === id ? { ...p, qty: 0 } : p))
  //   );
  // };

  const onChange = (e) => {
    const { name, value } = e.target;
  

    setstockitem((prev) =>
      prev.map((p) =>
        p.stockItemId === Number(name) ? { ...p, qty: Number(value) } : p
      )
    );
    
  };

  return (
    <>
      <div className="mt-5">
        <div className="d-flex justify-content-between w-100 border p-3 ">
          <h6> Item Name</h6>
          <div></div>
          <h6>Quantity</h6>
          {/* <button className="btn btn-secondary">Action</button> */}
        </div>
        {stockitem &&
          stockitem.map((p) => (
            <>
              <div className="d-flex justify-content-between align-items-center w-100 border p-3 " key={p.id}>
                <h6>{p.name}</h6>

                <input
                  type="text"
                  name={p.stockItemId}
                  key={p.id}
                  defaultValue={p.qty}
                  onChange={(e) => onChange(e)}
                />
                {/* <button className="btn btn-danger" type="button"  onClick={()=>handleRemove(p.stockItemId)}>Delete</button> */}
              </div>
            </>
          ))}
      </div>
    </>
  );
};

export default BagConsumption;
