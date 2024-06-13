import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";

const baseUrl = "http://localhost:8083/";
let loginUserIdKey = "todo-keeper-loginuser-id";
let loginUserNameKey = "todo-keeper-loginuser-name";
let loginUserKey = "todo-keeper-loginuser";

export default function Home() {
  const navigate = useNavigate();
  const [showSignIn, setShowSignIn] = useState(false);

  const handleCloseSignIn = () => setShowSignIn(false);
  const handleShowSignIn = () => setShowSignIn(true);

  const [showSignUp, setShowSignUp] = useState(false);

  const handleCloseSignUp = () => setShowSignUp(false);
  const handleShowSignUp = () => setShowSignUp(true);

  const [showUsernameNotAvail, setShowUsernameNotAvail] = useState(false);
  const setUsernameNotAvailShowAlert = () => setShowUsernameNotAvail(true);
  const setUsernameNotAvailHideAlert = () => setShowUsernameNotAvail(false);

  const [showPwdNotMatch, setShowPwdNotMatch] = useState(false);
  const setShowPwdNotMatchShowAlert = () => setShowPwdNotMatch(true);
  const setShowPwdNotMatchHideAlert = () => setShowPwdNotMatch(false);

  const [showUserCreated, setShowUserCreated] = useState(false);
  const userCreatedShowAlert = () => setShowUserCreated(true);
  const userCreatedHideAlert = () => setShowUserCreated(false);

  const [showUserNotCreated, setShowUserNotCreated] = useState(false);
  const userCreatedFailShowAlert = () => setShowUserNotCreated(true);
  const userCreateFailHideAlert = () => setShowUserNotCreated(false);

  function exists(obj) {
    return typeof obj != "undefined" && obj != null ? true : false;
  }


  function getUserDetail(loginName) {
    const urlEndPoint = "api/users/";
    const url = baseUrl + urlEndPoint + loginName;

    async function init() {
      try {
        console.log("Home: fetching user from url" + url);
        const response = await fetch(url);
        console.log(response);
        if (response.ok) {
          const loginUser = await response.json();

          if (exists(loginUser)) return loginUser;
          else throw "User does not exist";
        } else {
          console.log("Error from Home: fetching user, response not ok ");
          console.log(response);
          throw response;
        }
      } catch (e) {
        console.log("Error from Home: fetching user, caught error : ");
        console.log(e);
      }
    }
    init();
  }

  function handleSignInSubmit(event) {
    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);
    let formDataObj = Object.fromEntries(formData.entries());

    let loginName = formDataObj.signInName;
    let password = formDataObj.signInPassword;

    const url = baseUrl + "api/users/" + loginName;

    fetch(url)
      .then((response) => response.json())
      .then((loginUser) => {
        if (exists(loginUser)) {
          console.log("User does exist");
          console.log(JSON.stringify(loginUser));
          localStorage.setItem(loginUserIdKey, loginUser.id);
          localStorage.setItem(loginUserNameKey, loginUser.name);
         //localStorage.setItem(loginUserKey, loginUser);
          navigate("/usertasks");
        } else {
          throw "User does not exist";
        }
      })
      .catch((error) => {
        console.log("error");
        console.log("Caught exception while fetching user from sign in page");
      });
  }

  function validatePasswords(data){
    let password = data.signUpPwd;
    let confirm_password = data.confirmSignUpPwd;

    if(password != confirm_password) { 
      setShowPwdNotMatchShowAlert();
      return false;
    } 
    else{
      setShowPwdNotMatchHideAlert();
      return true;
    }
  }

  function handleSignUpSubmit(event) {
    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);
    let formDataObj = Object.fromEntries(formData.entries());

    //Do field validations
   if(!validatePasswords(formDataObj)) return;

    //Add User
    const url = baseUrl + "api/users/";

    let newUserObj = {
      name: formDataObj.userName,
      username: formDataObj.loginName,
      password: formDataObj.signUpPwd,
    };

    // fetch(`${baseUrl}/api/users`, {
    //   method: "POST",
    //   body: JSON.stringify(newUserObj),
    //   headers: { "Content-type": "application/json; charset=UTF-8" },
    // })

    fetch(url, {
      method: "POST",
      body: JSON.stringify(newUserObj),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    })
      .then((response) => response.json())
      .then((json) => {
        // If the POST finishes successfully, display a message
        // with the newly assigned id
        // let message = "Student " + json.id + " added";
        // let confirmationMessage =
        //   document.getElementById(confirmationMessage);
        // confirmationMessage.innerHTML = message;

        if (json.id === undefined || json.id === null) {
          console.log("user could not be added.");

          throw "User could not be added.";
        }

        userCreatedShowAlert();
       // alert("created new user successfully with id :" + json.id);
        console.log("created new user successfully with id :" + json.id);
        //alert("created new user successfully with id :" + json.id);

        // let confirmationMessage = document.getElementById("add-user-message");
        // confirmationMessage.innerHTML = "Registered User Successfully";
      })
      .catch((err) => {
        // If the POST returns an error, display a message
        // let confirmationMessage = document.getElementById(
        //   "add-user-error-message"
        // );
        // confirmationMessage.innerHTML = err;
        userCreatedFailShowAlert();
        console.log("Caught unexpected error while creating new user:" + err);
      });
  }

  function usernameAvalabilityChk(event) {
    console.log("entered usernameAvalabilityChk");

    let username = event.target.value;
    const url = baseUrl + "api/users/";

    //Checking for username availability
    fetch(`${baseUrl}api/username_available/` + username)
      .then((response) => response.json())
      .then((json) => {
        if (json.available == false) {
          console.log(`Username ${username} not available, try another`);
          setUsernameNotAvailShowAlert();
          // alert("try another username");
          // let confirmationMessage = document.getElementById("add-user-avail-msg");
          // confirmationMessage.innerHTML = `Username ${username} not available, try another`;
        } else {
          // let confirmationMessage = document.getElementById("add-user-avail-msg");
          // confirmationMessage.innerHTML = "";
          console.log(`Username ${username}  available`);
          setUsernameNotAvailHideAlert();
          // alert("username available");
        }
      })
      .catch((err) => {
        console.log(
          "Caught unexpected error while checking for user availability" + err
        );
      });
  }

  return (
    <>
      <section id="homeHeader">
        <br />
        <br />
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container fluid="xxl">
            <Row>
              <Col xs={2}></Col>
              <Col xs={8}>
                <br />
                <br />
                <h1 className="logo">TO-DO Keeper</h1>
                <h6 className="logo-foot">
                  Stay Organized, Tracked, Focussed...
                </h6>
              </Col>
              <Col xs={2}>
                <Image src="images/sticky-thumbs-up.jpeg" rounded fluid />
              </Col>
            </Row>
          </Container>
        </Navbar>
      </section>
      <section id="homeMain">
        <br /> <br /> <br /> <br />
        <p class="lead" style={{ color: "white" }}>
          A smarter way to manage work and life efficiently.
        </p>
        <p class="lead" style={{ color: "white" }}>
          Say Good Bye! to scattered and hand written to-do lists.
        </p>
        <br />
        <Button id="loginUserBtn" onClick={handleShowSignIn}>
          Sign In
        </Button>
        <Button id="registerUserBtn" onClick={handleShowSignUp}>
          Sign Up
        </Button>
      </section>

      <section id="signin-offcanvas">
        <Offcanvas
          show={showSignIn}
          onHide={handleCloseSignIn}
          placement="end"
          id="offcanvas-signin"
        >
          <Offcanvas.Header style={{ marginTop: "30px" }} closeButton>
            <Offcanvas.Title id="offcanvas-signin-title">
              {" "}
              Welcome for Sign In
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div
              style={{
                marginTop: "50px",
                marginLeft: "50px",
                marginRight: "50px",
              }}
            >
              <Form onSubmit={handleSignInSubmit} className="mt-50">
                <div className="d-grid gap-3">
                  <Form.Group controlId="formLoginName">
                    <Form.Label>Login Name:</Form.Label>
                    <Form.Control
                      size="sm"
                      name="signInName"
                      type="text"
                      placeholder=""
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      size="sm"
                      name="signInPassword"
                      type="password"
                      placeholder=""
                      required
                    />
                  </Form.Group>

                  <Button type="submit" id="offcanvas-signin-btn" size="sm">
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </section>

      <section id="signup-offcanvas">
        <Offcanvas
          show={showSignUp}
          onHide={handleCloseSignUp}
          placement="end"
          id="offcanvas-signup"
        >
          <Offcanvas.Header style={{ marginTop: "30px" }} closeButton>
            <Offcanvas.Title id="offcanvas-signup-title">
              {" "}
              Welcome for Sign Up
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div
              style={{
                marginTop: "30px",
                marginLeft: "50px",
                marginRight: "50px",
              }}
            >
              <Form className="mt-50" onSubmit={handleSignUpSubmit}>
                <div className="d-grid gap-3">
                  <Form.Group controlId="formSignUpUserName">
                    <Form.Label>User Name</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      name="userName"
                      placeholder=""
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formSignUpLoginName">
                    <Form.Label>Login Name</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      name="loginName"
                      placeholder=""
                      onChange={usernameAvalabilityChk}
                      required
                    />
                  </Form.Group>
                  {showUsernameNotAvail && (
                    <Alert
                      variant="danger"
                      onClose={() => setUsernameNotAvailHideAlert()}
                      dismissible
                    >
                      <p>This Login Name is not available, try another. </p>
                    </Alert>
                  )}

                  <Form.Group controlId="formSignUpPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      size="sm"
                      type="password"
                      name="signUpPwd"
                      placeholder="Password"
                      pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                      title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formSignUpConfirmPassword">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      size="sm"
                      type="password"
                      name="confirmSignUpPwd"
                      placeholder=" Confirm Password"
                      required
                    />
                  </Form.Group>

                  <Button id="offcanvas-signup-btn" size="sm" type="submit">
                    Submit
                  </Button>
                  {showPwdNotMatch && (<Alert
                      variant="danger"
                      onClose={() => setShowPwdNotMatchHideAlert()}
                      dismissible
                    >
                      <p>Passwords do not match.</p>
                    </Alert>)
                  }
                  {showUserCreated && (<Alert
                      variant="success"
                      onClose={() => userCreatedHideAlert()}
                      dismissible
                    >
                      <p>User Created Successfully.</p>
                    </Alert>)
                  }
                  {showUserNotCreated && (<Alert
                      variant="danger"
                      onClose={() => userCreateFailHideAlert()}
                      dismissible
                    >
                      <p>New user could not be created.</p>
                    </Alert>)
                  }

                </div>
              </Form>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </section>
    </>
  );
}
