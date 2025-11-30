package com.chatapp.service;

import com.chatapp.dto.ChatRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

import java.util.HashMap;
import java.util.Map;

@Service
public class OllamaService {

    private final WebClient webClient;
    private final ObjectMapper mapper = new ObjectMapper();

    public OllamaService(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("http://localhost:11434")   // Local LLaMA / Ollama runtime
                .build();
    }

    public Flux<String> streamResponse(ChatRequest request) {

        // Prepare payload for LLaMA
        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama3.2");

        body.put("messages", request.getMessages().stream()
                .filter(m -> m.getContent() != null && !m.getContent().isBlank())
                .map(m -> Map.of(
                        "role", m.getRole(),
                        "content", m.getContent()
                )).toList()
        );

        body.put("stream", true);

        // Hit Ollama endpoint
        return webClient.post()
                .uri("/api/chat")
                .bodyValue(body)
                .retrieve()
                .bodyToFlux(String.class)
                .map(this::extractContent)
                .filter(s -> !s.isBlank());
    }

    // Extract LLaMA streaming chunks
    private String extractContent(String raw) {
        try {
            JsonNode node = mapper.readTree(raw);

            if (node.has("message") &&
                    node.get("message").has("content")) {

                return node.get("message")
                        .get("content")
                        .asText();
            }

        } catch (Exception ignored) {}

        return "";
    }
}
