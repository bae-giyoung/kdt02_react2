import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import { Link } from 'react-router-dom'
import { useAtom } from 'jotai'
import { isLogin } from '../atoms/IsLoginAtom'

export default function Nav() {
    const [login, setLogin] = useAtom(isLogin);

    const handleLogout = () => {
        localStorage.removeItem("id");
        setLogin(false);
    }

    return (
        <header className='w-full min-h-20 flex justify-between items-center
                            bg-amber-50 px-10'>
            <div className='flex gap-2'>
                <img src={reactLogo} alt="react logo" />
                +
                <img src={viteLogo} alt="vite logo" />
            </div>
            
            <div className='text-2xl font-bold text-green-800'>
                <ul className='flex justify-center gap-2'>
                    <li><Link to='/' className='block px-2 hover:bg-green-800 rounded-xl hover:text-white'>홈으로</Link></li>
                    {login && <li><Link to='/subway' className='block px-2 hover:bg-green-800 rounded-xl hover:text-white'>지하철 대기 정보</Link></li>}
                </ul>
            </div>
            
            <div className="mr-10 text-xl font-bold p-2 border border-green-700 text-green rounded-xl">
                <Link to='/login' className='block w-full w-hull cursor-pointer hover:bg-green-800 rounded-xl hover:text-white'>
                    {login ? <span onClick={handleLogout}>로그아웃</span> : '로그인'}
                </Link>
            </div>
        </header>
    )
}
