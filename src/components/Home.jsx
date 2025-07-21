import { useAtom } from "jotai"
import { isLogin } from "../atoms/IsLoginAtom"
import Login from "./Login"

export default function Home() {
  const [login] = useAtom(isLogin)
  return (
    <div>
      {login ? "로그인되었습니다." : <Login />}
    </div>
  )
}