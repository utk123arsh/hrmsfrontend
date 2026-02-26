export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-red-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className="text-4xl text-red-600 opacity-20">{icon}</div>
      </div>
    </div>
  );
}
