import ChannelList from "./ChannelList"
import "../../style/components/chat/channel-nav.css"

const ChannelNav = () => (
	<div className="channel-nav">
		<button className="small-button" id="create-channel">new group chat</button>
		<ChannelList />
	</div>
)

export default ChannelNav