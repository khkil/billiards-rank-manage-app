package com.myapp.billiards.domain.player.controller;

import com.myapp.billiards.domain.player.dto.PlayerListResponse;
import com.myapp.billiards.domain.player.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/players")
@RequiredArgsConstructor
public class PlayerRestController {
    private final PlayerService playerService;

    @GetMapping
    public ResponseEntity<?> getAllPlayers() {
        List<PlayerListResponse> playerList = playerService.getMyTeamPlayers();
        return ResponseEntity.ok().body(playerList);
    }
}
