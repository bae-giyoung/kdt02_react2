import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import TailButton from '../components/TailButton'

export default function Rest() {
    const [tdata, setTdata] = useState([]);
    const formRef = useRef();
    const baseUrl = "http://localhost:3005/posts";

    const getTdata = async () => {
        const { data } = await axios.get(baseUrl); // axios 사용법!
        console.log(data);
        setTdata(data);
    }

    const clickHandle = async (e) => {
        e.preventDefault();

        if(formRef.current.title.value == "") {
            alert("제목을 입력하세요.");
            return;
        }

        if(formRef.current.author.value == "") {
            alert("저자를 입력하세요.");
            return;
        }

        const postData = {
            "title": formRef.current.title.value,
            "author": formRef.current.author.value,
        }

        let { data } = await axios.post(baseUrl, postData);
        setTdata([...tdata, data]);
    }

    const deleteHandle = async (id) => {
        await axios.delete(`${baseUrl}/${id}`);
        //setTdata()
    }
    
    useEffect(() => {
        getTdata();
    }, []);

    return (
        <>
        <div className='mb-5 p-5 bg-gray-100'>
            <form ref={formRef} method="post" name="postsFrm" className="">
                제목: <input type="text" name="title" className='border-1 mb-2'/><br />
                저자: <input type="text" name="author" className='border-1'/><br /><br />
                <TailButton caption="등록하기" onHandle={clickHandle} color="blue"/>
            </form>
        </div>
        <div className='grid grid-cols-2 lg:grid-cols-4 gap-5'>
        {
            !Array.isArray(tdata)
            ? <ul>
                <li>ID : {tdata.id}</li>
                <li>제목 : {tdata.title}</li>
                <li>저자 : {tdata.author}</li>
            </ul>
            : tdata.map(item => 
                <ul key={item.id} className='text-left bg-amber-100 px-3 py-5 shadow-xl'>
                    <li>제목 : {item.title}</li>
                    <li>저자 : {item.author}</li>
                    <li className="mt-2 text-center">
                        <TailButton caption="삭제하기" onHandle={() => deleteHandle(item.id)} color="orange"/>
                    </li>
                </ul>
            )
        }
        </div>
        </>
    )
}
