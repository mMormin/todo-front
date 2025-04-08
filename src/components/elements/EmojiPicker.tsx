import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose?: () => void;
  className?: string;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onSelect,
  onClose,
  className,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose?.();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (typeof window === "undefined") return null;

  const picker = (
    <div
      ref={ref}
      className={`
        ${
          isMobile
            ? "fixed inset-0 flex items-center justify-center"
            : "absolute left-14 top-0"
        }
        z-50 ${className || ""}
      `}
    >
      <Picker
        data={data}
        onEmojiSelect={(emoji: any) => {
          onSelect(emoji.native);
          onClose?.();
        }}
        theme="light"
      />
    </div>
  );

  return isMobile ? ReactDOM.createPortal(picker, document.body) : picker;
};

export default EmojiPicker;
