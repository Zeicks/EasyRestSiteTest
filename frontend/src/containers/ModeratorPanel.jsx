import React from "react";
import PropTypes from "prop-types";
import { Route, Switch, Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
/*import Drawer from "@material-ui/core/Drawer";*/
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Typography
} from "@material-ui/core";
import { Restaurant, AccountCircle, Work, Report } from "@material-ui/icons";
import Messages from "./MessagesFeedbacksPage";
import GeneralError from "../components/ErrorPages/GeneralError";
import RestaurantsForApprovalPage from "./RestaurantsForApprovalPage";
import ModeratorUsersPage from "./ModeratorUsersPage";
import GenericTabs from "../Service/GenericTabs";
import SnackbarContent from "../components/SnackbarContent";

/*const drawerWidth = 240;*/

const styles = theme => ({
  root: {
    display: "flex",
    marginTop: "64px"
    /*zIndex: theme.zIndex.appBar - 1,*/
  },
  /*drawer: {
    zIndex: theme.zIndex.appBar - 2,
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },*/
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3
  }
});

function getSelectedItemName(pathname) {
  const findedIndex = pathname.lastIndexOf("moderator");

  if (findedIndex === -1) {
    return "Restaurants";
  }

  let firstCharIndex = 0;

  if (pathname.charAt(findedIndex + 9) === "/") {
    firstCharIndex = findedIndex + 10;
  } else {
    return "Restaurants";
  }

  const firstChar = pathname.charAt(firstCharIndex).toUpperCase();
  const restWord = pathname.substring(firstCharIndex + 1).toLowerCase();

  const fullWord = firstChar + restWord;
  return fullWord ? fullWord : "Restaurants";
}

class ModeratorPanel extends React.Component {
  state = {
    error: "",
    success: true,
    snackbarOpen: false,
    snackbarMsg: "",
    token: localStorage.getItem("token"),
    selectedItemName: getSelectedItemName(this.props.location.pathname),
    selectedStatus: {
      Restaurants: "All",
      Users: "All",
      Owners: "All",
      Messages: "All"
    },
    currentStatusAdditionalValues: {}
  };

  tags = {
    Restaurants: ["All", "Unapproved", "Approved", "Archived"],
    Users: ["All", "Active", "Banned"],
    Owners: ["All", "Active", "Banned"],
    Messages: ["All", "Feedbacks", "Reports"]
  };

  tagsValues = {
    Restaurants: {
      All: [0, 1, 2],
      Unapproved: [0],
      Approved: [1],
      Archived: [2]
    },
    Users: { All: [false, true], Active: [true], Banned: [false] },
    Owners: { All: [false, true], Active: [true], Banned: [false] }
  };

  routes = () => {
    return [
      {
        path: "/moderator/",
        render: props => {
          return (
            <RestaurantsForApprovalPage
              restaurantStatus={
                this.tagsValues.Restaurants[
                  this.state.selectedStatus.Restaurants
                ]
              }
              tagsValues={this.tagsValues.Restaurants}
              setAdditionalTabData={this.setAdditionalTabData}
            />
          );
        },
        exact: true
      },
      {
        path: "/moderator/restaurants",
        render: props => {
          return (
            <RestaurantsForApprovalPage
              restaurantStatus={
                this.tagsValues.Restaurants[
                  this.state.selectedStatus.Restaurants
                ]
              }
              tagsValues={this.tagsValues.Restaurants}
              setAdditionalTabData={this.setAdditionalTabData}
            />
          );
        },
        exact: true
      },
      {
        path: "/moderator/users",
        render: props => {
          return (
            <ModeratorUsersPage
              userActivity={
                this.tagsValues.Users[this.state.selectedStatus.Users]
              }
              userStatus={"users"}
              tagsValues={this.tagsValues.Users}
              setAdditionalTabData={this.setAdditionalTabData}
            />
          );
        },
        exact: true
      },
      {
        path: "/moderator/owners",
        render: props => {
          return (
            <ModeratorUsersPage
              userActivity={
                this.tagsValues.Owners[this.state.selectedStatus.Owners]
              }
              userStatus={"owners"}
              tagsValues={this.tagsValues.Owners}
              setAdditionalTabData={this.setAdditionalTabData}
            />
          );
        },
        exact: true
      },
      {
        path: "/moderator/messages",
        render: props => {
          return <Messages />;
        },
        exact: true
      },
      {
        path: "",
        render: props => {
          return <GeneralError error="404 Not Found" />;
        },
        exact: true
      }
    ];
  };

  icons = {
    Restaurants: <Restaurant />,
    Users: <AccountCircle />,
    Owners: <Work />,
    Messages: <Report />
  };

  classes = this.props.classes;

  componentDidMount() {
    this.setState({ isLoading: false });
  }

  handleTabChange = (event, value) => {
    this.setState(prevState => {
      const newSelectedStatus = prevState.selectedStatus;
      newSelectedStatus[prevState.selectedItemName] = this.tags[
        prevState.selectedItemName
      ][value];
      return { selectedStatus: newSelectedStatus };
    });
  };

  setAdditionalTabData = additionalTabData => {
    this.setState(prevState => {
      return { currentStatusAdditionalValues: additionalTabData };
    });
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ snackbarOpen: false });
  };

  render() {
    const {
      isLoading,
      selectedItemName,
      selectedStatus,
      currentStatusAdditionalValues,
      snackbarOpen,
      success,
      snackbarMsg
    } = this.state;
    const { classes } = this.props;

    if (isLoading) {
      return null;
    }

    return (
      <div className={classes.root}>
        {/*<Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >*/}
        <div className={classes.toolbar} />
        <List>
          {["Restaurants", "Users", "Owners"].map((text, index) => (
            <ListItem
              button
              selected={this.state.selectedItemName === text}
              key={text}
              onClick={() => {
                this.setState({ selectedItemName: text });
              }}
              component={Link}
              to={"/moderator/" + text.toLowerCase()}
            >
              <ListItemIcon>{this.icons[text]}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        {/*</Drawer>*/}
        <main className={classes.content}>
          <div>
            <GenericTabs
              tags={this.tags[selectedItemName]}
              tagsAdditionalInformation={currentStatusAdditionalValues}
              selectedValue={this.tags[selectedItemName].indexOf(
                selectedStatus[selectedItemName]
              )}
              handleTabChange={this.handleTabChange}
            />
          </div>
          <Switch>
            {this.routes().map(({ path, render, exact }, index) => (
              <Route exact={exact} key={index} path={path} render={render} />
            ))}
          </Switch>
        </main>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={snackbarOpen}
          autoHideDuration={success ? 4000 : null}
          onClose={this.handleSnackbarClose}
        >
          <SnackbarContent
            onClose={this.handleSnackbarClose}
            variant={success ? "success" : "error"}
            message={
              <Typography color="inherit" align="center">
                {snackbarMsg || success || "Something went wrong"}
              </Typography>
            }
          />
        </Snackbar>
      </div>
    );
  }
}

ModeratorPanel.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ModeratorPanel);
