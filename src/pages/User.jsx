import UserTable from "@/components/user/list/UserTable";

const User = ({}) => {
  return (
    <div className="divide-y divide-solid divide-gray-200 rounded-sm bg-white">
      <div className="p-4 text-2xl font-extrabold uppercase text-black">
        Quản lý người dùng
      </div>
      <div className="p-4">
        <UserTable />
      </div>
    </div>
  );
};

export default User;
