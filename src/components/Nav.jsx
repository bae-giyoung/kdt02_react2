import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'

export default function Nav() {
  return (
    <header className='w-full min-h-20 flex justify-between items-center
                          bg-amber-50 px-10'>
        <div className='flex gap-2'>
            <img src={reactLogo} alt="react logo" />
            +
            <img src={viteLogo} alt="vite logo" />
        </div>
        <div className='text-2xl font-bold text-green-800'>
            홈으로
        </div>
        <div className="mr-10 text-xl font-bold p-2 border border-green-700 text-green rounded-xl">
            로그인
        </div>
    </header>
  )
}
