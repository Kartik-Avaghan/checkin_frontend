import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useToast } from '../components/ToastProvider';
import Loader from '../components/Loader';

import logo from '../assets/logo.jpg'


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const {addToast} = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Invalid username or password");
      }
      return res.text(); // Backend returns token as plain text
    })
    .then((token) => {
      localStorage.setItem("token", token); 
      updatestatus(username);
    })
    .catch((err) => {
      addToast("Invalid username or password", "error");
    })
    .finally(() => { setIsLoading(false); });
  };

  function updatestatus(username){
    fetch(`${import.meta.env.VITE_API_BASE_URL}/users/update/login/${username}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`,
      },
    })
    .then((res) => res.json)
    .then((data) => {console.log(data); navigate("/");})
    .catch((err) => console.log(err))
  }

  useEffect(() => {
    let token = localStorage.getItem("token")
    if(token){
      navigate("/")
    }
  },[])

  if(isLoading){
    return <Loader />;
  }

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex gap-4 flex-col items-center justify-center px-6 py-8 mx-auto h-[100vh] lg:py-0">
          <img src={logo} alt="" className='w-25 h-25 rounded-full'/>
          <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                Sign in
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="username"
                    required
                    autoComplete="current-password"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mt-8">
                  <button
                    className="w-full text-white text-md bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-semibold rounded-lg px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:cursor-pointer flex justify-center gap-5"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;