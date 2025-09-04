interface Props {
  logo?: string;
  title?: string;
  text?: string;
}

const Card = ({ logo, title, text }: Props) => {
  return (
    <div className="shadow-xl rounded-xl h-full flex flex-col flex-1 p-10 bg-white">
      <div>
        <span className="material-icons-round text-7xl mb-3 text-secondary-600">
          {logo}
        </span>
      </div>
      <div>
        <h2 className="font-bold mb-2">{title}</h2>
      </div>
      <div className="text-md">{text}</div>
    </div>
  );
};

export default Card;
