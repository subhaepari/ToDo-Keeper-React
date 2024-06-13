import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";



export default function OffCanvasSignUp(props){

    const { showModal, handleClose, onSubmitHandle, taskToUpdate, categories } =
    props;





return(
<Offcanvas show={showSignUp} onHide={handleCloseSignUp} placement="end" id="offcanvas-signup">
<Offcanvas.Header style={{marginTop: "30px"}} closeButton>
  <Offcanvas.Title id="offcanvas-signup-title" > Welcome for Sign Up</Offcanvas.Title>
</Offcanvas.Header>
<Offcanvas.Body>
  <div style={{marginTop: "30px", marginLeft: "50px", marginRight: "50px"}}>
    <Form className="mt-50"  onSubmit={handleSignUpSubmit}  >
      
    <div className="d-grid gap-3">

      <Form.Group controlId="formSignUpUserName">
        <Form.Label>User Name</Form.Label>
        <Form.Control size="sm" type="text" name = "userName" placeholder="" />
      </Form.Group>

      <Form.Group controlId="formSignUpLoginName">
        <Form.Label>Login Name</Form.Label>
        <Form.Control size="sm" type="text"  name = "loginName" placeholder=""  onChange={usernameAvalabilityChk}/>
      </Form.Group>
      <Alert 
          variant="danger"
          onClose={() => setUsernameNotAvailShow(false)} 
          dismissible> 
          <p>This Login Name is not available, try another. </p> 
      </Alert> 

      <Form.Group controlId="formSignUpPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control size="sm" type="password"  name = "signUpPwd" placeholder="Password" />
      </Form.Group>

      <Form.Group controlId="formSignUpConfirmPassword">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control size="sm" type="password"   name = "confirmSignUpPwd"  placeholder=" Confirm Password" />
      </Form.Group>

      <Button  id = "offcanvas-signup-btn"  size="sm"  type="submit" >
        Submit
      </Button>
      </div>
    </Form>
  </div>
</Offcanvas.Body>
</Offcanvas>

);

}