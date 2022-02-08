function Story({ img, username }) {
  return (
    <div className="z-0">
      <div className="mx-auto h-14 w-14  transform rounded-full bg-gradient-to-r from-[#ff9a49] via-[#e9466b] to-[#4663ca] p-[4px] transition duration-200 ease-out hover:scale-110">
        <div className="flex h-full flex-col items-center justify-between rounded-full bg-white text-white">
          <img
            className="h-14 w-14 rounded-full object-contain"
            src={img}
            alt="User Profile Pic"
          />
        </div>
      </div>

      <p className="mt-1 w-14 truncate text-center text-xs font-semibold text-gray-600">
        {username}
      </p>
    </div>
  );
}

export default Story;
