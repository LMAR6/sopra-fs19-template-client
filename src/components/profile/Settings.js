import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";


const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 0.2);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */



class Settings extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     *
     * Reminder:
     * Do not update state directly
     * // Wrong
     * this.state.comment = 'Hello';
     *
     * // Correct
     * this.setState({comment: 'Hello'});
     *
     * this.state can only be assigned in constructor.
     *
     */
    constructor(props) {
        super(props);
        this.state = {
            user:null,
            username: null,
            userid: null,
            birthday: null,
            changedusername: null,
            changedbirthday: null,
        };
    }

    /**
     * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
     * Initialization that requires DOM nodes should go here.
     * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
     * You may call setState() immediately in componentDidMount().
     * It will trigger an extra rendering, but it will happen before the browser updates the screen.
     */
    componentDidMount() {
        //DEBUGGING
        var cat = localStorage.getItem('userId');
        console.log("ID from local storage: "+ cat);
        //build api path with id from local storage
        let path = `${getDomain()}/users/` + localStorage.getItem("userId");
        const status = response =>{
            if(response.status === 200){
                return Promise.resolve(response);
            }
            return Promise.reject("not receiving status 200");
        };
        const json = response => response.json();
        fetch(path, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            }
        })
            .then(status)
            .then(json)
            .then(data =>{
                this.setState({user: data});
                this.setState({userid: this.state.user.id});
                this.setState({username: this.state.user.username});
                this.setState({birthday:this.state.user.birthday});

            })
            .catch(err =>{
                console.log('Error', err);
            })
    }

    saveSettings(){
        //build api path with id from local storage
        let path=`${getDomain()}/users/` + localStorage.getItem("userId");

        const status = response =>{
            if(response.status === 204){
                return Promise.resolve(response);
            }
            alert("This username is already taken.");
            return Promise.reject("not receiving status 204");
        };
        const str = response => response.text();

        fetch(path, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "token": localStorage.getItem("token")
            },
            body: JSON.stringify({
                token: localStorage.getItem("token"),
                id:this.state.userid,
                username: this.state.changedusername,
                birthday:this.state.changedbirthday
            })
        })

            .then(status)
            .then(str)
            .then(async data =>{
                await new Promise(resolve => setTimeout(resolve, 800));
                this.props.history.push("/game/dashboard");
            })

            .catch(error => {
                console.log(error);
            })
    }

    /**
     *  Every time the user enters something in the input field, the state gets updated.
     * @param key (the key of the state for identifying the field that needs to be updated)
     * @param value (the value that gets assigned to the identified state key)
     */
    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    render() {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
                        <Label>Username</Label>
                        <InputField
                            placeholder={this.state.username}
                            onChange={e => {
                                this.handleInputChange("changedusername", e.target.value);
                            }}
                        />
                        <Label>Birthday</Label>
                        <InputField
                            placeholder={this.state.birthday}
                            onChange={e => {
                                this.handleInputChange("changedbirthday", e.target.value);
                            }}
                        />
                        <ButtonContainer>
                            <Button
                                width="50%"
                                onClick={() => {
                                    this.saveSettings();
                                }}
                            >
                                Save Settings
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Settings);
