import Diagnosis from "./Diagnosis";

export default function Message({ message }) {
  if (message.type === "diagnosis") {
    return (
      <div className="message message--assistant">
        <div className="message__bubble message__bubble--diagnosis">
          <Diagnosis data={message.data} />
        </div>
      </div>
    );
  }

  return (
    <div className={`message message--${message.role}`}>
      <div className={`message__bubble${message.error ? " message__bubble--error" : ""}`}>
        {message.text}
      </div>
    </div>
  );
}