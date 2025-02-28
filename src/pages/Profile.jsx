import ChangePassword from "@/components/profile/ChangePassword";
import EditProfile from "@/components/profile/EditProfile";
import { useDynamicTitle } from "@/hooks";
import { useState } from "react";

const tabs = {
  profile: { key: "profile", label: "Hồ sơ", element: <EditProfile /> },
  "change-password": {
    key: "change-password",
    label: "Đổi mật khẩu",
    element: <ChangePassword />,
  },
};

const Profile = ({}) => {
  useDynamicTitle("Trang cá nhân");

  const [selectedTab, setSelectedTab] = useState(tabs.profile.key);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-4">
          {Object.values(tabs).map((tab, i) => (
            <button
              key={`profile-page-tab-${i}-${tab.key}`}
              className={`rounded-full border border-solid border-gray-300 px-6 py-2.5 text-sm font-semibold text-black hover:border-main hover:text-main ${selectedTab === tab.key ? "border-main bg-main text-white hover:text-white" : ""}`}
              onClick={() => setSelectedTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div
        className="w-full rounded-sm bg-white px-6 py-4"
        style={{ height: "calc(100vh - 180px)" }}
      >
        {tabs?.[selectedTab]?.element}
      </div>
    </div>
  );
};

export default Profile;
