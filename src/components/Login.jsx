import { useRef, useState } from 'react'
import reactLogo from '../assets/react.svg'
import { useSetAtom } from 'jotai';
import { isLogin } from "../atoms/IsLoginAtom"

export default function Login() {
    const setLogin = useSetAtom(isLogin);
    const [isValidEmail, setIsValidEmail] = useState(true);
    const emailRef = useRef();
    const passRef = useRef();

    const validateEmailFormat = () => {
        if (!(emailRef.current.value).includes("@")) 
            setIsValidEmail(false)
        else 
            setIsValidEmail(true)
    }

    const handleLogin = (e) => {
        e.preventDefault();

        // required 속성으로 해도 된다
        if(emailRef.current.value == ""){
            alert("이메일을 입력하세요");
            emailRef.current.focus();
            return;
        }

        if(passRef.current.value == ""){
            alert("비밀번호를 입력하세요");
            passRef.current.focus();
            return;
        }

        // 임시 : value가 아니라 백엔드 응답 코드에 따라 작성하기
        if(emailRef.current.value != "bgy@pusan.ac.kr") {
            alert("존재하지 않는 아이디입니다.");
            return;
        }

        if(passRef.current.value != "~!1234") {
            alert("비밀번호가 다릅니다.");
            return;
        }

        setLogin(true);
        localStorage.setItem("id", emailRef.current.value);
    }
    
    return (
        <section className="w-full h-full dark:bg-gray-900">
            <div className="h-full flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
                <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-8 h-8 mr-2" src={reactLogo} alt="logo" />
                    Sign In
                </a>
                <div className="w-full bg-white rounded-lg shadow-xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <form className="space-y-4 md:space-y-6" action="#">
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                <input type="email" name="email" id="email" ref={emailRef} onKeyUp={validateEmailFormat} className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                                {!isValidEmail && <p className="text-red-500 text-left">이메일은 @을 포함해야 합니다.</p>}
                            </div>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" ref={passRef} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                    </div>
                                </div>
                                <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                            </div>
                            <button type="submit" onClick={handleLogin} className="w-full bg-sky-400 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <a href="#" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}