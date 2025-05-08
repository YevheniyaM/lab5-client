const SearchInput = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search"
      className="w-3/4 sm:w-1/2 md:w-1/3 pt-1 focus:outline-none font-jomhuria bg-black/50 px-2 text-3xl"
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchInput;
