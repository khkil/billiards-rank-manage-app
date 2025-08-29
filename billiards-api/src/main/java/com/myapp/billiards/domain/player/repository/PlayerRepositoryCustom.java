package com.myapp.billiards.domain.player.repository;

import com.myapp.billiards.domain.player.dto.PlayerListResponse;

import java.util.List;

public interface PlayerRepositoryCustom {
    List<PlayerListResponse> findAllPlayersByTeam();
}
