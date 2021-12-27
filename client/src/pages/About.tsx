import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Button, Icon, Rail, Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "./About.css";
import "semantic-ui-css/semantic.min.css";
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import { User } from "../interface/user";
function About() {
    document.title = "CMU Lost and Found";
    const [user, setUser] = useState<User | null>(null);
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
    const history = useHistory();
    useEffect(() => {
    if (localStorage.getItem("lnf_token") == null) {
        console.log("not logged in");
        history.push("/login");
        return;
    }
    getCurrentUser();
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
                  <Dropdown.Item onClick={() => history.push("/")}><Link to="/">Home</Link></Dropdown.Item>
                  {user.permissions?.length > 0 ? (
                    <Dropdown.Item onClick={() => history.push("/admin")}><Link to="/admin">Admin Panel</Link></Dropdown.Item>
                  ) : null}
                  <Dropdown.Item onClick={() => history.push("/policies")}><Link to="/policies">Policies</Link></Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <h1 className="title">Carnegie Mellon University</h1>
            <h2 className="subtitle">Lost and Found - About</h2>
            <div id="policy">
              <div id="description">
                <h2>About this Website</h2>
                <p>
                    This website displays information about 
                    lost items registered with all the lost and found centers on 
                    campus. Users can browse through items and get information about 
                    where and when it was found, and where they can retrieve it.
                </p>
                <h2>Mission Statement</h2>
                <p>
                    There are many lost and found centers scattered throughout campus. 
                    As there is little communication between these centers, students 
                    often have to visit multiple locations to find their lost item. 
                    This website seeks to fix this problem by providing a digital interface 
                    that compiles all the lost items on campus in one location.
                </p>
                <h2>Contributors</h2>
                <ul id="contributors">
                  <li>Richard Guo (Project Lead)</li>
                  <li>Elizabeth Louie (Project Lead)</li>
                  <li>Jackie Yang (Project Lead)</li>
                  <li>Michael Crotty</li>
                  <li>Daniel Gunawan</li>
                  <li>Brian Lee</li>
                  <li>Victoria Lee</li>
                  <li>Cathy Li</li>
                  <li>Michelle Li</li>
                  <li>Yerim Song</li>
                  <li>Clara Wang</li>
                  <li>Rachel Wei</li>
                </ul>
              </div>
            </div>
          </main>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
export default About;
