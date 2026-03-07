import Sidebar from "../../components/common/Sidebar";

const UserDashboard = () => {
  return (
    <div className="flex">
      <Sidebar role="user" />

      <main className="flex-1 ml-64 p-6 bg-green-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        <p>
          Welcome to your dashboard! Here you can track your habits, view the
          community, and update your profile.
        </p>
      </main>
    </div>
  );
};

export default UserDashboard;