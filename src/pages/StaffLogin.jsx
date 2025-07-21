import { useState , useEffect } from 'react';
import { useNavigate } from 'react-router';


function StaffLogin() {

  const [id, setid] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let data = {
        'id' : id,
        'password' : password
    }

    // fetch('')
    // .then((res) => res.json())
    // .then((data) => console.log(data))
    // .error((err) => console.log(err))

    setIsLoading(false)
    navigate('/dashboard')

  }

  

  return (
    <div>
        <section class="bg-gray-50 dark:bg-gray-900 ">
            <div class=" flex flex-col items-center justify-center px-6 py-8 mx-auto h-[100vh]  lg:py-0">
                <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                            Sign in to your account
                        </h1>
                        <form class="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
                            <div>
                                <label for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your ID</label>
                                <input type="text" name="id" id="id" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Staff ID" required onChange={(e) => setid(e.target.value)}/>
                            </div>
                            <div>
                                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            <div className='mt-8'>
                                <button class="w-full text-white text-md bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg  px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:cursor-pointer flex justify-center gap-5" type='submit'>signin </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </section>
    </div>
  );
}

export default StaffLogin