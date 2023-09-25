import NiceBox from '../ui/NiceBox';
import NiceButton from '../ui/NiceButton';

type ProfileSettingsProps = {
  is2FASet: boolean;
  handle2FA: () => void;
};

function ProfileSettings({ is2FASet, handle2FA }: ProfileSettingsProps) {
  const buttonLabel = is2FASet ? 'Unset 2FA' : 'Set 2FA';
  return (
    <NiceBox title="Settings">
      <NiceButton onClick={handle2FA}>{buttonLabel}</NiceButton>
    </NiceBox>
  );
}

export default ProfileSettings;
