import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton
}from "@material-ui/core/";
import {Lock, LockOpen} from '@material-ui/icons';
import { makeDate } from "../../Service/functions";

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

function Users(props) {

  const { users, handleUserBann, userActivity, userStatus, classes } = props;

  const buttons = (userId) => {
    return {
      "false":  
        <IconButton
          className={classes.button}
          color="secondary"
          onClick={() => handleUserBann(userId)}
        >
          <Lock />
        </IconButton>,
      "true": 
        <IconButton
          className={classes.button}
          color="primary"
          onClick={() => handleUserBann(userId)}
        >
          <LockOpen />
        </IconButton>
    };
  } 
  
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography gutterBottom variant="subtitle2" >
                  Name
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography gutterBottom variant="subtitle2" >
                  email
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography gutterBottom variant="subtitle2" >
                  Phone number
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography gutterBottom variant="subtitle2" >
                  Birth date
              </Typography>
            </TableCell>
            {userStatus === "owners" ? 
              <TableCell align="right">
                <Typography gutterBottom variant="subtitle2" >
                    Restaurants
                </Typography>
              </TableCell>
              : null
            }
            <TableCell align="right">
              <Typography gutterBottom variant="subtitle2" >
                  Activity
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography gutterBottom variant="subtitle2" >
                  Actions
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((userInfo, id) => {
            if (userActivity.indexOf(userInfo.is_active) !== -1) {
              return (
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    {userInfo.name}
                  </TableCell>
                  <TableCell align="right">{userInfo.email}</TableCell>
                  <TableCell align="right">{userInfo.phone_number}</TableCell>
                  <TableCell align="right">{makeDate(userInfo.birth_date, "simple european date")}</TableCell>
                  {userStatus === "owners" ?  <TableCell align="right">
                                                {userInfo.restaurants.map((restaurantName, id) => {
                                                  return(<Typography component="p" key={id}>
                                                    {restaurantName}
                                                  </Typography>);})}
                                              </TableCell>: null}
                  <TableCell align="right">
                    <Typography component="p" color={userInfo.is_active ? "primary" : "error"}>
                        {userInfo.is_active ? "Active" : "Banned"}
                    </Typography>  
                  </TableCell>
                  <TableCell align="right">
                    {buttons(userInfo.id)[userInfo.is_active.toString()]}
                  </TableCell>
                </TableRow>
              );
            } 
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default withStyles(styles)(Users);
