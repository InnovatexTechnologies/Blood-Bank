export const getCurrentDateInput = () => {

    const dateObj = new Date();
  
    // get the month in this format of 04, the same for months
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const year = dateObj.getFullYear();
  
    const shortDate = `${year}-${month}-${day}`;
  
    return shortDate;
  };
  