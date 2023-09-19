import NiceButton from '../../../components/ui/NiceButton';

function GameWaitMatch() {
  return (
    <>
      <p>Waiting for your opponent</p>
      <br />
      <div className="spinner"></div>
      <br />
      <NiceButton onClick={() => {}}>Cancel</NiceButton>
      {/* {error && <p className="text-red-500">{error}</p>} */}
    </>
  );
}

export default GameWaitMatch;
