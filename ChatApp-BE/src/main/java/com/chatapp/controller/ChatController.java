package com.chatapp.controller;

import com.chatapp.dto.ChatRequest;
import com.chatapp.service.OllamaService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final OllamaService ollamaService;

    public ChatController(OllamaService ollamaService) {
        this.ollamaService = ollamaService;
    }

    @PostMapping(
            value = "/stream",
            produces = MediaType.TEXT_EVENT_STREAM_VALUE
    )
    public Flux<String> stream(@RequestBody ChatRequest request) {

        return ollamaService.streamResponse(request)
                .filter(s -> !s.isBlank())
                .map(s -> "data: " + s + "\n\n");  // EventSource-compatible format
    }
}
