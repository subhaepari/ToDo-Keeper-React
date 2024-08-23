import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Spinner from "./Spinner";
import useFetch from "../Hooks/useFetch";
import PageNotFound from "./PageNotFound";

import Task from "./Task";

export default function TaskList(props) {

  const { tasks: tasks } = props;

  return (
    <>
      <section id="usertasks">
       

        {tasks.length === 0 && 
           ( <h6 style={{marginLeft: "100px"}}> No tasks to display!</h6>)
        }

        <Table responsive hover striped>
        {tasks.length !== 0 && 
            <thead ><tr>
            <th>Priority</th>
            <th>Task</th>
            <th>Category</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr></thead>
        }
          <tbody>
            {tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                onToggleStatus={props.onToggleStatus}
                onDelete={props.onDelete}
                onEdit={props.onEdit}
              />
            ))}
          </tbody>
        </Table>
      </section>
    </>
  );
}
