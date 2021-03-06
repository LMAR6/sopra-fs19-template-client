import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
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

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user : null,
        };
        //debugging
        console.log(this.props);
        console.log(props.userid);
    }

    logout = () => {

        fetch(`${getDomain()}/users/` + localStorage.getItem("userId"), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "token": localStorage.getItem("token")

            },
            //change status to OFFLINE
            body: JSON.stringify({
                id: localStorage.getItem("userId"),
                status: "OFFLINE"
            })
        })
            //remove token from local storage
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
        //get all users for listing
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
        //get id from url/app router
        const {match} = this.props;
        const id = match.params.id;
        //console.log(this.id);
        return (
            <Container>
                <h2>Profile User {id}</h2>
                <p></p>
                {!this.state.users ? (
                    <Spinner />
                ) : (
                    <div>
                        <Users>
                            {this.state.users.map(user => {
                                //cheap trick to only return user with appropriate id, not very efficient
                                //made new design PlayerProfile for this
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
