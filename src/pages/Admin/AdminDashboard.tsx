import Sidebar from "../../components/common/Sidebar";

const AdminDashboard = () => {
  return (
    <div className="flex">
      <Sidebar role="admin" />

      <main className="flex-1 ml-64 p-6 bg-green-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p>
          Welcome Admin! Here you can manage users, posts, and monitor the
          platform.
        </p>
      </main>
    </div>
  );
};

export default AdminDashboard;