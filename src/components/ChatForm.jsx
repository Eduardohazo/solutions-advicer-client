import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectLoading, sendMessage } from "../store/chatSlice";

export default function ChatForm() {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (!loading) inputRef.current?.focus();
  }, [loading]);

  function handleSubmit(e) {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || loading) return;

    dispatch(sendMessage(prompt));
    setInput("");
  }

  return (
    <form className="chat__form" onSubmit={handleSubmit} autoComplete="off">
      <input
        className="chat__input"
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe la información que te proporcione el prospecto..."
        maxLength={6000}
        disabled={loading}
        required
      />
      <button className="chat__send" type="submit" disabled={loading}>
        Enviar
      </button>
    </form>
  );
}