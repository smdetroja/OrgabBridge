import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import { DashboardContext } from "./";
import { todayAllOrders } from "./Action";
import { getAllProduct } from "../products/FetchApi";

const apiURL = "http://localhost:8000";

const SellTable = () => {
  const history = useHistory();
  const { data, dispatch } = useContext(DashboardContext);
  const [productList, setProductList] = useState([]);
  const [orderList, setOrderList] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const loginDetail = JSON.parse(localStorage.getItem("jwt"));

  useEffect(() => {
    todayAllOrders(dispatch);
    fetchProductData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProductData = async () => {
    setIsLoading(true);
    let responseData = await getAllProduct();
    setTimeout(() => {
      if (responseData && responseData.Products) {
        const filteredProducts = responseData.Products.filter(
          (product) => product?.createdBy?.email == loginDetail.email
        );
        setProductList(filteredProducts);
        setIsLoading(false);
      }
    }, 1000);
  };

  const ordersList = () => {
    let newList = [];
    if (data.totalOrders.Orders !== undefined) {
      data.totalOrders.Orders.forEach(function (elem) {
        if (moment(elem.createdAt).format("LL") === moment().format("LL")) {
          newList = [...newList, elem];
        }
      });
    }
    return newList;
  };

  useEffect(() => {
    if (data?.totalOrders?.Orders?.length > 0) {
      const filteredOrderList = filterOrdersWithMatchingProducts(
        ordersList(),
        productList
      );
      setOrderList(filteredOrderList);
    }
  }, [data, productList]);

  function filterOrdersWithMatchingProducts(orderList, productList) {
    const productIds = productList.map((product) => product?._id);

    const filteredOrders = orderList.filter(
      (order) =>
        // Condition 1: Check if any product matches the IDs in productList
        order.allProduct.some((product) =>
          productIds?.includes(product?.id?._id)
        ) ||
        // Condition 2: Check if the order's user email matches loginDetail.email
        (loginDetail && order?.user?.email === loginDetail.email)
    );

    return filteredOrders;
  }

  return (
    <Fragment>
      <div className="col-span-1 overflow-auto bg-white shadow-lg p-4">
        <div className="text-2xl font-semibold mb-6 text-center">
          Today's Requests
          {data.totalOrders.Orders !== undefined && orderList.length
            ? orderList.length
            : 0}
        </div>
        <table className="table-auto border w-full my-2">
          <thead>
            <tr>
              <th className="px-4 py-2 border">PIN Code</th>
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Request Address</th>
              <th className="px-4 py-2 border">Requested at</th>
            </tr>
          </thead>
          <tbody>
            {data.totalOrders.Orders !== undefined && orderList.length ? (
              orderList.map((item, key) => {
                return <TodayOrderTable order={item} key={key} />;
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-xl text-center font-semibold py-8"
                >
                  No Requests found today
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-sm text-gray-600 mt-2">
          Total{" "}
          {data.totalOrders.Orders !== undefined && orderList ? orderList.length : 0}{" "}
          Requests found
        </div>
        <div className="flex justify-center">
          <span
            onClick={(e) => history.push("/admin/dashboard/orders")}
            style={{ background: "#303031" }}
            className="cursor-pointer px-4 py-2 text-white rounded-full"
          >
            View All
          </span>
        </div>
      </div>
    </Fragment>
  );
};

const TodayOrderTable = ({ order }) => {
  return (
    <Fragment>
      <tr>
        <td className="w-48 hover:bg-gray-200 p-2 flex flex-col space-y-1">
          {order.allProduct.map((item, index) => {
            return (
              <div key={index} className="flex space-x-2">
                <span>{item.id.pPrice}</span>
                {/* <span>{item.quantitiy}x</span> */}
              </div>
            );
          })}
        </td>
        <td className="p-2 text-left">
          {order.allProduct.map((item, index) => {
            return (
              <img
                key={index}
                className="w-12 h-12 object-cover"
                src={`${apiURL}/uploads/products/${item.id.pImages[0]}`}
                alt="Pic"
              />
            );
          })}
        </td>
        <td className="p-2 text-center">
          {order.status === "Not processed" && (
            <span className="block text-red-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}
          {order.status === "Under Scutiny" && (
            <span className="block text-yellow-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}
          {order.status === "Request Accepted" && (
            <span className="block text-blue-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}
          {order.status === "Expired" && (
            <span className="block text-green-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}
          {order.status === "Cancelled" && (
            <span className="block text-red-600 rounded-full text-center text-xs px-2 font-semibold">
              {order.status}
            </span>
          )}
        </td>
        <td className="p-2 text-center">{order.address}</td>
        <td className="p-2 text-center">
          {moment(order.createdAt).format("lll")}
        </td>
      </tr>
    </Fragment>
  );
};

const TodaySell = (props) => {
  return (
    <div className="m-4">
      <SellTable />
    </div>
  );
};

export default TodaySell;
