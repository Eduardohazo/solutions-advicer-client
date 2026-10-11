import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadCatalog } from "./store/catalogSlice";
import { resetConversation } from "./store/chatSlice";
import MessageList from "./components/MessageList";
import ChatForm from "./components/ChatForm";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadCatalog());
  }, [dispatch]);

  return (
    <main className="chat">
      <header className="chat__header">
        <div>
          <h1 className="chat__title">Consejero Cero Uno</h1>
          <p className="chat__subtitle">
            Copiloto comercial para vendedores consultivos de ciberseguridad
          </p>
        </div>
        <button
          className="chat__reset"
          type="button"
          onClick={() => dispatch(resetConversation())}
        >
          Nueva conversación
        </button>
      </header>

      <MessageList />
      <ChatForm />
    </main>
  );
}