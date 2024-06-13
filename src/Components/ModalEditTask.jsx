import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ModalEditTask(props) {
  const { showModal, handleClose, onSubmitHandle, taskToUpdate, categories } =
    props;

  const [category, setCategory] = useState(taskToUpdate.category);
  const [description, setDescription] = useState(taskToUpdate.description);
  const [deadline, setDeadline] = useState(taskToUpdate.deadline);
  const [priority, setPriority] = useState(taskToUpdate.priority);

  const defaultCategory = taskToUpdate.category;
  const defaultDescription = taskToUpdate.description;
  const defaultPriority = taskToUpdate.priority;
  const defaultDeadline = taskToUpdate.deadline;
  //const category = taskToUpdate.category
  // const description = taskToUpdate.description
  // const category =
  // const [description, setDescription] = useState(taskToUpdate.description);
  // const [deadline, setDeadline] = useState(taskToUpdate.deadline);
  // const [priority, setPriority] = useState(taskToUpdate.priority);

  // alert("Entered modal with props"  + JSON.stringify(props));

  return (
    <Modal  id="modalEditTask" show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit and Update Task</Modal.Title>
        {/* <br/> */}
        {/* <h6>Provide details for the new task.</h6> */}
      </Modal.Header>
      <Form onSubmit={onSubmitHandle}>
        <Modal.Body>
          <label for="categoriesForUpdateTaskId">Category: </label>
          {/* <Form.Label htmlFor="categoriesForAddTask">Category</Form.Label> */}
          <Form.Select
            id="categoriesForUpdateTaskId"
            name="categoryForUpdate"
            // ref={categoriesForUpdateTaskRef}
            size="sm"
            className="mb-3"
            defaultValue={defaultCategory}
            value={category}
            // onChange={(event)=> setCategory(event.target.value)}
            // onChange={(e) => setUserid(e.target.value)}
          >
            <option value="">Choose...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </Form.Select>

          <Form.Group className="mb-3" controlId="updateTaskTextareaGrp">
            <Form.Label>Description: </Form.Label>
            <Form.Control
              id="descriptionForUpdateTaskId"
              name="descriptionForUpdate"
              // ref={descriptionForUpdateTaskRef}
              defaultValue={defaultDescription}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              as="textarea"
              rows={3}
              autoFocus
              required
            />
          </Form.Group>

          <Form.Label className="mr-4">Priority </Form.Label>
          <Form.Check
            type="radio"
            label="High"
            name="priorityForUpdate"
            id="priorityForUpdateTaskId_High"
            value="High"
            defaultChecked={defaultPriority === "High"}
            inline
          />
          <Form.Check
            type="radio"
            label="Medium"
            name="priorityForUpdate"
            id="priorityForUpdateTaskId_Medium"
            value="Medium"
            defaultChecked={defaultPriority === "Medium"}
            inline
          />
          <Form.Check
            type="radio"
            label="Low"
            name="priorityForUpdate"
            id="priorityForUpdateTaskId_Low"
            value="Low"
            defaultChecked={defaultPriority === "Low"}
            inline
          />

          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label className="margin-right-4">Deadline </Form.Label>
            <input
              id="deadlineForUpdateTaskId"
              name="deadlineForUpdate"
              // ref={deadlineForUpdateTaskRef}
              defaultValue={defaultDeadline}
              value={deadline}
              type="date"
              onChange={(event) => setDeadline(event.target.value)}
            />
            {/* <DatePicker/> */}
          </Form.Group>

          <input
            id="taskIdForUpdateTaskId"
            name="taskIdForUpdate"
            value={taskToUpdate.id}
            type="text"
            hidden
          />

        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Update Task
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
