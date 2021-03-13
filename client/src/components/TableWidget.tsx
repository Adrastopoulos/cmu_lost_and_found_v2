import React, { useState } from "react";
import { Form, Table } from "semantic-ui-react";
import { Item } from "../interface/item";
import "./TableWidget.css";
import ImageModal from "./ImageModal";
import ClaimButton from "./ClaimButton";
import UnclaimButton from "./UnclaimButton";
import DeleteButton from "./DeleteButton";

const TableWidget = (props: {
  items: Array<Item>;
  isAdmin: boolean;
  isArchived: boolean;
  fetchItems: Function;
}) => {
  const [displayArchived, setDisplayArchived] = useState(false);

  const updateDisplayArchived = (evt: any, data: any) => {
    setDisplayArchived(data.checked);
  };

  console.log("Creating table");
  return (
    <Form>
      {props.isAdmin ? (
        <Form.Checkbox
          label="Show Archived Items"
          onClick={updateDisplayArchived}
        />
      ) : null}
      <Table celled className="lf_table">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width={1}>Date Found</Table.HeaderCell>
            <Table.HeaderCell width={1}>Time Found</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Where Found</Table.HeaderCell>
            <Table.HeaderCell>Description</Table.HeaderCell>
            <Table.HeaderCell>Category</Table.HeaderCell>
            <Table.HeaderCell>Where to Retrieve</Table.HeaderCell>
            <Table.HeaderCell>Image</Table.HeaderCell>
            {props.isAdmin ? (
              <Table.HeaderCell>Claim/Unclaim</Table.HeaderCell>
            ) : null}
            {props.isAdmin ? <Table.HeaderCell>Delete</Table.HeaderCell> : null}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.items
            .filter((item) => {
              return (
                item.status === "available" ||
                (props.isAdmin && displayArchived)
              );
            })
            .map((item: Item) => {
              return (
                <Table.Row key={item._id}>
                  <Table.Cell collapsing>{item.dateFound}</Table.Cell>
                  <Table.Cell collapsing>{item.timeFound}</Table.Cell>
                  <Table.Cell collapsing>{item.name}</Table.Cell>
                  <Table.Cell collapsing>{item.whereFound}</Table.Cell>
                  <Table.Cell collapsing>{item.description}</Table.Cell>
                  <Table.Cell collapsing>{item.category}</Table.Cell>
                  <Table.Cell collapsing>{item.whereToRetrieve}</Table.Cell>
                  <Table.Cell collapsing>
                    <ImageModal image={item.image}></ImageModal>
                  </Table.Cell>
                  {props.isAdmin ? (
                    <Table.Cell>
                      <ClaimButton
                        id={item._id}
                        disabled={item.status !== "available"}
                        fetchItems={props.fetchItems}
                      ></ClaimButton>
                      <UnclaimButton
                        id={item._id}
                        disabled={item.status === "available"}
                        fetchItems={props.fetchItems}
                      ></UnclaimButton>
                    </Table.Cell>
                  ) : null}
                  {props.isAdmin ? (
                    <Table.Cell>
                      <DeleteButton
                        id={item._id}
                        fetchItems={props.fetchItems}
                      ></DeleteButton>
                    </Table.Cell>
                  ) : null}
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    </Form>
  );
};

export default TableWidget;
