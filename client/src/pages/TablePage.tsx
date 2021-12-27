import axios from "axios";
import React, { useState, useEffect } from "react";
import { Dropdown, Grid, Message, Rail } from "semantic-ui-react";
import { Link, useHistory } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import { Item } from "../interface/item";
import CardWidget from "../components/CardWidget";
import "./TablePage.css";
import FoundItemModal, {
  foundItemMessage,
  feedbackForm,
} from "../components/FoundItemModal";
import LogoutButton from "../components/LogoutButton";
import { User } from "../interface/user";

function TablePage() {
  const history = useHistory();

  //what is from the search
  const [input, setInput] = useState("");
  //unfiltered list
  const [itemListDefault, setItemListDefault] = useState([]);
  //filtered list
  const [itemList, setItemList] = useState([]);

  const [user, setUser] = useState<User | null>(null);

  const fetchItems = () => {
    axios
      .post(`/api/items/all`, {
        token: localStorage.getItem("lnf_token"),
      })
      .then(
        (res) => {
          //added
          setItemListDefault(res.data);
          setItemList(res.data);
        },
        (error) => {
          console.log(error);
          if (error?.response?.status === 401) {
            window.localStorage.removeItem("lnf_token");
            history.push("/login");
          }
        }
      );
  };

  const getCurrentUser = () => {
    axios.post('/api/accounts/currentUser', {
      token: window.localStorage.getItem("lnf_token")
    }).then(
      (res) => {
        if (res.data) {
          setUser(res.data);
        } else {
          setUser({ username: "user", permissions: [] });
        }
      }
    )
  };

  //modify items
  const updateInput = async (input: string) => {
    let inputName = input.toLowerCase();
    const filtered = itemListDefault.filter((item: Item) => {
      return (
        item.name.toLowerCase().includes(inputName) ||
        item.description.toLowerCase().includes(inputName)
      );
    });
    setInput(input);
    setItemList(filtered);
  };

  useEffect(() => {
    getCurrentUser();
    fetchItems();
  }, []);

  return user && (
    <Grid>
      <Grid.Row>
        <Grid.Column width={16}>
          <main>
            <Link to="/">
              <img src="/dog-logo.png" id="logo-mobile" alt="CMU Lost and Found Logo"></img>
            </Link>
            <div id="settings">
              <Rail attached internal position="left" id="logo-desktop">
                <Link to="/">
                  <img src="/dog-logo.png" alt="CMU Lost and Found Logo"></img>
                </Link>
              </Rail>
              <LogoutButton />
              <Dropdown icon='bars' floating button className='icon teal'>
                <Dropdown.Menu>
                  {user.permissions?.length > 0 ? (
                    <Dropdown.Item onClick={() => history.push("/admin")}><Link to="/admin">Admin Panel</Link></Dropdown.Item>
                  ) : null}
                  <Dropdown.Item onClick={() => history.push("/about")}><Link to="/about">About</Link></Dropdown.Item>
                  <Dropdown.Item onClick={() => history.push("/policies")}><Link to="/policies">Policies</Link></Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <h1 className="title">Carnegie Mellon University</h1>
            <h2 className="subtitle">Lost and Found Website</h2>
            <div id="description">
              <p>
                To retrieve an object, go to the location listed next to the
                object on the table. You will be required to identify any lost
                possessions. All items must be picked up in person and a photo ID is required.
              </p>
            </div>
            <Message id="found-item-message" warning size="large">
              <Message.Header>Found an item?</Message.Header>
              {foundItemMessage}
            </Message>
            
            <Message id="feedback-form" warning size="large">
              <Message.Header>Have feedback?</Message.Header>
              {feedbackForm}
            </Message>
            <div id="admin-filter-bar">
              <SearchBar input={input} onChange={updateInput} />
              <FoundItemModal
                id="found-item-modal"
                style={{ padding: "11px 11px", width: "110px" }}
              ></FoundItemModal>
            </div>
            <div id="cards-widget">
              <CardWidget
                items={itemList}
                isAdmin={false}
                isArchived={false}
                fetchItems={fetchItems}
              ></CardWidget>
            </div>
          </main>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default TablePage;
