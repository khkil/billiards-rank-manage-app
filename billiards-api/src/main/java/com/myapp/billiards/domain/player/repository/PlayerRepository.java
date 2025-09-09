package com.myapp.billiards.domain.player.repository;

import com.myapp.billiards.domain.player.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlayerRepository extends JpaRepository<Player, Long>, PlayerRepositoryCustom {
}
