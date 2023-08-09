import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';
import '../style/pages/2FApage.css';
function TwoFApage() {
  const axiosInstance = useAxiosPrivate();
  const navigate = useNavigate();
  const [code, setCode] = useState('');

  const handleInputChange = (event: any) => {
    setCode(event.target.value);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      axiosInstance
        .post('auth/checkcode', { code })
        .then((res) => {
          navigate('/game');
        })
        .catch((e) => {
          alert('Wrong code/code has expired');
          navigate('/');
        });
      console.log('Code saisi :', code);
    }
  };

  useEffect(() => {
    axiosInstance
      .get('user/me')
      .then((res) => {
        if (res.data.s2fa === 'NOTSET') navigate('/game');
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <p className="text-[25px]">Waiting for two factors authentification</p>
      <h1>Please enter the security code :</h1>
      <input
        type="text"
        value={code}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
export default TwoFApage;
