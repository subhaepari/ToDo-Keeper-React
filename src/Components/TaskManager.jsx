import React, { useEffect, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import ProgressBar from "react-bootstrap/ProgressBar";
import { RadioGroup, Radio } from "react-radio-group";
//import { useParams } from "react-router-dom";
//import { Link } from "react-router-dom";

import useFetch from "../Hooks/useFetch";
import useFetchAll from "../Hooks/useFetchAll";
import Spinner from "./Spinner";
import PageNotFound from "./PageNotFound";
import TaskList from "./TaskList";
import ModalEditTask from "./ModalEditTask";
import SearchBar from "./SearchBar";
import useGetLoginUserId from "../Hooks/useGetLoginUserId";


const baseUrl = "http://localhost:8083/";
const loginUserKey = "todo-keeper-loginuser";
let loginUserNameKey = "todo-keeper-loginuser-name";

export default function TaskManager() {
  const [userid, setUserid] = useGetLoginUserId();

  const [filterCriteria, setFilterCriteria] = useState({
    selectedCategories: ["all"],
    selectedPriorities: ["all"],
    selectedStatus: "all",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [showFilterOffCanvas, setShowFilterOffCanvas] = useState(false);
  const handleCloseFiltersOffCanvas = () => setShowFilterOffCanvas(false);
  const handleShowFiltersOffCanvas = () => setShowFilterOffCanvas(true);

  const userlistForNewTaskRef = useRef(null);
  const categoriesForNewTaskRef = useRef(null);
  const descriptionForNewTaskRef = useRef(null);
  const deadlineForNewTaskRef = useRef(null);
  const priorityForNewTaskRef = useRef(null);

  const priorityForAddTask_Low_Ref = useRef(null);
  const priorityForAddTask_Medium_Ref = useRef(null);
  const priorityForAddTask_High_Ref = useRef(null);

  const [showAddTask, setShowAddTask] = useState(false);
  const handleAddTaskModalClose = () => setShowAddTask(false);
  const handleAddTaskModalShow = () => setShowAddTask(true);

  let categoriesForUpdateTaskRef = useRef("");
  let descriptionForUpdateTaskRef = useRef("");
  let deadlineForUpdateTaskRef = useRef("");
  let priorityForUpdateTaskRef = useRef("");

  const [showUpdateTask, setShowUpdateTask] = useState(false);
  const handleUpdateTaskModalClose = () => setShowUpdateTask(false);
  const handleUpdateTaskModalShow = () => setShowUpdateTask(true);

  let taskToUpdateRef = useRef({});
  let loginUserNameRef = useRef("");

  //When the Component loads first time fetch the Users and Categories
  const urls = ["api/users", "api/categories"];
  const { data, loading, error } = useFetchAll(urls);

  const url = `api/todos/byuser/${userid}`;
  const {
    data: userTasks,
    setData,
    setUserTasks,
    loading: taskLoading,
    error: taskError,
  } = useFetch(url);

  useEffect(() => {
    loginUserNameRef.current = localStorage.getItem(loginUserNameKey);
  }, []);

  if (error || taskError) throw error;
  if (loading || taskLoading) return <Spinner />;

  let users = null;
  let categories = null;

  if (data != null && data.length === 2) {
    users = data[0];
    categories = data[1];
  }

  //second render onwards this is not required
  if (users == null || users.length === 0) return "Users not loaded";
  if (categories == null || categories.length === 0)
    return "Categories not loaded";

  if (userTasks == null) return "Tasks not Loaded...";

  let filteredTasks = null;

  if (exists(searchTerm) && searchTerm.length > 0) {
    filteredTasks = userTasks.filter(
      (task) => task.description.indexOf(searchTerm) >= 0
    );
  } else {
    if (
      filterCriteria.selectedCategories.includes("all") &&
      filterCriteria.selectedPriorities.includes("all") &&
      filterCriteria.selectedStatus === "all"
    ) {
      filteredTasks = userTasks;
    } else {
      filteredTasks = userTasks.filter((task) => taskFilter(task));

      console.log(filteredTasks);
    }
  }

  //update progress bar with the percentage of completed tasks being dispalyed on screeen, i.e filltered completion percenatgs
  let percentCompleteOfDisplayTasks = calculatePercentCompleteOfDisplayTasks();

  function calculatePercentCompleteOfDisplayTasks() {
    let completePercentage = 0;
    let completedTasks;

    if (!isNullOrUndefined(filteredTasks) && filteredTasks.length > 0) {
      completedTasks = filteredTasks.filter((task) => task.completed);
    }

    if (!isNullOrUndefined(completedTasks) && completedTasks.length > 0) {
      completePercentage = (
        (completedTasks.length / filteredTasks.length) *
        100
      ).toFixed(0);
    }
    return completePercentage;
  }

  function isNullOrUndefined(value) {
    return value === undefined || value === null;
  }

  function searchTasks(searchStr) {
    //Before setting search string clear filter criteria

    if (searchStr.length > 0) {
      setFilterCriteria({
        selectedCategories: ["all"],
        selectedPriorities: ["all"],
        selectedStatus: "all",
      });
    }

    setSearchTerm(searchStr);
  }

  function taskFilter(task) {
    //alert("Task Filter   :    "+`${category} ${priority}`);
    if (
      (filterCriteria.selectedCategories.includes("all") ||
        filterCriteria.selectedCategories.includes(task.category)) &&
      (filterCriteria.selectedPriorities.includes("all") ||
        filterCriteria.selectedPriorities.includes(task.priority)) &&
      (filterCriteria.selectedStatus === "all" ||
        filterCriteria.selectedStatus == task.completed.toString())
    )
      return true;

    return false;
  }

  //sets the filter criteria
  function filterTasks() {
    // alert("Setting Filter criteria");

    let selectedCategories = null;
    let selectedPriorities = null;
    let selectedStatusType = null;

    let categories_nodelist = document.getElementsByName("categoryCheckGroup");
    let categories_node_arr = Array.from(categories_nodelist);
    let selectedCategories_node_arr = categories_node_arr.filter(
      (cat) => cat.checked
    );
    if (
      exists(selectedCategories_node_arr) &&
      selectedCategories_node_arr.length > 0
    ) {
      selectedCategories = selectedCategories_node_arr.map(
        (node) => node.value
      ); //Mapping node array to string array
    } else selectedCategories = ["all"]; //when no selections are done for any criteria, take it as all, to avoid any runtime exception

    let priorities_nodelist = document.getElementsByName("priorityCheckGroup");
    let priorities_node_arr = Array.from(priorities_nodelist);
    let selectedPriorities_node_arr = priorities_node_arr.filter(
      (priority) => priority.checked
    );
    if (
      exists(selectedPriorities_node_arr) &&
      selectedPriorities_node_arr.length > 0
    ) {
      selectedPriorities = selectedPriorities_node_arr.map(
        (node) => node.value
      );
    } else selectedPriorities = ["all"];

    let status_nodelist = document.getElementsByName("statusRadioGroup");
    let status_node_arr = Array.from(status_nodelist);
    let selectedStatus_node_arr = status_node_arr.filter(
      (status) => status.checked
    );

    if (exists(selectedStatus_node_arr) && selectedStatus_node_arr.length > 0) {
      selectedStatusType = selectedStatus_node_arr[0].value;
    } else selectedStatusType = "all";

    //Set Search term empty so it does not overwrite filter
    handleCloseFiltersOffCanvas();

    setSearchTerm("");

    setFilterCriteria({
      selectedCategories: selectedCategories,
      selectedPriorities: selectedPriorities,
      selectedStatus: selectedStatusType,
    });
  }

  function handleClearFilters() {
    setFilterCriteria({
      selectedCategories: ["all"],
      selectedPriorities: ["all"],
      selectedStatus: "all",
    });
  }

  function exists(obj) {
    return typeof obj != "undefined" && obj != null ? true : false;
  }

  function toggleTaskStatus(task) {
    async function toggleTaskStatusOnServer() {
      try {
        console.log("Ferching from :" + `${baseUrl}api/todos/` + task.id);
        //This rest API just toggles the status, if an empty body is passed
        const response = await fetch(`${baseUrl}api/todos/` + task.id, {
          method: "PUT",
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });

        if (response.ok) {
          const json = await response.json();

          if (!task.completed == json.completed) {
            console.log(
              `Updated task status successfully to completed: ${json.completed}`
            );

            // Re-rendering component fetching new UI
            setUserTasks([...userTasks]);
          } else {
            throw "server response ok but result not ok ";
          }
        } else {
          throw response;
        }
      } catch (e) {
        // setError(e);
      }
    }

    toggleTaskStatusOnServer();
  }

  function deleteTask(taskid) {
    async function deleteTaskOnServer() {
      try {
        console.log("Deleting  :" + `${baseUrl}api/todos/` + taskid);

        const response = await fetch(`${baseUrl}api/todos/` + taskid, {
          method: "DELETE",
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });
        if (response.ok) {
          const json = await response.json();

          if (taskid === json.deletedTodo.id) {
            console.log(`Deleted successfully task with id: ${taskid}`);

            // Re-rendering component fetching new UI
            setUserTasks([...userTasks]);
            //toast success
          } else {
            throw "Got server response but result not ok ";
          }
        } else {
          //alert("response not ok :" + response);
          throw response;
        }
      } catch (e) {
        //alert("caught error:" + e);
        //toast fail
        //setError(e);
      }
    }

    deleteTaskOnServer();
  }

  function createNewTask() {
    async function createNewTaskOnServer() {
      try {
        console.log("entered create new task");

        let newPriority = "Low";
        if (priorityForAddTask_High_Ref.current.checked) newPriority = "High";
        else if (priorityForAddTask_Medium_Ref.current.checked)
          newPriority = "Medium";

        let newTaskObj = {
          userid: userlistForNewTaskRef.current.value,
          category: categoriesForNewTaskRef.current.value,
          description: descriptionForNewTaskRef.current.value,
          deadline: deadlineForNewTaskRef.current.value,
          priority: newPriority,
          completed: false,
        };

        const response = await fetch(`${baseUrl}api/todos/`, {
          method: "POST",
          body: JSON.stringify(newTaskObj),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });

        if (response.ok) {
          const json = await response.json();

          if (json.id === undefined || json.id === null) {
            console.log("Task could not be added.");
            throw "Task could not be added.";
          }

          console.log(`Created task status successfully with id: ${json.id}`);

          handleAddTaskModalClose();
          // Re-rendering component fetching new UI
          setUserTasks([...userTasks]);
          //toast success
        } else {
          // alert("response not ok :" + response);
          throw response;
        }
      } catch (e) {
        handleAddTaskModalClose();
        // alert("caught error:" + e);
        //toast fail
        //setError(e);
      }
    }

    createNewTaskOnServer();
  }

  function updateTask(event) {
    console.log("entered update task");

    event.preventDefault();

    let form = event.target;
    let formData = new FormData(form);
    let formDataObj = Object.fromEntries(formData.entries());
    // alert("entered update task with form submit params" + JSON.stringify(formDataObj));

    async function updateTaskOnServer() {
      try {
        let taskid = formDataObj.taskIdForUpdate;
        let updateTaskObj = {
          category: formDataObj.categoryForUpdate,
          description: formDataObj.descriptionForUpdate,
          deadline: formDataObj.deadlineForUpdate,
          priority: formDataObj.priorityForUpdate,
        };

        const response = await fetch(`${baseUrl}api/todos/${taskid}`, {
          method: "PUT",
          body: JSON.stringify(updateTaskObj),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        });

        if (response.ok) {
          const json = await response.json();

          if (json.id === undefined || json.id === null) {
            console.log("Task could not be added.");
            throw "Task could not be added.";
          }

          console.log(`Updated task status successfully with id: ${json.id}`);

          handleUpdateTaskModalClose();
          // Re-rendering component fetching new UI
          setUserTasks([...userTasks]);
          //toast success
        } else {
          // alert("response not ok :" + response);
          throw response;
        }
      } catch (e) {
        handleUpdateTaskModalClose();
        // alert("update task caught error:" + e);
        //toast fail
        //setError(e);
      }
    }

    updateTaskOnServer();
  }

  function editTask(task) {
    taskToUpdateRef.current = task;

    handleUpdateTaskModalShow();
  }

  let showchk = true;

  function showCheckboxes() {
    let checkboxes = document.getElementById("checkBoxes");

    if (showchk) {
      checkboxes.style.display = "block";
      showchk = false;
    } else {
      checkboxes.style.display = "none";
      showchk = true;
    }
  }

  return (
    <>
      <section id="homeHeader">
        <br />
        <br />
        <div style={{ backgroundColor: "white" }}>
          <Container fluid>
            <Row>
              <Col xs={10}>
                <Row>
                  <br />
                  <div
                    className="d-flex"
                    style={{ justifyContent: "space-between" }}
                  >
                    <div>
                      <h1 className="logo">TO-DO Keeper</h1>
                      <h6 className="logo-foot">
                        Stay Organized, Tracked, Focussed...
                      </h6>
                    </div>
                    <div
                      style={{ justifyContent: "center", alignSelf: "center" }}
                    >
                      {loginUserNameRef.current.length && (
                        <h6 class="logo-foot text-end">
                          Hello! {loginUserNameRef.current}!!
                        </h6>
                      )}
                    </div>{" "}
                    {/* <h6 class="logo-foot text-end">Hello! Subha Epari!!</h6> */}
                  </div>
                </Row>
                <Row>
                  <Col
                    md={1}
                    className="justify-content-center, align-content-end"
                  >
                    <Button variant="link" onClick={handleAddTaskModalShow}>
                      <img
                        src="images/icons/Gartoon-Team-Gartoon-Action-List-add.72.png"
                        alt="Add Task"
                        title="Add Task"
                      />
                    </Button>
                  </Col>
                  <Col md={3}>
                    <br />
                    <fieldset style={{ border: "5px", borderColor: "grey" }}>
                      <legend className="text-muted small">
                        Retrieve and Review your and your team tasks with ease.
                      </legend>
                      <div>
                        <label htmlFor="userlist" className="text-muted small">
                          Assignee:
                        </label>

                        <Form.Select
                          id="userlist"
                          value={userid}
                          onChange={(e) => setUserid(e.target.value)}
                          size="sm"
                        >
                          {users.map((usr) => (
                            <option key={usr.id} value={usr.id}>
                              {usr.name}
                            </option>
                          ))}
                        </Form.Select>
                      </div>
                    </fieldset>
                  </Col>
                  <Col
                    md={4}
                    className="justify-content-center, align-content-end"
                  >
                    <SearchBar searchCallback={searchTasks} />
                  </Col>
                  <Col
                    md={4}
                    className="justify-content-center, align-content-end"
                  >
                    {(!filterCriteria.selectedCategories.includes("all") ||
                      !filterCriteria.selectedPriorities.includes("all") ||
                      filterCriteria.selectedStatus != "all") && (
                      <div
                        className="d-flex"
                        style={{ justifyContent: "space-between" }}
                      >
                        <label
                          style={{ marginLeft: "0px", color: "darkgreen" }}
                        >
                          Filtered by Criteria:
                        </label>
                        <Button
                          style={{ color: "darkgreen", textDecoration: "none" }}
                          variant="link"
                          onClick={handleClearFilters}
                        >
                          <img
                            src="images/icons/Double-J-Design-Origami-Colored-Pencil-Green-cross.24.png"
                            alt="Clear Filters"
                            title="Clear Filters"
                          />
                        </Button>
                      </div>
                    )}
                    <div className="d-flex">
                      <Button
                        style={{ padding: 0 }}
                        variant="success"
                        onClick={handleShowFiltersOffCanvas}
                      >
                        <img
                          src="images/icons/Double-J-Design-Ravenna-3d-Filter-List.64.png"
                          alt="Filter Tasks"
                          title="Filter Tasks"
                        />
                      </Button>
                      {!filterCriteria.selectedCategories.includes("all") && (
                        <div
                          className="small"
                          style={{ marginLeft: "10px", color: "darkgreen" }}
                          id="category-filters"
                        >
                          <label className="text-muted">Categories:</label>
                          <list>
                            {filterCriteria.selectedCategories.map((cat) => (
                              <li>{cat}</li>
                            ))}
                          </list>
                        </div>
                      )}

                      {!filterCriteria.selectedPriorities.includes("all") && (
                        <div
                          className="small"
                          style={{ marginLeft: "10px", color: "darkgreen" }}
                          id="category-filters"
                        >
                          <label className="text-muted">Priorities:</label>
                          <list>
                            {filterCriteria.selectedPriorities.map((cat) => (
                              <li>{cat}</li>
                            ))}
                          </list>
                        </div>
                      )}

                      {filterCriteria.selectedStatus != "all" && (
                        <div
                          className="small"
                          style={{ marginLeft: "10px", color: "darkgreen" }}
                          id="category-filters"
                        >
                          <label className="text-muted">Status:</label>
                          <br />
                          <label
                            style={{ marginLeft: "10px", color: "darkgreen" }}
                          >
                            {filterCriteria.selectedStatus == "true"
                              ? "Completed"
                              : "Pending"}
                          </label>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>

                <div className="mt-20 mb-10">
                  <br />
                  <ProgressBar
                    variant="success"
                    now={percentCompleteOfDisplayTasks}
                    striped
                    label={percentCompleteOfDisplayTasks}
                  />
                  <br />
                </div>
              </Col>

              <Col xs={2}>
                <Image src="images/sticky-thumbs-up.jpeg" rounded fluid />
              </Col>
            </Row>
          </Container>
        </div>
      </section>

      <section id="filters-offcanvas">
        <Offcanvas
          show={showFilterOffCanvas}
          onHide={handleCloseFiltersOffCanvas}
          placement="end"
          id="offcanvas-filters"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvas-filters-title">
              <b>Task Filter Criteria:</b>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div id="offcanvas-filters-div">
              <p className="mb-10">Select your options to filter tasks:</p>

              <div id="category_filter_checks">
                <h5>Categories: </h5>

                {categories.map((option) => (
                  <Form.Check
                    key={option.id}
                    type="checkbox"
                    id={option.name}
                    label={option.name}
                    name="categoryCheckGroup"
                    value={option.name}
                  />
                ))}
              </div>

              <div id="status_filter_check">
                <h5>Status: </h5>

                <Form.Check
                  type="radio"
                  label="All"
                  name="statusRadioGroup"
                  id="status_all"
                  value="all"
                  // checked = {true}
                />
                <Form.Check
                  type="radio"
                  label="Complete"
                  name="statusRadioGroup"
                  id="status_complete"
                  value="true"
                />
                <Form.Check
                  type="radio"
                  label="Pending"
                  name="statusRadioGroup"
                  id="status_incomplete"
                  value="false"
                />
              </div>

              <div id="priority_filter_checks">
                <h5>Priority: </h5>

                <Form.Check
                  type="checkbox"
                  label="High"
                  name="priorityCheckGroup"
                  id="priority_high"
                  value="High"
                />
                <Form.Check
                  type="checkbox"
                  label="Medium"
                  name="priorityCheckGroup"
                  id="priority_medium"
                  value="Medium"
                />
                <Form.Check
                  type="checkbox"
                  label="Low"
                  name="priorityCheckGroup"
                  id="priority_low"
                  value="Low"
                />
              </div>

              <Button
                id="offcanvas-filters-btn"
                size="sm"
                onClick={filterTasks}
              >
                Fetch Filtered Tasks
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </section>

      <section id="Add Task Modal">
        <Modal
          id="modalAddTask"
          show={showAddTask}
          onHide={handleAddTaskModalClose}
        >
          <Modal.Header closeButton>
            <Modal.Title id="modalAddTaskTitle">Create New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <label for="userlistForNewTask">Assignee: </label>

              <Form.Select
                id="userlistForNewTask"
                ref={userlistForNewTaskRef}
                size="sm"
                className="mb-3"
              >
                {users.map((usr) => (
                  <option key={usr.id} value={usr.id}>
                    {usr.name}
                  </option>
                ))}
              </Form.Select>

              <label for="categoriesForNewTask">Category: </label>

              <Form.Select
                id="categoriesForNewTask"
                ref={categoriesForNewTaskRef}
                size="sm"
                className="mb-3"
              >
                <option value="">Choose...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </Form.Select>

              <Form.Group className="mb-3" controlId="addTaskTextareaGrp">
                <Form.Label>Description: </Form.Label>
                <Form.Control
                  id="descriptionForNewTask"
                  ref={descriptionForNewTaskRef}
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
                name="addtask_priorityRadioGroup"
                ref={priorityForAddTask_High_Ref}
                id="priorityForAddTaskId_High"
                value="High"
                inline
              />
              <Form.Check
                type="radio"
                label="Medium"
                name="addtask_priorityRadioGroup"
                ref={priorityForAddTask_Medium_Ref}
                id="priorityForAddTaskId_Medium"
                value="Medium"
                inline
              />
              <Form.Check
                type="radio"
                label="Low"
                ref={priorityForAddTask_Low_Ref}
                name="addtask_priorityRadioGroup"
                id="priorityForAddTaskId_Low"
                value="Low"
                inline
              />

              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label className="margin-right-4">Deadline </Form.Label>
                <input
                  id="deadlineForNewTask"
                  ref={deadlineForNewTaskRef}
                  type="date"
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={createNewTask}>
              Create task
            </Button>
          </Modal.Footer>
        </Modal>
      </section>

      <section id="EditTaskModal">
        <ModalEditTask
          showModal={showUpdateTask}
          handleClose={handleUpdateTaskModalClose}
          onSubmitHandle={updateTask}
          taskToUpdate={taskToUpdateRef.current}
          categories={categories}
        />
      </section>

      <br />
      <br />

      <section id="usertasks">
        <div id="taskListDiv">
          <br />
          <TaskList
            tasks={filteredTasks}
            onToggleStatus={toggleTaskStatus}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        </div>
      </section>
    </>
  );
}
