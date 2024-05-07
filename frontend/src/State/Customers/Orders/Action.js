import { api } from "../../../config/api";
import { createOrderFailure, createOrderRequest, createOrderSuccess, getUsersOrdersFailure, getUsersOrdersRequest, getUsersOrdersSuccess } from "./ActionCreators";
import { GET_USERS_NOTIFICATION_FAILURE, GET_USERS_NOTIFICATION_SUCCESS } from "./ActionTypes";

export const createOrder = (reqData) => {
  
  // const makePayment=async(order)=>{
  //   console.log("Cart Items :",order.cartItems);
  //   const stripe=await loadStripe("pk_test_51PCTB6SAriojk2DVspGSvr1YLJIsGxVJMLMsCwkCofkMclPPt31KByplBJtsCjTLuku1RtQQknhURe9JtsTRbI6h00aD9oPFdV");
  //   const body={
  //     products:order
  //   }
  //   console.log("Body :",body);
  //   const headers={
  //     "Content-Type": "application/json"
  //   }

  //   const response =await fetch(`http://localhost:5454/create-checkout-session`,{
  //     method:'POST',
  //     headers:headers,
  //     body:JSON.stringify(body)
  //   })

  //   const session=await response.json();

  //   const result=stripe.redirectToCheckout({
  //     sessionId:session.id
  //   })
  //   if(result.error){
  //     console.log(result.error);
  //   }
  //   return result;
  // }
  return async (dispatch) => {
    dispatch(createOrderRequest());

    try {
      console.log("req data :",reqData);
      // Make the API call to create the order
      const response = await api.post('/api/order', reqData.order, {
        headers: {
          Authorization: `Bearer ${reqData.jwt}`,
        },
      });

      // Check if the response contains a payment URL
      // if (response.data.payment_url) {
      //   // Redirect to the payment URL
      //   window.location.href = response.data.payment_url;
      // }

      // const session=await response.json();
      // const stripe=await loadStripe("pk_test_51PCTB6SAriojk2DVspGSvr1YLJIsGxVJMLMsCwkCofkMclPPt31KByplBJtsCjTLuku1RtQQknhURe9JtsTRbI6h00aD9oPFdV");
      // stripe.redirectToCheckout({sessionId:session.id});
      console.log(response.data.session);
      // console.log(response.data.url);
      if (response.data.session.success_url) {
        // Redirect to the payment URL
        window.location.href = response.data.session.success_url;
      }else{
        window.location.href=response.data.session.cancel_url;
      }
      // console.log("Result :",result);
      // console.log("Req Data :",reqData);
      // makePayment(reqData.order);
      // Dispatch success action with the order data
      dispatch(createOrderSuccess(response.data));
    } catch (error) {
      // Handle errors
      console.error("Error creating order:", error);
      dispatch(createOrderFailure(error));
    }
  };
};



export const getUsersOrders = (jwt) => {
  return async (dispatch) => {
    dispatch(getUsersOrdersRequest());
    try {
      const {data} = await api.get(`/api/order/user`,{
        headers: {
            Authorization: `Bearer ${jwt}`,
          },
      });
      console.log("users order ",data)
      dispatch(getUsersOrdersSuccess(data));
    } catch (error) {
      dispatch(getUsersOrdersFailure(error));
    }
  };
};


export const getUsersNotificationAction = () => {
  return async (dispatch) => {
    dispatch(createOrderRequest());
    try {
      const {data} = await api.get('/api/notifications');
     
      console.log("all notifications ",data)
      dispatch({type:GET_USERS_NOTIFICATION_SUCCESS,payload:data});
    } catch (error) {
      console.log("error ",error)
      dispatch({type:GET_USERS_NOTIFICATION_FAILURE,payload:error});
    }
  };
};
