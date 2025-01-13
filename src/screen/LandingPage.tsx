import bg from "../assets/Chses.jpg"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"

function LandingPage() {

    const navigate = useNavigate()

  return (
    <div className='h-screen w-screen bg-slate-900' >
        <div className="flex justify-center p-4 h-full " >
            <div>
                <img src={bg} 
                alt="chess-logo"
                className="w-1/2 mt-10"
                />
            </div>
            <div className='h-1/2 flex flex-col items-center justify-center '>
                <div className="flex flex-col text-white text-3xl bg-green-500 py-2 px-4 rounded cursor-pointer">
                    <Button onClick={() => navigate('/game')}>
                        Play Online
                    </Button>
                </div>
        </div>
        </div>
        <div className="absolute bottom-0 ">
        <p className="text-white">
            trully build by me and some tuitorials and my lovely Arena Copilot
            and Chess.js 
        </p>
        </div>
    
    </div>
  )
}

export default LandingPage