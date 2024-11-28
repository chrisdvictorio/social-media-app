const UserMedia = () => {
  return (
    <div className="hidden p-4 border rounded-lg shadow-lg space-y-4">
      <h2>(max 15 characters's) Photos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <img
          alt=""
          src="lifestyle.jpg"
          className="object-cover rounded-lg h-32"
        />
        <img
          alt=""
          src="lifestyle.jpg"
          className="object-cover rounded-lg h-32"
        />
        <img
          alt=""
          src="lifestyle.jpg"
          className="object-cover rounded-lg h-32"
        />
      </div>
    </div>
  );
};

export default UserMedia;
