import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import RestaurantListItem from "./RestaurantListItem";
import { Link } from "react-router-dom";

function TabContainer(props) {
  return <Typography component="div">{props.children}</Typography>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = {
  root: {
    flexGrow: 1
  },
  item: {
    marginTop: 16
  }
};

class TagsTab extends React.Component {
  state = {
    rests: []
  };

  componentDidMount() {
    fetch("http://localhost:6543/api/restaurant")
      .then(response => response.json())
      .then(data => {
        this.setState({ rests: data.data });
      })
      .catch(err => console.log(err));
  }

  handleGetTags = rests => {
    let tagNames = [];
    rests.map(rest =>
      rest.tags.map(tag => {
        if (!tagNames.includes(tag.name)) tagNames.push(tag.name);
        return "";
      })
    );
    return tagNames;
  };

  render() {
    const { classes } = this.props;
    let value = 0;
    const tagNames = this.handleGetTags(this.state.rests);
    let params = new URLSearchParams(this.props.url.location.search).get("tag");

    if (params !== null) {
      value = params;
    }

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={value} variant="scrollable" scrollButtons="on">
            <Tab label="View all" component={Link} to={{ search: "" }} />
            {tagNames.map(i => {
              return (
                <Tab
                  key={i}
                  component={Link}
                  to={{ search: `?tag=${i}` }}
                  label={i}
                  value={i}
                />
              );
            })}
          </Tabs>
        </AppBar>
        {value === 0 && params === null && (
          <TabContainer>
            {this.state.rests.map(rest => {
              return <Grid className={classes.item}>
                  <RestaurantListItem restData={rest} />
              </Grid>;
            })}
          </TabContainer>
        )}
        {tagNames.map(i => {
          if (value === i && params === i) {
            return (
              <TabContainer key={i}>
                {this.state.rests.map(rest => {
                  if (rest.tags.filter(p => p.name === value).length !== 0) {
                    return <Grid className={classes.item}>
                        <RestaurantListItem restData={rest} />
                    </Grid>;
                  }
                  return "";
                })}
              </TabContainer>
            );
          }
          return "";
        })}
      </div>
    );
  }
}

TagsTab.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TagsTab);
