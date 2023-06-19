import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import '../../style/components/chat/channel-list.css';

function ChannelList(showChannel, setShowChannel) {

  axiosPrivate = useAxiosPrivate();
  return <div className="channel-list">
    <div className="scrollable-list">
      <ul>
        <li>Jean-Jacques</li>
        <li>Marcel</li>
        <li>Thibuat</li>
        <li>Jean-Jacques</li>
        <li>Marcel</li>
        <li>Thibuat</li>
        <li>Jean-Jacques</li>
        <li>Marcel</li>
        <li>Thibuat</li>
        <li>Jean-Jacques</li>
        <li>Marcel</li>
        <li>Thibuat</li>
        <li>Jean-Jacques</li>
        <li>Marcel</li>
        <li>Thibuat</li>
        <li>Jean-Jacques</li>
        <li>Marcel</li>
        <li>Thibuat</li>
      </ul>
    </div>
  </div>;
};

export default ChannelList;
