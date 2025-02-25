import { ImSearch } from "react-icons/im";
import { BUTTON_HEIGHT } from "../constants";

const SearchInput = ({
  placeholder = "Tìm kiếm",
  width = 400,
  value = "",
  setValue = (value) => {},
  onSubmit = () => {},
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        className="flex items-center rounded-md"
        style={{ height: BUTTON_HEIGHT, width: width }}
      >
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="h-full w-full rounded-s-md border-y border-s border-solid border-gray-200 bg-gray-50 px-4 py-2 text-sm outline-none placeholder:text-gray-400"
        />
        <div className="h-full w-fit rounded-e-md bg-main hover:hover:opacity-80">
          <button className="block h-full w-full px-4 text-white">
            <ImSearch className="text-15px" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchInput;
