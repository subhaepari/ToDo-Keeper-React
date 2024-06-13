import React from "react";

export default function Task(props) {
  const { task: task } = props;

  let priorityImg = "/images/Blue-Circle.24.png";
  if (task.priority === "Medium") priorityImg = "/images/Yellow-Circle.24.png";
  else if (task.priority === "High") priorityImg = "/images/Red-Circle.24.png";

  let statusImg = task.completed
    ? "/images/Green-Ok-Circle.24.png"
    : "/images/Grey-Circle.24.png";
  let statusImgTitle = task.completed
    ? "Click to mark incomplete"
    : "Click to mark complete";

  function handleStatusToggle() {
    props.onToggleStatus(task);
  }

  function handleDelete() {
    props.onDelete(task.id);
  }
  function handleEdit() {
    props.onEdit(task);
  }

  return (
    <tr>
      <td>
        <img src={priorityImg} />
      </td>
      <td>{task.description}</td>
      <td>{task.deadline}</td>
      <td>
        <button style={{ border: 0 }} onClick={handleStatusToggle}>
          <img src={statusImg} title={statusImgTitle} />
        </button>
      </td>
      
      {/* <td>
        <img src="/images/icons/Custom-Icon-Design-Pretty-Office-9-Edit-file.24.png" title="View Task Detail"></img>
      </td> */}

      <td>
      <button style={{ border: 0 }} onClick={handleEdit}>
        <img
          src="/images/icons/Oxygen-Icons.org-Oxygen-Actions-document-edit.24.png"
          title="Edit Task"   
        />
        </button>
      </td>
    
      <td>
        <button style={{ border: 0 }} onClick={handleDelete}>
          <img src="/images/delete.24.png" title="Delete Task" />
        </button>
      </td>

      {/* <section id="task">
        
      <p>{task.description}</p>
       
        
      </section> */}
    </tr>
  );
}
