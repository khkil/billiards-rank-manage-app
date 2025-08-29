package com.myapp.billiards.domain.player.service;

import com.myapp.billiards.domain.player.dto.PlayerListResponse;
import com.myapp.billiards.domain.player.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlayerService {
    private final PlayerRepository playerRepository;

    public List<PlayerListResponse> getMyTeamPlayers() {
        return playerRepository.findAllPlayersByTeam();
    }

}
