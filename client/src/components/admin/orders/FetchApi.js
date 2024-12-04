import axios from "axios";
const apiURL = "http://localhost:8000";

export const getAllOrder = async () => {
  const loginDetail = JSON.parse(localStorage.getItem("jwt"));
  try {
    let res = await axios.get(`${apiURL}/api/order/get-all-orders`);
    // const filteredOrders = res.data.Orders.filter((order) => order?.user?.email == loginDetail.emai);
    // debugger
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const editCategory = async (oId, status) => {
  let data = { oId: oId, status: status };
  console.log(data);
  try {
    let res = await axios.post(`${apiURL}/api/order/update-order`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteOrder = async (oId) => {
  let data = { oId: oId };
  try {
    let res = await axios.post(`${apiURL}/api/order/delete-order`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
