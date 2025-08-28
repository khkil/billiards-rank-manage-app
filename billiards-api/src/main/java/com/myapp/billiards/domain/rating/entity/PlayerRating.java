package com.myapp.billiards.domain.rating.entity;

import com.myapp.billiards.domain.player.entity.Player;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PlayerRating {
    @Id
    private Long playerId;

    private Integer average;

    private Integer cushion;

    private Integer points;

    @OneToOne
    @MapsId
    @JoinColumn(name = "player_id")
    private Player player;
}