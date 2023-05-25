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
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
      </label>
      <select
        id="countries"
        name={name}
        onChange={(e) => onSelect(e)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
