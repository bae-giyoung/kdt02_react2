import TailButton from "./TailButton";

export default function TodoItem({tid, text, completed, onUpdate, onDelete}) {
  return (
    <li className="w-full flex py-2 items-center justify-between">
        <p className="w-9/10 text-left cursor-pointer" onClick={() => onUpdate(tid, completed)}>
            <span>{completed == 'O' ? '✅' : '❌' }</span>
            <span className="px-4">{text}</span>
        </p>
        <TailButton color="blue" caption="삭제" onHandle={() => onDelete(tid)} />
    </li>
  )
}