import React from "react";
import { Grid } from "semantic-ui-react";
import "./Admin.css";
import AdminMenu from "../components/AdminMenu";
import FilterBar from "../components/FilterBar";
import AddModal from "../components/AddModal";
import TableExample from "../components/Table";
import "semantic-ui-css/semantic.min.css";

function Admin() {
  document.title = "CMU Lost and Found";
  const items = [
    {
      id:1,
      dateFound: "11/12/20",
      timeFound: "11:12 am",
      name: "Phone",
      whereFound: "Tepper",
      description: "pink iPhone",
      category: "Phones",
      whereToRetrieve: "gates",
      image: "https://i.pcmag.com/imagery/reviews/03xdTO0Ka4H4KvEgtSPg4c2-12.1569479325.fit_lpad.size_357x209.jpg",
      imagePermission: false,
      status: "available",
    },
    {
      id:2,
      dateFound: "12/12/20",
      timeFound: "12:12 am",
      name: "Cat",
      whereFound: "Tepper",
      description: "pink iPhone",
      category: "Phones",
      whereToRetrieve: "gates",
      image: "https://i.pcmag.com/imagery/reviews/03xdTO0Ka4H4KvEgtSPg4c2-12.1569479325.fit_lpad.size_357x209.jpg",
      imagePermission: false,
      status: "available",
    },
  ];
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={3} id="side">
          <div id="sidemenu">
            <img id="logo" src="/dog-logo.png" alt="CMU Lost and Found Logo"></img>
            <br></br>
            <br></br>
            <AdminMenu></AdminMenu>
          </div>
        </Grid.Column>
        <Grid.Column width={13}>
          <main>
            <h1 id="title">Available Items</h1>
            <div id="admin-filter-bar">
              <FilterBar></FilterBar> 
              <AddModal></AddModal>
            </div>
            <div id="table">
              <TableExample items={items}></TableExample>
            </div>
          </main>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default Admin;