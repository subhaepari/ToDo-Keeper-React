import { Routes, Route } from "react-router-dom";
import Home from './Home';
import TaskManager from './TaskManager';
import '../styles/todo-styles.css'


const todoAppStyle = {

  backgroundColor:  "#002042",
  
  backgroundImage: `url('http://localhost:3000/images/asfalt-light.png'})` ,
  
  minHeight: "100vh",     

  backgroundRepeat: "repeat"

};


export default function App() {

  return (
    <>
    <div style={todoAppStyle} className="content">
      
        <main>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/home" element={<Home/>} /> 
            <Route path="/usertasks" element={<TaskManager />} />
          </Routes>
        </main>
      </div>
      
    </>
  );
}
