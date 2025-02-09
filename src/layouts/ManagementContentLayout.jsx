const ManagementContentLayout = ({ title = "", children }) => {
  return (
    <div className="divide-y divide-solid divide-gray-200 rounded-sm bg-white">
      <div className="p-4 text-2xl font-extrabold uppercase text-black">
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default ManagementContentLayout;
