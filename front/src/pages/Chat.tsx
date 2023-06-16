import useNavbar from "../hooks/useNavbar.ts";

const Chat = () => {
  const { navbarState } = useNavbar();

  return (
    <>
      {/* <NavBar /> */}
      <div
        className={
          "h-screen flex justify-center items-center " +
          (navbarState ? "opened-nav-margin" : "w-full")
        }
      >
        page()
      </div>
    </>
  );

  return <div></div>;
};

export default Chat;
