import React from "react";
import Login from "../components/Login";
import AppContext from "../components/AppContext";
import PageContainer from "./PageContainer";

const LogInPage = props => {
  return (
    <PageContainer fullHeight width="small">
      <AppContext.Consumer>
        {state => {
          return (
            <Login
              location={props.location}
              history={props.history}
              state={state}
            />
          );
        }}
      </AppContext.Consumer>
    </PageContainer>
  );
};

export default LogInPage;
