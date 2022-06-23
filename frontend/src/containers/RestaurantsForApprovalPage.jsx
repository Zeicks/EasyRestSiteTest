import React, { Component } from "react";
import { Snackbar, Typography, Button } from "@material-ui/core";
import GeneralError from "../components/ErrorPages/GeneralError";
import SnackbarContent from "../components/SnackbarContent";
import RestaurantsForApproval from "../components/RestaurantsForApproval/RestaurantsForApproval";
import { redirectToSignUp } from "../Service/NeedAuthorization";

class RestaurantsForApprovalPage extends Component {
  state = {
    needRedirection: false,
    success: null,
    error: "",
    token: localStorage.getItem("token"),
    unapprovedRestaurants: [],
    snackbarOpen: false,
    snackbarMsg: "",
    currentRestaurantId: null,
    previousRestaurantStatus: null
  };

  componentDidMount() {
    const headers = new Headers({
      "Content-Type": "application/json",
      "X-Auth-Token": this.state.token
    });

    const fetchInit = {
      method: "GET",
      headers: headers
    };

    fetch("http://localhost:6543/api/moderator/restaurants", fetchInit)
      .then(response =>
        response.status === 403
          ? this.setState({ needRedirection: true, success: false })
          : response.json()
      )
      .then(data =>
        this.setState({
          unapprovedRestaurants: data.data,
          success: data.success,
        })
      )
      .then(() => {
        this.pushTabValues(this.state.unapprovedRestaurants);
      })
      .catch(
        err => {
          this.pushTabValues(this.state.unapprovedRestaurants);
          this.setState({
            success: false,
            error: err.message,
            snackbarOpen: true,
            snackbarMsg: "fail to connect server",
          });
        }
      );
  }

  handleRestaurantApprovement = (
    restaurant_id,
    request_method,
    restaurant_status,
    prev_rest_status,
    snackbarOpen = true
  ) => {
    const headers = new Headers({
      "Content-Type": "application/json",
      "X-Auth-Token": this.state.token
    });
    const fetchInit = {
      method: request_method,
      headers: headers,
      body: JSON.stringify({ id: restaurant_id, status: restaurant_status })
    };

    let operationName = "";
    if (request_method === "POST") {
      operationName = "Approved";
    }
    if (request_method === "DELETE") {
      operationName = "Disapproved";
    }

    fetch("http://localhost:6543/api/moderator/restaurants", fetchInit)
      .then(response =>
        !(response.status >= 200 && response.status < 300)
          ? response.json().then(Promise.reject.bind(Promise))
          : response.json()
      )
      .then(data =>
        this.setState(prevState => {
          return {
            success: data.success,
            unapprovedRestaurants: prevState.unapprovedRestaurants.map(
              restaurantInfo => {
                if (restaurantInfo.id === restaurant_id) {
                  restaurantInfo.status = restaurant_status;
                  return restaurantInfo;
                } else {
                  return restaurantInfo;
                }
              }
            ),
            snackbarOpen: snackbarOpen,
            snackbarMsg: operationName,
            currentRestaurantId: restaurant_id,
            previousRestaurantStatus: prev_rest_status
          };
        })
      )
      .then(() => {
        this.pushTabValues(this.state.unapprovedRestaurants);
      })
      .catch(err => {
        this.pushTabValues(this.state.unapprovedRestaurants);
        this.setState({
          success: false,
          error: "" + err,
          snackbarOpen: true,
          snackbarMsg: "failed to make operation",
          currentRestaurantId: restaurant_id
        })
      });
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  snackbarAction = (
    <Button
      color="secondary"
      size="small"
      onClick={() => {
        this.handleRestaurantApprovement(
          this.state.currentRestaurantId,
          this.state.previousRestaurantStatus === 2 ? "DELETE" : "POST",
          this.state.previousRestaurantStatus,
          null,
          false
        );
      }}
    >
      Undo
    </Button>
  );

  //push information about quantity to the Tab component
  pushTabValues = data => {
    const tagsValues = this.props.tagsValues;
    const tagsNames = Object.keys(tagsValues);
    let additionalValues = {};
    for (let key in tagsNames) {
      let quantity = 0;
      const tagName = tagsNames[key];
      const tagValue = tagsValues[tagName];
      for (let i = 0; i < data.length; i++) {
        const info = data[i];
        if (tagValue.includes(info.status)) {
          quantity = quantity + 1;
        }
      }
      additionalValues[tagName] = quantity;
    }
    return this.props.setAdditionalTabData(additionalValues);
  };

  render() {
    const {
      needRedirection,
      unapprovedRestaurants,
      success,
      error,
      snackbarOpen,
      snackbarMsg
    } = this.state;
    const { restaurantStatus } = this.props;

    //prevent for rendering without fetch completing (init value is "null")
    if (success === null) {
      return null;
    }

    if (needRedirection === true) {
      const redirection = redirectToSignUp(error);
      return redirection;
    } else {
      return (
        <React.Fragment>
          <RestaurantsForApproval
            unapprovedRestaurants={unapprovedRestaurants}
            handleRestaurantApprovement={this.handleRestaurantApprovement}
            restaurantStatus={restaurantStatus}
          />
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right"
            }}
            open={snackbarOpen}
            autoHideDuration={success ? 3000 : 15000}
            onClose={this.handleSnackbarClose}
          >
            <SnackbarContent
              onClose={this.handleSnackbarClose}
              action={success ? this.snackbarAction : null}
              variant={success ? "success" : "error"}
              message={
                <Typography color="inherit" align="center">
                  {snackbarMsg || success || "Something went wrong"}
                </Typography>
              }
            />
          </Snackbar>
        </React.Fragment>
      );
    }
  }
}

export default RestaurantsForApprovalPage;
