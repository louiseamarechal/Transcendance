import { SetStateAction, useState } from 'react';
// import '../../../../style/components/chat/chat-container/create-channel-form/form-header.css';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import '../../../style/components/chat/chat-container/create-channel-form/form-header.css';
import Avatar from '../../ui/Avatar';
import useChannel from '../../../hooks/useChannel';

const FormHeader = ({
  avatar,
  setAvatar,
  setChannelName,
}: {
  avatar: string;
  setAvatar: React.Dispatch<SetStateAction<string>>;
  setChannelName: React.Dispatch<SetStateAction<string | undefined>>;
}) => {
  const [image, setImage] = useState({ preview: '', data: '' });
  const axiosInstance = useAxiosPrivate();
  const [changingAvatar, setChangingAvatar] = useState(true);

  const handleSubmit = async (e) => {
    console.log({ avatar });
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', image.data);
    console.log(image.data);
    console.log(formData);
    try {
      await axiosInstance({
        method: 'post',
        url: '/channel/upload-avatar',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error) {
      console.log(error);
    }
    setChangingAvatar(false);
  };

  const handleFileChange = (e) => {
    if (!changingAvatar) {
      setChangingAvatar(true);
    }
    console.log({ targetFile: e.target.files[0] });
    console.log({ targetFileType: typeof e.target.files[0] });
    const img = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setImage(img);
    setAvatar(img.data.name);
  };

  return (
    <div className="form-header">
      <div className="avatar-wrapper flex flex-row items-end w-fit">
        {image.data ? (
          image.preview && <img src={image.preview} className="avatar-sm" />
        ) : (
          <Avatar file={avatar} small={true} />
          // <img src={avatar} className="avatar-sm" />
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            onChange={handleFileChange}
            // onChange={(event) => changeAvatar(event.target.value)}
            className="avatar-sm form-avatar"
          />
          {changingAvatar ? (
            <button
              type="submit"
              className="bg-transparent text-black	
            text-xs"
            >
              ok
            </button>
          ) : (
            <></>
          )}
        </form>
        {/* <input
          type="file"
          onChange={(event) => changeAvatar(event)}
          className="avatar-sm form-avatar"
        ></input> */}
      </div>
      <input
        className="channel-name"
        maxLength={15}
        placeholder="Channel name..."
        onChange={(event) => setChannelName(event.target.value)}
      ></input>
    </div>
  );
};

export default FormHeader;
