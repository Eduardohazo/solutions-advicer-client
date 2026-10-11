import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { resetChat, sendChat } from "../api";
import { advisorText } from "../utils";

const WELCOME_TEXT = "Dame un resumen de la empresa y de cómo opera.";

const welcomeMessage = () => ({
  id: "welcome",
  type: "text",
  role: "assistant",
  text: WELCOME_TEXT,
});

function getUserId() {
  let id = sessionStorage.getItem("ciberseguridad_user_id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("ciberseguridad_user_id", id);
  }
  return id;
}

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  (prompt, { getState }) => sendChat(getState().chat.userId, prompt),
  {
    condition: (prompt, { getState }) =>
      prompt.trim() !== "" && !getState().chat.loading,
  }
);

export const resetConversation = createAsyncThunk(
  "chat/reset",
  async (_, { getState }) => {
    await resetChat(getState().chat.userId);
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    userId: getUserId(),
    messages: [welcomeMessage()],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.loading = true;
        state.messages.push({
          id: `${action.meta.requestId}-user`,
          type: "text",
          role: "user",
          text: action.meta.arg,
        });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;
        const id = action.meta.requestId;

        state.messages.push(
          data.estado === "diagnostico"
            ? { id, type: "diagnosis", role: "assistant", data }
            : { id, type: "text", role: "assistant", text: advisorText(data) }
        );
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.messages.push({
          id: action.meta.requestId,
          type: "text",
          role: "assistant",
          text: `Ocurrió un error: ${action.error.message}`,
          error: true,
        });
      })
      .addCase(resetConversation.fulfilled, (state) => {
        state.messages = [welcomeMessage()];
        state.loading = false;
      });
  },
});

export const selectMessages = (state) => state.chat.messages;
export const selectLoading = (state) => state.chat.loading;

export default chatSlice.reducer;