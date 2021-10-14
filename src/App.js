
import './App.css';
import { useState,useEffect} from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import _ from "lodash";
import {v4} from "uuid";

const item = {
  id:v4(),
  name:"Buy new Mobile",
  description: "On diwali you need to buy new mobile phone",
  time:"15 mins"
}
const item2 = {
  id:v4(),
  name:"Complete THA",
  description: "Till Tomorrow U have to complete pending THA's",
  time:"3 hrs"
}

function App() {
  
  

  const[input,setInput] = useState({
    
    "name":"",
    "time":"",
    "description":"",
  });
  const [state,setState] = useState(JSON.parse(localStorage.getItem("todos"))||{
    "todo":{
      title:"To do",
      items:[item,item2],
      color:"#0163F7",
    },
    "in-progress":{
      title:"Pending-Todo",
      items:[],
      color:"red",
    },
    "completed":{
      title:"Completed",
      items:[],
      color:"#5CB323",
    }})

    // useEffect(()=>{
    //   setInput({"name":"",
    //   "time":"",
    //   "description":"",});
    // },[state])
    // console.log(input)


    const handleDragEnd = ({destination,source})=>{
     
      if(!destination){
        return
      }
      if(destination.index === source.index && destination.droppableId === source.droppableId){
        return
      }
      // making copy 
      const itemCopy = {...state[source.droppableId].items[source.index]}
      setState(prev =>{
        prev = {...prev}
        // deleteing from one place
        prev[source.droppableId].items.splice(source.index,1)
        
        // adding to another placeee
        prev[destination.droppableId].items.splice(destination.index,0,itemCopy)

        return prev
      })
    }






    const handleInput = (e,props)=>{
      setInput({...input,[props]:e.target.value})
      
    }
    


    useEffect(()=>{
      localStorage.setItem("todos",JSON.stringify(state));
    },[state]);


    const openForm = ()=>{
     const form = document.querySelector(".form")
     const submit_btn = document.querySelector(".submit");
     form.classList.add("show");
     const cancel = document.querySelector(".cancel-b");
     cancel.addEventListener("click",()=>{
       form.classList.remove("show");
     })
     submit_btn.addEventListener("click",()=>{
       form.classList.remove("show");
     })
    }




    const addTodo = (value)=>{
      setState({...state,todo:{title:"To do",items:[...state.todo.items,value]}})
      // setState("")
      setInput({
    
        "name":"",
        "time":"",
        "description":"",
      });
    }





  return (
    <div className="App">
        <div className="main-button">
          <button onClick={openForm} className="add-b">+</button>
        </div>
      <div className="FORM"></div>
        
       <form className="form">
        <div className="form-item">
            <div className="name">
                <span>Enter Task:</span>
                <input type="text" required placeholder="Enter a Todo " onChange={(e)=>{handleInput(e,"name")}} value={input.name} />
            </div>
            <div className="time">
                <span>Enter Due Date:</span>
                <input type="date" required placeholder="Time " onChange={(e)=>{handleInput(e,"time")}} value={input.time} />
            </div>
        </div>
        <div className="description">
            <span>Enter Task description</span>
            <input type="text" required placeholder="Task Description" onChange={(e)=>{handleInput(e,"description")}} value={input.description} />
        </div>
        <div className="form-button">
            <span className="cancel-b" onClick={()=>{
              setInput({
                "name":"",
                "time":"",
                "description":"",})
            }}>Cancel</span>
            {input.name && input.time && input.description ? 
            <button className="submit" onClick={(e)=>{
              
              addTodo({...input,id:v4()})
              e.preventDefault();
              setInput({
                "name":"",
                "time":"",
                "description":"",})
            }
              
              }>Save</button> : <button className="submit" onClick={(e)=>{e.preventDefault()}} >Save</button>}
        </div>
        <div className="instruction">(A new to-do will be added to To Do column.)</div>
      </form>
        <div className="Wrapper">
        <DragDropContext onDragEnd={handleDragEnd} >
          {_.map(state,(data,key)=>{
// console.log(data.color)

            return(
              
              <div key={key} className="column">
                <div className="col-head"><h3>{data.title}</h3><span style={{backgroundColor:data.color ,boxShadow:"0px 0px 10px 1px " + data.color }}></span></div>
                <div>
                <Droppable droppableId={key}>
                  {(provided,snapshot)=>{
                  return(
                    <div className="droppable-col" ref={provided.innerRef} {...provided.droppableProps}>
                      {data.items.map((el,index)=>{
                        return(
                        <Draggable key={el.id} index={index} draggableId={el.id}>
                          {(provided)=>{
                            return(
                              <div className="item" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <div className="todo">
                                  <div className="header">
                                    <span className="name">{el.name}</span>
                                    <span className="time">{el.time}</span>
                                    </div>
                                  <hr style={{borderTop:"2px solid " + data.color}} />
                                  <span className="description">
                                    {el.description}
                                  </span>
                                  
                                </div>
                                <span className="delete" onClick={()=>{
                                  const newTodos = {...state,[key]:{...state[key],items:state[key].items.filter((el2)=>el2.id!==el.id)}}
                                  setState(newTodos)
                                }}>
                                  X
                                  </span>
                              </div>
                            )
                          }}
                        </Draggable>)
                      })}
                      {provided.placeholder}
                    </div>
                  )
                }}
                </Droppable>
                </div>
              </div>
            ) 
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
