export default function UserInfo({ user, changePassword }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg mb-6">
      <h2 className="text-2xl font-semibold mb-4">User Information</h2>
      <div className="space-y-2">
        <p>
          <strong>Username:</strong> {user?.username}
        </p>
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        <p>
          <strong>User ID:</strong> {user?.userId}
        </p>
        <p>
          <strong>Role:</strong> {user?.role}
        </p>
      </div>
      <button
        onClick={changePassword}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Change Password
      </button>
    </div>
  );
}
