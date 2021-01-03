import React from "react";
import { Grid } from "semantic-ui-react";
import "./Admin.css";
import VerticalMenu from "../components/VerticalMenu";
import FilterBar from "../components/FilterBar";
import AddModal from "../components/AddModal";
import "semantic-ui-css/semantic.min.css";

function Admin() {
  document.title = "CMU Lost and Found";
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={3} id="side">
          <VerticalMenu></VerticalMenu>
        </Grid.Column>
        <Grid.Column width={13}>
          <main>
            <h1 id="title">Admin Page</h1>
            <div id="admin-filter-bar">
              <FilterBar></FilterBar> 
              <AddModal></AddModal>
            </div>
          </main>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Admin;