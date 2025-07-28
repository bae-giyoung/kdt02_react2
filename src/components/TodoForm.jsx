import TailButton from "./TailButton"

export default function TodoForm({selRef, ipRef, addHandle, resetHandle}) {
  return (
    <form className="w-full grid grid-cols-5 gap-4 bg-gray-200 py-3 px-4">
            <select name="completed" ref={selRef}
                className='block p-2 ps-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white 
                focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 
                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                <option value="X">X</option>
                <option value="O">O</option>
            </select>
            <input name="tasks" type="text" ref={ipRef} 
            className='block col-span-2 p-2 ps-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white 
                focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 
                dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' />
        
            <TailButton onHandle={addHandle} color="blue" caption="확인" />
            <TailButton onHandle={resetHandle} color="blue" caption="취소" />
    </form>
  )
}