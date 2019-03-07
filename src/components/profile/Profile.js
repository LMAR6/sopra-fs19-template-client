import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import Player from "../../views/Player";
import { Spinner } from "../../views/design/Spinner";
import { Button } from "../../views/design/Button";
import { withRouter } from "react-router-dom";
import Link from "react-router-dom/es/Link";
import PlayerProfile from "../../views/PlayerProfile";

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

/**
class profilhelper extends Profile {
    render() {
        const {match} = this.props
        const id = match.params.id
        console.log(this.id);
    }
}**/


class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            users: null
        };
    }

    logout() {
        localStorage.removeItem("token");
        this.props.history.push("/login");
    }

    componentDidMount() {
        fetch(`${getDomain()}/users`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
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
        const {match} = this.props
        const id = match.params.id
        console.log(this.id);
        return (
            <Container>
                <h2>Profile page of user {id}</h2>
                <p></p>
                {!this.state.users ? (
                    <Spinner />
                ) : (
                    <div>
                        <Users>
                            {this.state.users.map(user => {
                                if(user.id==id)
                                    return (
                                        <PlayerContainer key={id}>
                                            <PlayerProfile user={user} />
                                        </PlayerContainer>
                                    );
                            })}
                        </Users>
                        <Link to="/game">
                                <Button
                                    width="100%"
                                    component={ Link } to="/about" variant="contained"
                                >
                                    Back to user listing
                                </Button>
                        </Link>
                        <p></p>
                        <Button
                            width="100%"
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

export default withRouter(Profile);
