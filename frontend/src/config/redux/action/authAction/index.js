// import { clientServer } from "@/config";
// import { createAsyncThunk } from "@reduxjs/toolkit";

// export const loginUser = createAsyncThunk(
//   "user/login",
//   async (user, thunkAPI) => {
//     try {
//       const response = await clientServer.post(`/login`, {
//         email: user.email,
//         password: user.password,
//       });
//       if (response.data.token) {
//         localStorage.setItem("token", response.data.token);
//       } else {
//         return thunkAPI.rejectWithValue({ message: "Token not provided" });
//       }
//       return thunkAPI.fulfillWithValue(response.data.token);
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response.data);
//     }
//   }
// );

// export const registerUser = createAsyncThunk(
//   "user/register",
//   async (user, thunkAPI) => {
//     try {
//       const request = await clientServer.post(`/register`, {
//         username: user.username,
//         password: user.password,
//         email: user.email,
//         name: user.name,
//       });
//       return thunkAPI.fulfillWithValue(request.data.message);
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response.data);
//     }
//   }
// );

// export const getAboutUser = createAsyncThunk(
//   "user/getAboutUser",
//   async (user, thunkAPI) => {
//     try {
//       const response = await clientServer.post("/get_user_and_profile", {
//         token: user.token,
//       });

//       return thunkAPI.fulfillWithValue(response.data);
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response.data);
//     }
//   }
// );

// export const getAllUsers = createAsyncThunk(
//   "user/getAllUsers",
//   async (_, thunkAPI) => {
//     try {
//       const response = await clientServer.get("/get_all_users");
//       return thunkAPI.fulfillWithValue(response.data);
//     } catch (err) {
//       return thunkAPI.rejectWithValue(err.response.data);
//     }
//   }
// );

// export const sendConnectionRequest = createAsyncThunk(
//   "user/sendConnectionRequest",
//   async (user, thunkAPI) => {
//     try {
//       const response = await clientServer.post("/user/send_connection_request", {
//         token: user.token,
//         connectionId: user.user_id,
//       });
//       thunkAPI.dispatch(getConnectionsRequest({ token: user.token }));
//       return thunkAPI.fulfillWithValue(response.data);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data.message);
//     }
//   }
// );

// export const getConnectionsRequest = createAsyncThunk(
//   "user/getConnectionRequests",
//   async (user, thunkAPI) => {
//     try {
//       const response = await clientServer.get("/user/getConnection_Requests", {
//         params: { token: user.token },
//       });
//       return thunkAPI.fulfillWithValue(response.data.connections);
//     } catch (error) {
//       console.log(error);
//       return thunkAPI.rejectWithValue(error.response.data.message);
//     }
//   }
// );



// // export const getMyConnectionRequests = createAsyncThunk(
// //   "user/getMyConnectionRequests",
// //   async (user, thunkAPI) => {
// //     try {
// //       const response = await clientServer.get("/user/user_connection_request", {
// //         params: { token: user.token },
// //       });
// //       return thunkAPI.fulfillWithValue(response.data);
// //     } catch (error) {
// //       return thunkAPI.rejectWithValue(error.response.data.message);
// //     }
// //   }
// // );




// export const getMyConnectionRequests = createAsyncThunk(
//   "user/getMyConnectionRequests",
//   async (user, thunkAPI) => {
//     try {
//       const response = await clientServer.get(
//         "/user/user_connection_request",
//         {
//           params: { token: user.token },
//         }
//       );

//       const connections = response.data?.connections;

//       return Array.isArray(connections) ? connections : [];
//     } catch (err) {
//       return thunkAPI.rejectWithValue(
//         err.response?.data?.message ||
//         err.response?.data ||
//         err.message ||
//         "Request failed"
//       );
//     }
//   }
// );






// export const AcceptConnection = createAsyncThunk(
//   "user/acceptConnection",
//   async (user, thunkAPI) => {
//     try {
//       const response = await clientServer.post("/user/accept_connection_request", {
//         token: user.token,
//         requestId: user.connectionId,
//         action_type: user.action,
//       });
//       thunkAPI.dispatch(getConnectionsRequest({ token: user.token }));
//       thunkAPI.dispatch(getMyConnectionRequests({ token: user.token }));
//       return thunkAPI.fulfillWithValue(response.data);
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data.message);
//     }
//   }
// ); 




































import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Login
export const loginUser = createAsyncThunk(
  "user/login",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/login", {
        email: user.email,
        password: user.password,
      });

      const token = response.data?.token;

      if (!token) {
        return thunkAPI.rejectWithValue({
          message: "Token not provided by the server",
        });
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      return token;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message || "Login failed",
        }
      );
    }
  }
);

// Register
export const registerUser = createAsyncThunk(
  "user/register",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/register", {
        username: user.username,
        password: user.password,
        email: user.email,
        name: user.name,
      });

      return response.data?.message || "Registration successful";
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message || "Registration failed",
        }
      );
    }
  }
);

// Get the logged-in user's profile
export const getAboutUser = createAsyncThunk(
  "user/getAboutUser",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post("/get_user_and_profile", {
        token: user.token,
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message || "Failed to load user profile",
        }
      );
    }
  }
);

// Get all users
export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, thunkAPI) => {
    try {
      const response = await clientServer.get("/get_all_users");

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || {
          message: error.message || "Failed to load users",
        }
      );
    }
  }
);

// Send a connection request
export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/send_connection_request",
        {
          token: user.token,
          connectionId: user.user_id ?? user.connectionId,
        }
      );

      // Refresh outgoing requests after sending.
      thunkAPI.dispatch(getConnectionsRequest({ token: user.token }));

      // Refresh incoming requests too.
      thunkAPI.dispatch(getMyConnectionRequests({ token: user.token }));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Failed to send connection request"
      );
    }
  }
);

// Get outgoing connection requests
export const getConnectionsRequest = createAsyncThunk(
  "user/getConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get(
        "/user/getConnection_requests",
        {
          params: { token: user.token },
        }
      );

      const connections = response.data?.connections;

      return Array.isArray(connections) ? connections : [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Failed to load outgoing connection requests"
      );
    }
  }
);

// Get incoming connection requests
export const getMyConnectionRequests = createAsyncThunk(
  "user/getMyConnectionRequests",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.get(
        "/user/user_connection_request",
        {
          params: { token: user.token },
        }
      );

      const connections = response.data?.connections;

      return Array.isArray(connections) ? connections : [];
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Failed to load incoming connection requests"
      );
    }
  }
);

// Accept or reject a connection request
export const AcceptConnection = createAsyncThunk(
  "user/acceptConnection",
  async (user, thunkAPI) => {
    try {
      const response = await clientServer.post(
        "/user/accept_connection_request",
        {
          token: user.token,
          requestId: user.connectionId,
          action_type: user.action,
        }
      );

      // Refresh both lists after the request is processed.
      thunkAPI.dispatch(getConnectionsRequest({ token: user.token }));
      thunkAPI.dispatch(getMyConnectionRequests({ token: user.token }));

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Failed to update connection request"
      );
    }
  }
);
