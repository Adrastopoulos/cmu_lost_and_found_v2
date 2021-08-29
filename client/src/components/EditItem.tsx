import axios from "axios";
import React, { useState } from "react";
import { Button, Grid, Modal, Form, Icon, TextArea } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { Item } from "../interface/item";
import "./EditItem.css";
import { BuildingType } from "../enums/locationTypes";
import DeleteButton from "./DeleteButton";
import { User } from "../interface/user";

function exampleReducer(dispatchState: any, action: any) {
  switch (action.type) {
    case "CONFIG_CLOSE_ON_DIMMER_CLICK":
      return { ...dispatchState, closeOnDimmerClick: action.value };
    case "CONFIG_CLOSE_ON_ESCAPE":
      return { ...dispatchState, closeOnEscape: action.value };
    case "OPEN_MODAL":
      return { ...dispatchState, open: true };
    case "CLOSE_MODAL":
      return { ...dispatchState, open: false };
    default:
      throw new Error();
  }
}

const categories = [
  { key: "clothing", text: "Clothing", value: "Clothing" },
  { key: "headphones", text: "Headphones", value: "Headphones" },
  { key: "jewelry", text: "Jewelry", value: "Jewelry" },
  { key: "keys", text: "Keys", value: "Keys" },
  { key: "laptops", text: "Laptops", value: "Laptops" },
  { key: "phones", text: "Phones", value: "Phones" },
  { key: "students ids", text: "Student IDs", value: "Student IDs" },
  { key: "tablets", text: "Tablets", value: "Tablets" },
  { key: "umbrellas", text: "Umbrellas", value: "Umbrellas" },
  { key: "water bottles", text: "Water Bottles", value: "Water Bottles" },
  {
    key: "other electronics",
    text: "Other Electronics",
    value: "Other Electronics",
  },
  { key: "miscellaneous", text: "Miscellaneous", value: "Miscellaneous" },
];

const pickup = [
  {
    key: "cohon",
    text: "Cohon University Center",
    value: "Cohon University Center",
  },
  {
    key: "gates",
    text: "GHC 6203, 412.268.8525, lostfound@cs.cmu.edu.",
    value: "GHC 6203, 412.268.8525, lostfound@cs.cmu.edu.",
  },
  { key: "tepper", text: "Tepper Building", value: "Tepper Building" },
];

const buildings = Object.keys(BuildingType)
  .filter((value) => value !== "ALL")
  .map((key) => ({
    key,
    text: key,
    value: key,
  }));

function EditItem(props: {
  fetchItems: Function;
  user: User;
  item: Item;
  id: string;
  disabled: boolean;
}) {
  const [dispatchState, dispatch] = React.useReducer(exampleReducer, {
    closeOnEscape: false,
    closeOnDimmerClick: false,
    open: false,
    dimmer: undefined,
  });
  const { open, closeOnEscape, closeOnDimmerClick } = dispatchState;
  const history = useHistory();

  const [state, setState] = useState({
    dateFound: new Date(props.item.dateFound).toISOString().substring(0, 10),
    timeFound: props.item.timeFound,
    name: props.item.name,
    whereFound: props.item.whereFound,
    description: props.item.description,
    whereToRetrieve: props.item.whereToRetrieve,
    building: props.item.building,
    image: props.item.image,
    imagePath: "",
    imageObject: null as any,
    imagePermission: props.item.imagePermission,
    status: props.item.status,
    approved: props.item.approved,
    notes: props.item.notes,
  });

  const handleChange = (e: any, { name, value }: any) => {
    console.log(value);
    console.log(typeof value);
    console.log(name);
    setState({ ...state, [name]: value });
  };
  const handleRadioChange = (e: any, value: any) => {
    setState({ ...state, imagePermission: value === "true" });
  };
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    { name, value }: any
  ) => {
    console.log("handling file change");
    console.log(name + " " + value);
    setState({ ...state, [name]: value, imageObject: e!.target!.files![0] });
  };

  const uploadImage = (imageFile: File) => {
    console.log("attempting to edit image");
    const imageName = "test";
    console.log(imageFile);
    console.log(typeof imageFile);

    // no image, TODO: check
    if (!imageFile) {
      return new Promise((resolve, reject) => {
        resolve("");
        return;
      });
    }

    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        let data = {
          token: localStorage.getItem("lnf_token"),
          imageName: imageName,
          dataURL: reader.result,
        };
        console.log("Trying to edit image");

        axios.post(`/api/items/addImage`, data).then(
          (res) => {
            console.log("Image uploaded successfully");
            console.log(res);
            let finalURL = res.data.msg.fileId;
            console.log(
              "https://drive.google.com/uc?export=view&id=" + finalURL
            );
            resolve("https://drive.google.com/uc?export=view&id=" + finalURL);
            return;
          },
          (error) => {
            console.error(error);
            reject(error);
            if (error?.response?.status === 401) {
              window.localStorage.removeItem("lnf_token");
              history.push("/");
            } else if (error?.response?.status === 403) {
              history.push("/");
            }
            return;
          }
        );
      };
      reader.readAsDataURL(imageFile);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const {
      dateFound,
      timeFound,
      name,
      whereFound,
      building,
      description,
      whereToRetrieve,
      image,
      imageObject,
      imagePermission,
      status,
      approved,
      notes,
    } = state;

    uploadImage(imageObject).then(
      (res) => {
        axios
          .post(`/api/items/editItem`, {
            id: props.id,
            token: localStorage.getItem("lnf_token"),
            dateFound: dateFound,
            timeFound: timeFound,
            name: name,
            whereFound: whereFound,
            building: building,
            description: description,
            whereToRetrieve: whereToRetrieve,
            image: res === "" ? image : res, // use existing image if no new image was added
            imagePermission: imagePermission,
            status: status,
            approved: approved,
            notes: notes,
          })
          .then(
            (res) => {
              console.log("Edited");
              console.log(res);
              props.fetchItems();
            },
            (error) => {
              console.log(error);
              alert("Unable to edit item");
              if (error?.response?.status === 401) {
                window.localStorage.removeItem("lnf_token");
                history.push("/login");
              } else if (error?.response?.status === 403) {
                history.push("/");
              }
            }
          );
        dispatch({ type: "CLOSE_MODAL" });
        setState({
          dateFound: state.dateFound,
          timeFound: state.timeFound,
          name: state.name,
          whereFound: state.whereFound,
          description: state.description,
          whereToRetrieve: state.whereToRetrieve,
          building: state.building,
          image: state.image,
          imageObject: state.imageObject,
          imagePath: state.imagePath,
          imagePermission: state.imagePermission,
          status: "available",
          approved: false,
          notes: state.notes,
        });
        return res;
      },
      (err) => {
        console.error(err);
        alert("Unable to edit item");
      }
    );
  };

  let currentDate = new Date();
  const offset = currentDate.getTimezoneOffset();
  currentDate = new Date(currentDate.getTime() - offset * 60 * 1000);
  let todayDate = currentDate.toISOString().slice(0, 10);

  return (
    <Grid columns={1}>
      <Grid.Column>
        <Modal
          closeOnEscape={closeOnEscape}
          closeOnDimmerClick={closeOnDimmerClick}
          open={open}
          onOpen={() => dispatch({ type: "OPEN_MODAL" })}
          onClose={() => dispatch({ type: "CLOSE_MODAL" })}
          trigger={
            <Button
              disabled={props.disabled}
              icon
              circular
              color="blue"
              size="tiny"
            >
              <Icon name="edit outline" inverted size="large"></Icon>
            </Button>
          }
        >
          <Modal.Header>Edit Item</Modal.Header>
          <Modal.Content>
            {/* Need to stop modal from closing when enter key is pressed */}
            <Form onSubmit={handleSubmit}>
              <Form.Input
                required
                fluid
                label="Item Name"
                placeholder="Item Name"
                name="name"
                value={state.name}
                onChange={handleChange}
              />
              <Form.Group widths="equal">
                <Form.Input
                  required
                  fluid
                  label="Date Found"
                  name="dateFound"
                  type="date"
                  placeholder="MM/DD/YYY"
                  max={todayDate}
                  value={state.dateFound}
                  onChange={handleChange}
                />
                <Form.Input
                  required
                  fluid
                  label="Time Found"
                  name="timeFound"
                  type="time"
                  placeholder="HH:MM"
                  value={state.timeFound}
                  onChange={handleChange}
                />
                <Form.Input
                  required
                  fluid
                  label="Location Found"
                  name="whereFound"
                  placeholder="Location"
                  value={state.whereFound}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Input
                required
                label="Item Description"
                placeholder="Item Description"
                name="description"
                value={state.description}
                onChange={handleChange}
              />
              <Form.Group widths="equal">
                {/* <Form.Select
                  fluid
                  required
                  label="Item Category"
                  options={categories}
                  placeholder="Item Category"
                  name="category"
                  value={state.category}
                  onChange={handleChange}
                /> */}
                <Form.Select
                  fluid
                  required
                  label="Pick-Up Location"
                  options={pickup}
                  placeholder="Pick-Up Location"
                  name="whereToRetrieve"
                  value={state.whereToRetrieve}
                  onChange={handleChange}
                />
                <Form.Select
                  fluid
                  required
                  label="Building (Lost and Found Desk)"
                  options={buildings}
                  placeholder="Building (Lost and Found Desk)"
                  name="building"
                  value={state.building}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Input
                label="Image Upload"
                name="imagePath"
                type="file"
                value={state.imagePath}
                onChange={handleFileChange}
              />
              <TextArea
                placeholder="Notes"
                name="notes"
                value={state.notes}
                onChange={handleChange}
              />
              <Form.Group></Form.Group>

              <Form.Group inline id="modal-actions">
                <DeleteButton
                  id={props.id}
                  fetchItems={props.fetchItems}
                  disabled={
                    props.item.approved &&
                    !props.user.permissions.some((value) =>
                      value.includes("ADMIN")
                    )
                  }
                ></DeleteButton>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    textAlign: "right",
                    width: "100%",
                  }}
                >
                  <Button
                    type="button" // needs to be set because type="submit" is the default
                    onClick={() => dispatch({ type: "CLOSE_MODAL" })}
                    negative
                  >
                    Cancel
                  </Button>
                  {/* Need to close modal after validation of the form */}
                  <Button positive type="submit">
                    Edit
                  </Button>
                </div>
              </Form.Group>
            </Form>
          </Modal.Content>
        </Modal>
      </Grid.Column>
    </Grid>
  );
}

export default EditItem;
