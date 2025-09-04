interface Props {
  text: string;
  link?: string;
}

const PrimaryButton = ({ text, link }: Props) => {
  return <button className="bg-accent-500 text-white">{text}</button>;
};

export default PrimaryButton;
