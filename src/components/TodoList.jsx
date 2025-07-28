import { useEffect, useRef, useState } from "react"
import TodoForm from "./TodoForm"
import TodoItem from "./TodoItem"
import axios from "axios";

export default function TodoList() {
    const [tdata, setTdata] = useState([]);
    const selRef = useRef();
    const ipRef = useRef();
    const url = `http://localhost:3005/todos`;

    const handleOk = (e) => {
        e.preventDefault();

        if(selRef.current.value == "") {
            alert("제목을 입력하세요.");
            selRef.current.focus();
            return;
        }
        if(ipRef.current.value == "") {
            alert("제목을 입력하세요.");
            ipRef.current.focus();
            return;
        }

        addTodo(ipRef.current.value, selRef.current.value);
        handleReset(e);
    }

    const addTodo = async (text, completed) => {
        const postData = {
            "text": text,
            "completed": completed
        }

        let { data } = await axios.post(url, postData);
        //console.log(data)
        setTdata([...tdata, data]);
    };

    const modifyTodo = async (id, completed) => {
        //console.log("Modify", id, completed);
        const postData = {
            "completed": completed == 'O' ? 'X' : 'O'
        }
        await axios.patch(url+`/${id}`, postData);
        getTodos();
    };

    const deleteTodo = async (id) => {
        //console.log("Delete", id);
        await axios.delete(url+`/${id}`);
        getTodos();
    };

    const handleReset = (e) => {
        e.preventDefault();
        selRef.current.value = "X";
        ipRef.current.value = "";
    };

    const getTodos = async () => {
        const { data } = await axios.get(url);
        setTdata(data);
    };

    useEffect(() => {
        ipRef.current.focus();
        getTodos();
    },[]);

  return (
    <div className="w-full">
        <p>TodoList</p>
        <TodoForm selRef={selRef} ipRef={ipRef} addHandle={handleOk} resetHandle={handleReset} />
        <ol className="w-full">
            {
                tdata.map((item, idx) => 
                            <TodoItem key={idx} tid={item["id"]} text={item["text"]} completed={item["completed"]} 
                            onDelete={deleteTodo}
                            onUpdate={modifyTodo} />)
            }
        </ol>
    </div>
  )
}
