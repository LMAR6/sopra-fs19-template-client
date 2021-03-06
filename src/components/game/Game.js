import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import Player from "../../views/Player";
import { Spinner } from "../../views/design/Spinner";
import { Button } from "../../views/design/Button";
import { withRouter } from "react-router-dom";
import Link from "react-router-dom/es/Link";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null
    };
  }

logout = () => {

  fetch(`${getDomain()}/users/` + localStorage.getItem("userId"), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "token": localStorage.getItem("token")

    },
    body: JSON.stringify({
      id: localStorage.getItem("userId"),
      status: "OFFLINE"
    })
  })

      .then(data =>{
            localStorage.removeItem("token");
            alert("You are logged out.");
            this.props.history.push("/login");
          }
      )

      .catch(error => {
        console.log(error);
      });
};

  componentDidMount() {
    fetch(`${getDomain()}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        //needed for authorization
        "token": localStorage.getItem("token")
      }
    })
      .then(response => response.json())
      .then(async users => {
        // delays continuous execution of an async operation for 0.8 seconds.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise(resolve => setTimeout(resolve, 800));
        this.setState({ users });
      })
      .catch(err => {
        console.log(err);
        alert("Something went wrong fetching the users: " + err);
      });
  }

  render() {
    return (
      <Container>
        <h2>Happy Coding! </h2>
        <p>Get all users from secure end point:</p>
        {!this.state.users ? (
          <Spinner />
        ) : (
          <div>
            <Users>
              {this.state.users.map(user => {
                return (
                  <PlayerContainer key={user.id}>
                    <Player user={user} />
                  </PlayerContainer>
                );
              })}
            </Users>
            <Link to="/profile/Settings">
                <Button
                    width="50%"
                    component={ Link } to="../profile/Settings.js" variant="contained"
                >
                  Edit my Profile
                </Button>
            </Link>
            <p></p>
            <Button
              width="50%"
              onClick={() => {
                this.logout();
              }}
            >
              Logout
            </Button>
          </div>
        )}
      </Container>
    );
  }
}

export default withRouter(Game);
