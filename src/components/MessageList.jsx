import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectLoading, selectMessages } from "../store/chatSlice";
import Message from "./Message";

export default function MessageList() {
  const messages = useSelector(selectMessages);
  const loading = useSelector(selectLoading);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  return (
    <section
      className="chat__messages"
      ref={ref}
      aria-live="polite"
      aria-label="Conversación"
    >
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}

      {loading && (
        <div className="message message--assistant">
          <div className="message__bubble message__bubble--loading">Pensando...</div>
        </div>
      )}
    </section>
  );
}