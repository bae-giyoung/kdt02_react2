import { useAtomValue } from "jotai"
import { isLogin } from "../atoms/IsLoginAtom"
import Login from "./Login"

export default function Home() {
  const login = useAtomValue(isLogin);
  const id = localStorage.getItem("id");
  return (
    <>
      {login ? id + "님, 로그인되었습니다." : <Login />}
    </>
  )
}