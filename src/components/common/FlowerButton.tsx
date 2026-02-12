import type { CSSProperties } from 'react';
import './FlowerButton.css';

interface FlowerButtonProps {
  text?: string;
  onClick?: () => void;
}

const FlowerButton: React.FC<FlowerButtonProps> = ({ text = 'Flowers', onClick }) => {
  const style = { '--text-ch': text.length } as CSSProperties;

  return (
    <button type="button" className="fancy-btn" onClick={onClick} style={style}>
      <span className="top-key" />
      <span className="fancy-text">{text}</span>
      <span className="bottom-key-1" />
      <span className="bottom-key-2" />
    </button>
  );
};

export default FlowerButton;
