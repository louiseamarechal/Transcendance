const ActivityStatus = (props: { activity: string }) => {
  switch (props.activity) {
    case 'ONLINE':
      return <p className="user-status text-green-500">Online</p>;
    case 'PLAYING':
      return <p className="user-status text-pink-600">Currently playing</p>;
    default:
      return <p className="user-status text-red-600">Offline</p>;
  }
};

export default ActivityStatus;
