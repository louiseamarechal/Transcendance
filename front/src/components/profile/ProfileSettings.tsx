import NiceBox from '../ui/NiceBox';
import NiceButton from '../ui/NiceButton';

type ProfileSettingsProps = {};

function ProfileSettings() {
  return (
    <NiceBox title="Settings">
      <NiceButton onClick={() => {}}>Coucou</NiceButton>
      <p>Change profile pic here</p>
      <p>change name here ?</p>
    </NiceBox>
  );
}

export default ProfileSettings;
