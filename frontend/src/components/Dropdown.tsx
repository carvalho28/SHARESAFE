interface DropdownProps {
  label: string;
  name: string;
  defaultValue: { value: string; label: string };
  items: { value: string; label: string }[];
  onSelect: Function;
}

const Dropdown = ({
  label,
  defaultValue,
  items,
  onSelect,
  name,
}: DropdownProps) => {
  return (
    <>
      <label className="block mb-2 text-sm font-medium text-gray-100">
        {label}
      </label>
      <select
        id="countries"
        name={name}
        onChange={(e) => onSelect(e)}
        className="dark:bg-[#333333] dark:text-gray-100 text-sm rounded-lg block w-full p-2"
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default Dropdown;
