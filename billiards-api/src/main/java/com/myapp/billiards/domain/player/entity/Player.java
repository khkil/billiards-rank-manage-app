package com.myapp.billiards.domain.player.entity;

import com.myapp.billiards.domain.rating.entity.PlayerRating;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String playerName;

    @OneToOne(mappedBy = "player")
    private PlayerRating playerRating;

    @ManyToOne
    private Team team;
}
