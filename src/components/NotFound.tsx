import image_404 from 'assets/images/404.svg';

export const NotFound: React.FC = () => {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <img className="max-w-xs" src={image_404} alt="404" />
    </div>
  );
};
