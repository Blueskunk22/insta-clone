import { getProviders, signIn } from "next-auth/react";
import Header from "../../components/Header";
import { CameraIcon } from "@heroicons/react/outline";
import { ChatIcon } from "@heroicons/react/solid";

// DONT FORGET to add redirect uri on google cloud platform API & Services > Credentials > Edit OAuth 2.0 > paste redirect
// given from Error 400: redirect_uri_mismatch when attempting to login
// Will have to do it once it development for localhost and once when deploying

function SignIn({ providers }) {
  return (
    <>
      <Header />
      <div className="-mt-20 flex min-h-screen flex-col items-center justify-center bg-gray-50 py-2 px-14 text-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#ff9a49] via-[#e9466b] to-[#4663ca] blur-md"></div>
          <div className="relative rounded-lg border-4 border-black bg-white p-4">
            <div className="flex-col items-center space-y-4">
              <img
                className="w-80"
                src="https://links.papareact.com/ocw"
                alt=""
              />
              <p className="font-xs italic">
                Built for educational purposes only
              </p>
              <div className="relative flex items-center justify-center">
                <ChatIcon className="absolute -top-[3.5px] right-[122px] h-8 w-8 text-blue-400" />
                <CameraIcon className="h-14 w-14 text-red-400" />
              </div>

              <div className="mt-40">
                {Object.values(providers).map((provider) => (
                  <div key={provider.name}>
                    <button
                      className="transform cursor-pointer rounded-lg p-3 font-semibold text-blue-400 transition duration-200 ease-out hover:scale-110 hover:border-4 hover:border-blue-400 hover:bg-blue-50"
                      onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                    >
                      Sign in with {provider.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

//SSR
export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}

export default SignIn;
