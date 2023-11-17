import { RingLoader } from 'react-spinners';

export const Loading: React.FC = () => {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <RingLoader color="#f0aa12" />
    </div>
  );
};
