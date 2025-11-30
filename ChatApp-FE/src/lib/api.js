export async function streamChat(messages, onChunk, onDone, onError) {
  console.log("📨 Starting stream request...");

  try {
    const res = await fetch("http://localhost:8080/api/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
      },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      onError?.(new Error("Bad response"));
      return;
    }

    if (!res.body) {
      onError?.(new Error("No stream body"));
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) {
        console.log("🟢 Stream finished");
        onDone?.();
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      console.log("📥 RAW CHUNK:", chunk);

      buffer += chunk;
      let lines = buffer.split("\n");

      // keep incomplete line for next chunk
      buffer = lines.pop();

      for (let line of lines) {
        if (!line.startsWith("data:")) continue;

        // Remove first data:
        let payload = line.replace("data:", "").trim();

        // FIX: backend double-prefix bug "data:data: How"
        if (payload.startsWith("data:")) {
          payload = payload.replace("data:", "").trim();
        }

        console.log("➡️ SSE CLEAN:", payload);

        if (payload === "[DONE]") {
          onDone?.();
          return;
        }

        if (payload.length > 0) {
          onChunk?.(payload);
        }
      }
    }
  } catch (err) {
    console.error("🔥 STREAM ERROR:", err);
    onError?.(err);
  }
}
